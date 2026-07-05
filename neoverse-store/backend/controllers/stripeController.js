const Order = require('../models/Order');
const Product = require('../models/Product');
const { AppError } = require('../middleware/errorHandler');

let stripeInstance = null;

const getStripe = () => {
  if (!stripeInstance) {
    const Stripe = require('stripe');
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new AppError('Stripe is not configured. Set STRIPE_SECRET_KEY in environment variables.', 500);
    }
    stripeInstance = Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeInstance;
};

const createCheckoutSession = async (req, res, next) => {
  try {
    const { items, shippingAddress } = req.body;
    console.log(`[Stripe] createCheckoutSession: ${req.user?.email}, items=${items?.length || 0}`);

    if (!items || items.length === 0) {
      return next(new AppError('No items in cart', 400));
    }

    const lineItems = [];
    let itemsPrice = 0;

    for (const item of items) {
      console.log(`[Stripe] Looking up product: ${item.product}`);
      const product = await Product.findById(item.product);
      if (!product) {
        console.log(`[Stripe] Product not found: ${item.product}`);
        return next(new AppError(`Product not found: ${item.product}`, 404));
      }
      console.log(`[Stripe] Product found: ${product.name}, price=${product.price}, stock=${product.stock}`);
      if (product.stock < item.quantity) {
        return next(
          new AppError(`Insufficient stock for ${product.name}`, 400)
        );
      }

      const unitPrice = product.discount > 0
        ? Math.round(product.price * (1 - product.discount / 100) * 100)
        : Math.round(product.price * 100);

      const validImages = (product.images || []).filter(img => typeof img === 'string' && (img.startsWith('http://') || img.startsWith('https://')));
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            images: validImages.length > 0 ? [validImages[0]] : undefined,
            description: product.description?.substring(0, 200),
          },
          unit_amount: unitPrice,
        },
        quantity: item.quantity,
      });

      itemsPrice += (unitPrice / 100) * item.quantity;
    }

    const shippingPrice = itemsPrice >= 100 ? 0 : 9.99;
    const taxRate = 0.08;
    const taxPrice = Math.round(itemsPrice * taxRate * 100) / 100;
    const totalPrice = Math.round((itemsPrice + shippingPrice + taxPrice) * 100) / 100;

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      customer_email: req.user.email,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'DE', 'FR', 'AU', 'IN', 'JP', 'SG', 'AE'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: Math.round(shippingPrice * 100), currency: 'usd' },
            display_name: shippingPrice === 0 ? 'Free Shipping' : 'Standard Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 5 },
              maximum: { unit: 'business_day', value: 10 },
            },
          },
        },
      ],
      metadata: {
        userId: req.user._id.toString(),
        shippingAddress: JSON.stringify(shippingAddress || {}),
        itemsPrice: itemsPrice.toString(),
        shippingPrice: shippingPrice.toString(),
        taxPrice: taxPrice.toString(),
      },
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout?canceled=true`,
    });

    res.json({
      success: true,
      data: {
        url: session.url,
        sessionId: session.id,
      },
    });
  } catch (error) {
    console.error(`[Stripe] createCheckoutSession error:`, error.type || '', error.message || error, error.raw?.message || '', error.statusCode ? `status=${error.statusCode}` : '');
    next(error);
  }
};

const handleWebhook = async (req, res) => {
  try {
    getStripe();
  } catch {
    return res.status(500).json({ success: false, message: 'Stripe not configured' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = getStripe().webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err.message);
    return res.status(400).json({ success: false, message: 'Invalid signature' });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      const metadata = session.metadata;
      const userId = metadata.userId;
      const shippingAddressRaw = metadata.shippingAddress;

      const lineItems = await getStripe().checkout.sessions.listLineItems(session.id);

      const items = lineItems.data.map((item) => ({
        product: item.price?.product_metadata?.productId || null,
        quantity: item.quantity,
        price: item.amount_total / 100 / item.quantity,
      }));

      const itemsPrice = parseFloat(metadata.itemsPrice || '0');
      const shippingPrice = parseFloat(metadata.shippingPrice || '0');
      const taxPrice = parseFloat(metadata.taxPrice || '0');
      const totalPrice = parseFloat((session.amount_total / 100).toFixed(2));

      let shippingAddress = {};
      if (shippingAddressRaw && shippingAddressRaw !== '{}') {
        try {
          shippingAddress = JSON.parse(shippingAddressRaw);
        } catch {
          shippingAddress = {
            fullName: session.customer_details?.name || '',
            phone: session.customer_details?.phone || '',
            street: session.shipping_details?.address?.line1 || '',
            city: session.shipping_details?.address?.city || '',
            state: session.shipping_details?.address?.state || '',
            zip: session.shipping_details?.address?.postal_code || '',
            country: session.shipping_details?.address?.country || '',
          };
        }
      } else if (session.shipping_details) {
        shippingAddress = {
          fullName: session.customer_details?.name || '',
          phone: session.customer_details?.phone || '',
          street: session.shipping_details.address?.line1 || '',
          city: session.shipping_details.address?.city || '',
          state: session.shipping_details.address?.state || '',
          zip: session.shipping_details.address?.postal_code || '',
          country: session.shipping_details.address?.country || '',
        };
      }

      const User = require('../models/User');
      const user = await User.findById(userId).populate('wishlist');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const order = await Order.create({
        user: userId,
        items,
        shippingAddress,
        paymentMethod: 'stripe',
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        isPaid: true,
        paidAt: new Date(),
        status: 'confirmed',
        stripeSessionId: session.id,
      });

      for (const item of items) {
        if (item.product) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.quantity },
          });
        }
      }

      console.log(`Order created: ${order._id} for user ${userId}`);
    } catch (error) {
      console.error('Error processing checkout.session.completed:', error);
    }
  }

  res.json({ received: true });
};

const getSessionStatus = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    if (!sessionId) {
      return next(new AppError('Session ID is required', 400));
    }

    const session = await getStripe().checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      const order = await Order.findOne({ stripeSessionId: sessionId })
        .populate('items.product', 'name slug images price');

      if (order) {
        return res.json({
          success: true,
          data: {
            status: 'complete',
            paymentStatus: session.payment_status,
            order,
          },
        });
      }
    }

    res.json({
      success: true,
      data: {
        status: session.status,
        paymentStatus: session.payment_status,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCheckoutSession,
  handleWebhook,
  getSessionStatus,
};
