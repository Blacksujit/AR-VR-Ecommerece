const Product = require('../models/Product');
const { AppError } = require('../middleware/errorHandler');

const getAvailableModel = () => {
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

const buildProductContext = async (query) => {
  const searchTerms = query.toLowerCase().split(' ').filter(t => t.length > 2);
  const priceMatch = query.match(/under\s*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/i);
  const minRatingMatch = query.match(/(\d+)\s*star/i);

  const dbQuery = {};
  if (searchTerms.length > 0) {
    dbQuery.$or = [
      { name: { $regex: searchTerms.join('|'), $options: 'i' } },
      { description: { $regex: searchTerms.join('|'), $options: 'i' } },
      { tags: { $in: searchTerms } },
      { category: { $regex: searchTerms.join('|'), $options: 'i' } },
    ];
  }
  if (priceMatch) {
    const maxPrice = parseInt(priceMatch[1].replace(/,/g, ''));
    dbQuery.price = { ...dbQuery.price, $lte: maxPrice };
  }
  if (minRatingMatch) {
    dbQuery.rating = { $gte: parseInt(minRatingMatch[1]) };
  }

  const products = await Product.find(dbQuery)
    .select('name slug price description rating category tags images discount stock brand')
    .limit(20)
    .lean();

  return products;
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
          response: 'AI shopping assistant is not configured. Please set OPENAI_API_KEY or GEMINI_API_KEY in the backend environment variables.',
          products: [],
        },
      });
    }

    const products = await buildProductContext(message);
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
- Suggest accessories when relevant.`;

    const chatHistory = (history || []).map(h => ({
      role: h.role,
      content: h.content,
    }));

    let response;
    if (model === 'openai') {
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

    res.json({
      success: true,
      data: {
        response,
        products: products.map(p => ({
          _id: p._id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          discount: p.discount,
          images: p.images,
          rating: p.rating,
          category: p.category,
        })),
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

    const products = await buildProductContext(q);

    res.json({
      success: true,
      data: products.map(p => ({
        _id: p._id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        discount: p.discount,
        images: p.images,
        rating: p.rating,
        category: p.category,
      })),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { chat, search };
