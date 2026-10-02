const crypto = require('crypto');

// @desc    Create Razorpay Order or Mock Order
// @route   POST /api/payments/create-order
// @access  Private
const createPaymentOrder = async (req, res, next) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid amount is required' });
    }

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    // If real Razorpay credentials exist, attempt real Razorpay order creation
    if (razorpayKeyId && razorpayKeySecret) {
      try {
        const Razorpay = require('razorpay');
        const instance = new Razorpay({
          key_id: razorpayKeyId,
          key_secret: razorpayKeySecret,
        });

        const order = await instance.orders.create({
          amount: Math.round(amount * 100), // In paise
          currency,
          receipt: receipt || `rcpt_${Date.now()}`,
        });

        return res.json({
          success: true,
          isMock: false,
          keyId: razorpayKeyId,
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
        });
      } catch (rzpErr) {
        console.warn('Real Razorpay initialization failed, falling back to mock mode:', rzpErr.message);
      }
    }

    // Otherwise return development mock payment order
    const mockOrderId = `order_mock_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    res.json({
      success: true,
      isMock: true,
      keyId: 'rzp_test_cinebook_mock_key',
      orderId: mockOrderId,
      amount: Math.round(amount * 100),
      currency,
      message: 'Mock Payment Mode Active (Development)',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay payment signature or Mock payment
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, isMock } = req.body;

    if (isMock) {
      // Mock payment verification succeeds in test mode
      return res.json({
        success: true,
        verified: true,
        isMock: true,
        message: 'Mock payment verified successfully',
      });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return res.status(400).json({
        success: false,
        message: 'Razorpay secret key not configured on server',
      });
    }

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature === razorpaySignature) {
      return res.json({
        success: true,
        verified: true,
        isMock: false,
        message: 'Razorpay payment signature verified successfully',
      });
    } else {
      return res.status(400).json({
        success: false,
        verified: false,
        message: 'Invalid payment signature',
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
};
