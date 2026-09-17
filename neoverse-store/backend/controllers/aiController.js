const Product = require('../models/Product');
const { AppError } = require('../middleware/errorHandler');
const { answerShoppingQuestion, getClient: getClaudeClient } = require('../services/claudeShoppingService');

const getAvailableModel = () => {
  if (getClaudeClient()) return 'claude';
  const openaiKey = process.env.OPENAI_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  if (openaiKey) return 'openai';
  if (geminiKey) return 'gemini';
  return null;
};

const queryOpenAI = async (messages) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

const queryGemini = async (messages) => {
  const history = messages.slice(0, -1).map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));
  const lastMessage = messages[messages.length - 1].content;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          ...history,
          { role: 'user', parts: [{ text: lastMessage }] },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${error}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
};

const extractIntent = (query) => {
  const normalized = query.toLowerCase();
  const priceMatch = query.match(/(?:under|below|less than|max(?:imum)?(?: budget)?(?: of)?)\s*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/i);
  const minRatingMatch = query.match(/(\d+(?:\.\d+)?)\s*star/i);
  const wantsInspection = /\b(3d|ar|augmented reality|vr|virtual reality|inspect|place in|room|space)\b/i.test(normalized);
  const wantsComparison = /\b(compare|comparison|versus|vs\.?|difference|which one|better)\b/i.test(normalized);
  const wantsAvailability = /\b(in stock|available|availability|ready to ship)\b/i.test(normalized);
  const intent = wantsComparison ? 'compare'
    : wantsInspection ? 'inspection'
      : wantsAvailability ? 'availability'
        : priceMatch ? 'budget'
          : 'discover';

  return {
    intent,
    maxPrice: priceMatch ? Number(priceMatch[1].replace(/,/g, '')) : null,
    minRating: minRatingMatch ? Number(minRatingMatch[1]) : null,
    wantsInspection,
    wantsComparison,
    wantsAvailability,
  };
};

const buildProductContext = async (query) => {
  const intent = extractIntent(query);
  const searchTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2 && !['under', 'below', 'best', 'with', 'that', 'this', 'what', 'which'].includes(t));

  const dbQuery = {};
  if (searchTerms.length > 0) {
    dbQuery.$or = [
      { name: { $regex: searchTerms.join('|'), $options: 'i' } },
      { description: { $regex: searchTerms.join('|'), $options: 'i' } },
      { tags: { $in: searchTerms } },
      { category: { $regex: searchTerms.join('|'), $options: 'i' } },
    ];
  }
  if (intent.maxPrice !== null) {
    dbQuery.price = { ...dbQuery.price, $lte: intent.maxPrice };
  }
  if (intent.minRating !== null) {
    dbQuery.rating = { $gte: intent.minRating };
  }
  if (intent.wantsAvailability) {
    dbQuery.stock = { $gt: 0 };
  }
  if (intent.wantsInspection) {
    const inspectionQuery = [
      { modelUrl: { $exists: true, $ne: '' } },
      { isARSupported: true },
      { isVRSupported: true },
    ];
    if (dbQuery.$or) {
      dbQuery.$and = [{ $or: dbQuery.$or }, { $or: inspectionQuery }];
      delete dbQuery.$or;
    } else {
      dbQuery.$or = inspectionQuery;
    }
  }

  const products = await Product.find(dbQuery)
    .select('name slug price description rating category tags images discount stock brand modelUrl isARSupported isVRSupported specifications')
    .sort({ stock: -1, rating: -1 })
    .limit(20)
    .lean();

  return { products, intent };
};

