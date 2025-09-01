# Shopping Cart Web Application

A modern, full-stack e-commerce application built with React, Node.js, Redux, and MongoDB. Features include user authentication, product management, shopping cart functionality, order processing, and admin dashboard.

## 🚀 Features

### User Features
- **User Authentication**: Register, login, and profile management
- **Product Browsing**: Browse products with filters, search, and categories
- **Shopping Cart**: Add/remove items, update quantities, apply coupons
- **Order Management**: Place orders, view order history, track status
- **Responsive Design**: Mobile-first design with modern UI

### Admin Features
- **Product Management**: Add, edit, and delete products
- **Order Management**: View and update order status
- **User Management**: Manage user accounts and roles
- **Dashboard**: Analytics and statistics

### Technical Features
- **JWT Authentication**: Secure token-based authentication
- **Redux State Management**: Centralized state management
- **RESTful API**: Clean and scalable backend API
- **MongoDB Database**: NoSQL database with Mongoose ODM
- **Docker Support**: Containerized deployment
- **Real-time Updates**: Live cart and order updates

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications
- **React Icons** - Icon library
- **Styled Components** - CSS-in-JS styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **cors** - Cross-origin resource sharing
- **helmet** - Security middleware

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Docker (optional)

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shopping-cart-app
   ```

2. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

### Manual Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shopping-cart-app
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   
   Create `.env` file in the backend directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/shopping-cart
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Start the application**
   ```bash
   # Development mode (both frontend and backend)
   npm run dev
   
   # Or start separately
   npm run server  # Backend only
   npm run client  # Frontend only
   ```

## 🗄️ Database Setup

The application uses MongoDB with the following collections:
- **Users**: User accounts and profiles
- **Products**: Product catalog with images and details
- **Carts**: Shopping cart items for each user
- **Orders**: Order history and status

### Sample Data

You can add sample products through the admin interface or directly to the database:

```javascript
// Sample product
{
  name: "Wireless Headphones",
  description: "High-quality wireless headphones with noise cancellation",
  price: 99.99,
  category: "electronics",
  brand: "TechBrand",
  stock: 50,
  images: ["https://example.com/headphones.jpg"],
  isActive: true
}
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Products
- `GET /api/products` - Get all products with filters
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:productId` - Update cart item
- `DELETE /api/cart/remove/:productId` - Remove from cart
- `DELETE /api/cart/clear` - Clear cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/cancel` - Cancel order

## 🎨 UI Components

The application includes reusable components:
- **Header**: Navigation and user menu
- **ProductCard**: Product display component
- **CartItem**: Shopping cart item component
- **OrderCard**: Order history component
- **AdminDashboard**: Admin interface components

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Input Validation**: express-validator for data validation
- **CORS Protection**: Cross-origin resource sharing
- **Helmet**: Security headers
- **Rate Limiting**: API rate limiting

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd frontend
npm run build

# Start production server
cd ../backend
npm start
```

### Docker Production
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production containers
docker-compose -f docker-compose.prod.yml up -d
```

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@shopcart.com or create an issue in the repository.

## 🔄 Updates

- **v1.0.0**: Initial release with core features
- **v1.1.0**: Added admin dashboard and user management
- **v1.2.0**: Enhanced cart functionality and order processing

---

Built with ❤️ using React, Node.js, and Redux
