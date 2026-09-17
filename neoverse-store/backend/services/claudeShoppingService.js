const Anthropic = require('@anthropic-ai/sdk');

let client;

const getClient = () => {
  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
    return null;
  }

  if (!client) {
    client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || undefined,
      authToken: process.env.ANTHROPIC_AUTH_TOKEN || undefined,
      timeout: 60_000,
      maxRetries: 2,
    });
  }

  return client;
};

const toMessage = (entry) => ({
  role: entry.role === 'assistant' ? 'assistant' : 'user',
  content: String(entry.content || '').slice(0, 4000),
});

const buildCatalog = (products) => products.map((product) => {
  const price = product.price - (product.price * (product.discount || 0)) / 100;
  const capabilities = [
    product.modelUrl ? '3D model' : null,
    product.isARSupported ? 'AR' : null,
    product.isVRSupported ? 'VR showroom' : null,
  ].filter(Boolean).join(', ') || 'standard product media';

  return {
    id: product._id.toString(),
    name: product.name,
    brand: product.brand,
    category: product.category,
    price: Number(price.toFixed(2)),
    originalPrice: Number(product.price.toFixed(2)),
    discount: product.discount || 0,
    rating: product.rating,
    stock: product.stock,
    availability: product.stock > 0 ? 'Available' : 'Out of stock',
    capabilities,
    description: String(product.description || '').slice(0, 500),
    specifications: (product.specifications || []).slice(0, 12),
  };
});

const extractText = (message) => {
  if (message.stop_reason === 'refusal') {
    return 'I can help compare products and explain the available product details, but I cannot answer that request.';
  }

  return (message.content || [])
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('\n')
    .trim() || 'I could not find enough product information to answer that yet.';
};

const answerShoppingQuestion = async ({ message, history = [], products }) => {
  const anthropic = getClient();
  if (!anthropic) return null;

  const catalog = buildCatalog(products);
  const system = [
    {
      type: 'text',
      text: 'You are the NeoVerse shopping advisor. Help a customer make a confident product decision using only the catalog supplied below.',
      cache_control: { type: 'ephemeral' },
    },
    {
      type: 'text',
      text: `CATALOG JSON:\n${JSON.stringify(catalog)}\n\nRules:\n- Recommend only products whose id exists in the catalog.\n- Never invent stock, dimensions, materials, delivery dates, reviews, or capabilities.\n- If the catalog does not contain the answer, say what is missing and suggest opening the product page.\n- Compare products using concrete differences: price, stock, category, rating, capabilities, and provided specifications.\n- Treat AR/3D/VR as inspection tools, not as a reason to buy by themselves.\n- Do not calculate or promise final checkout totals; checkout uses a server quote.\n- Keep answers concise, practical, and conversational.\n- When recommending products, include their catalog ids in a final line using this exact format: RECOMMENDATIONS: id1,id2 (or RECOMMENDATIONS: none).`,
    },
  ];

  const safeHistory = Array.isArray(history)
    ? history.filter((entry) => entry && (entry.role === 'user' || entry.role === 'assistant')).slice(-8).map(toMessage)
    : [];

  const response = await anthropic.messages.create({
    model: process.env.ANTHROPIC_MODEL || 'claude-3-5-haiku-latest',
    max_tokens: 1200,
    thinking: { type: 'adaptive' },
    system,
    messages: [...safeHistory, { role: 'user', content: message.slice(0, 4000) }],
  });

  const text = extractText(response);
  const recommendationLine = text.match(/RECOMMENDATIONS:\s*([^\n]+)/i)?.[1]?.trim() || 'none';
  const recommendationIds = recommendationLine === 'none'
    ? []
    : recommendationLine.split(',').map((id) => id.trim()).filter((id) => catalog.some((product) => product.id === id));

  return {
    response: text.replace(/\n?RECOMMENDATIONS:\s*[^\n]+/i, '').trim(),
    recommendationIds,
    usage: response.usage,
    model: response.model,
  };
};

module.exports = { answerShoppingQuestion, getClient };
