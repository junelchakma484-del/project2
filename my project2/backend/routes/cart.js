const express = require('express');
const { body, validationResult } = require('express-validator');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get user's cart
router.get('/', authenticateToken, async (req, res) => {
  try {
    let cart = await Cart.getCartWithProducts(req.user._id);
    
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
      await cart.save();
    }

    res.json({ cart });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add item to cart
router.post('/add', authenticateToken, [
  body('productId').isMongoId().withMessage('Valid product ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId, quantity } = req.body;

    // Check if product exists and is active
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    // Get or create cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Add item to cart
    await cart.addItem(productId, quantity, product.price);

    // Get updated cart with populated products
    cart = await Cart.getCartWithProducts(req.user._id);

    res.json({
      message: 'Item added to cart successfully',
      cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update cart item quantity
router.put('/update/:productId', authenticateToken, [
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be 0 or greater')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Check if product exists in cart
    const cartItem = cart.items.find(item => 
      item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Check stock if increasing quantity
    if (quantity > cartItem.quantity) {
      const product = await Product.findById(productId);
      if (!product || product.stock < quantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
    }

    await cart.updateItemQuantity(productId, quantity);

    // Get updated cart with populated products
    const updatedCart = await Cart.getCartWithProducts(req.user._id);

    res.json({
      message: 'Cart updated successfully',
      cart: updatedCart
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove item from cart
router.delete('/remove/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    await cart.removeItem(productId);

    // Get updated cart with populated products
    const updatedCart = await Cart.getCartWithProducts(req.user._id);

    res.json({
      message: 'Item removed from cart successfully',
      cart: updatedCart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Clear cart
router.delete('/clear', authenticateToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    await cart.clearCart();

    res.json({
      message: 'Cart cleared successfully',
      cart: { user: req.user._id, items: [] }
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Apply coupon to cart
router.post('/apply-coupon', authenticateToken, [
  body('couponCode').notEmpty().withMessage('Coupon code is required'),
  body('discount').isFloat({ min: 0, max: 100 }).withMessage('Valid discount percentage is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { couponCode, discount } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    if (cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    await cart.applyCoupon(couponCode, discount);

    // Get updated cart with populated products
    const updatedCart = await Cart.getCartWithProducts(req.user._id);

    res.json({
      message: 'Coupon applied successfully',
      cart: updatedCart
    });
  } catch (error) {
    console.error('Apply coupon error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove coupon from cart
router.delete('/remove-coupon', authenticateToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    await cart.removeCoupon();

    // Get updated cart with populated products
    const updatedCart = await Cart.getCartWithProducts(req.user._id);

    res.json({
      message: 'Coupon removed successfully',
      cart: updatedCart
    });
  } catch (error) {
    console.error('Remove coupon error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get cart summary (for checkout)
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const cart = await Cart.getCartWithProducts(req.user._id);
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const summary = {
      items: cart.items,
      subtotal: cart.subtotal,
      discount: cart.discountAmount,
      total: cart.total,
      itemCount: cart.totalItems
    };

    res.json({ summary });
  } catch (error) {
    console.error('Get cart summary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
