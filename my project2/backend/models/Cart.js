const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  coupon: {
    code: String,
    discount: {
      type: Number,
      min: 0,
      max: 100
    },
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage'
    }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
cartSchema.index({ user: 1 });

// Virtual for total items count
cartSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for subtotal (before discount)
cartSchema.virtual('subtotal').get(function() {
  return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
});

// Virtual for discount amount
cartSchema.virtual('discountAmount').get(function() {
  if (!this.coupon || !this.coupon.discount) return 0;
  
  const subtotal = this.subtotal;
  if (this.coupon.type === 'percentage') {
    return (subtotal * this.coupon.discount) / 100;
  } else {
    return Math.min(this.coupon.discount, subtotal);
  }
});

// Virtual for total (after discount)
cartSchema.virtual('total').get(function() {
  return this.subtotal - this.discountAmount;
});

// Method to add item to cart
cartSchema.methods.addItem = function(productId, quantity = 1, price) {
  const existingItem = this.items.find(item => 
    item.product.toString() === productId.toString()
  );
  
  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.price = price; // Update price in case it changed
  } else {
    this.items.push({
      product: productId,
      quantity,
      price
    });
  }
  
  this.lastUpdated = new Date();
  return this.save();
};

// Method to update item quantity
cartSchema.methods.updateItemQuantity = function(productId, quantity) {
  const item = this.items.find(item => 
    item.product.toString() === productId.toString()
  );
  
  if (item) {
    if (quantity <= 0) {
      this.items = this.items.filter(item => 
        item.product.toString() !== productId.toString()
      );
    } else {
      item.quantity = quantity;
    }
    this.lastUpdated = new Date();
    return this.save();
  }
  
  throw new Error('Item not found in cart');
};

// Method to remove item from cart
cartSchema.methods.removeItem = function(productId) {
  this.items = this.items.filter(item => 
    item.product.toString() !== productId.toString()
  );
  this.lastUpdated = new Date();
  return this.save();
};

// Method to clear cart
cartSchema.methods.clearCart = function() {
  this.items = [];
  this.coupon = null;
  this.lastUpdated = new Date();
  return this.save();
};

// Method to apply coupon
cartSchema.methods.applyCoupon = function(couponCode, discount, type = 'percentage') {
  this.coupon = {
    code: couponCode,
    discount,
    type
  };
  this.lastUpdated = new Date();
  return this.save();
};

// Method to remove coupon
cartSchema.methods.removeCoupon = function() {
  this.coupon = null;
  this.lastUpdated = new Date();
  return this.save();
};

// Static method to get cart with populated products
cartSchema.statics.getCartWithProducts = function(userId) {
  return this.findOne({ user: userId })
    .populate({
      path: 'items.product',
      select: 'name price images stock isActive discount'
    });
};

module.exports = mongoose.model('Cart', cartSchema);