const chat = async (req, res, next) => {
  try {
    const { message, history } = req.body;
    if (!message?.trim()) {
      return next(new AppError('Message is required', 400));
    }

    const model = getAvailableModel();
    if (!model) {
      return res.json({
        success: true,
        data: {
          response: 'Shopping guidance is not configured. Add ANTHROPIC_API_KEY, OPENAI_API_KEY, or GEMINI_API_KEY to the backend environment.',
          products: [],
        },
      });
    }

    const { products, intent } = await buildProductContext(message);
    const productCatalog = products.length > 0
      ? products.map(p =>
          `- ${p.name} ($${p.discount > 0 ? (p.price * (1 - p.discount / 100)).toFixed(2) : p.price.toFixed(2)}): ${p.description?.substring(0, 150)} | Rating: ${p.rating}/5 | Category: ${p.category}${p.discount > 0 ? ` | ${p.discount}% OFF!` : ''}`
        ).join('\n')
      : 'No matching products found in inventory.';

    const systemPrompt = `You are NeoVerse AI, a helpful shopping assistant for an AR/VR e-commerce store. 
Your role is to help users find products, compare items, and make purchase decisions.

PRODUCT CATALOG:
${productCatalog}

RULES:
- ONLY recommend products from the PRODUCT CATALOG above. NEVER hallucinate products.
- If no products match, suggest broader search terms or categories.
- Be concise and helpful. Format responses in plain text with short paragraphs.
- When recommending products, explain WHY they match the user's needs.
- Include relevant details: price, rating, discount, category.
- For comparisons, create simple side-by-side comparisons.
- For gift recommendations, consider the recipient's interests.
- For specification explanations, use simple analogies.
- When summarizing reviews, be balanced.
- Suggest accessories when relevant.
- The current deterministic query intent is ${intent.intent}. Treat its filters as authoritative.
- If the user asks for a comparison, compare only the returned catalog products.
- If a field is absent, say it is not provided.
- Do not claim that a product matches a preference unless the catalog evidence supports it.`;

    const chatHistory = (history || []).map(h => ({
      role: h.role,
      content: h.content,
    }));

    let response;
    let recommendationIds = [];
    let usage;
    let providerModel;
    if (model === 'claude') {
      const result = await answerShoppingQuestion({ message, history: chatHistory, products });
      response = result.response;
      recommendationIds = result.recommendationIds;
      usage = result.usage;
      providerModel = result.model;
    } else if (model === 'openai') {
      response = await queryOpenAI([
        { role: 'system', content: systemPrompt },
        ...chatHistory,
        { role: 'user', content: message },
      ]);
    } else {
      response = await queryGemini([
        { role: 'system', content: systemPrompt },
        ...chatHistory,
        { role: 'user', content: message },
      ]);
    }

    const recommendationIdSet = new Set(recommendationIds.map((id) => id.toString()));

    res.json({
      success: true,
      data: {
        response,
        intent,
        evidence: products.map(p => ({
          productId: p._id,
          fields: {
            price: Number((p.discount > 0 ? p.price * (1 - p.discount / 100) : p.price).toFixed(2)),
            availability: p.stock > 0 ? 'Available' : 'Out of stock',
            rating: p.rating,
            category: p.category,
            capabilities: {
              model3d: Boolean(p.modelUrl),
              ar: Boolean(p.isARSupported),
              vr: Boolean(p.isVRSupported),
            },
          },
        })),
        products: products.map(p => ({
          _id: p._id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          discount: p.discount,
          originalPrice: p.price,
          currentPrice: Number((p.discount > 0 ? p.price * (1 - p.discount / 100) : p.price).toFixed(2)),
          images: p.images,
          rating: p.rating,
          stock: p.stock,
          availability: p.stock > 0 ? 'Available' : 'Out of stock',
          category: p.category,
          brand: p.brand,
          capabilities: {
            model3d: Boolean(p.modelUrl),
            ar: Boolean(p.isARSupported),
            vr: Boolean(p.isVRSupported),
          },
          specifications: (p.specifications || []).slice(0, 6),
          recommended: recommendationIdSet.has(p._id.toString()),
        })),
        provider: model,
        model: providerModel,
        usage: usage ? {
          inputTokens: usage.input_tokens,
          outputTokens: usage.output_tokens,
          cacheReadInputTokens: usage.cache_read_input_tokens || 0,
        } : undefined,
      },
    });
  } catch (error) {
    console.error('AI chat error:', error);
    next(error);
  }
};

const search = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q?.trim()) {
      return next(new AppError('Search query is required', 400));
    }

    const { products, intent } = await buildProductContext(q);

    res.json({
      success: true,
      data: {
        intent,
        products: products.map(p => ({
          _id: p._id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          discount: p.discount,
          originalPrice: p.price,
          currentPrice: Number((p.discount > 0 ? p.price * (1 - p.discount / 100) : p.price).toFixed(2)),
          images: p.images,
          rating: p.rating,
          stock: p.stock,
          availability: p.stock > 0 ? 'Available' : 'Out of stock',
          category: p.category,
          brand: p.brand,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { chat, search };
