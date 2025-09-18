"# Laroza Store Management System

A full-stack web application for internal store management with inventory tracking, sales management, returns processing, and accounting features.

## Technology Stack

- **Frontend**: React with TypeScript, Vite, TailwindCSS
- **Backend**: Node.js with Express, Firebase Realtime Database  
- **Database**: Firebase Realtime Database
- **Authentication**: Firebase Admin SDK

## Environment Setup

### Required Environment Variables

Set the following environment variables in your hosting platform dashboard:

```bash
# Firebase Service Account (required - choose one format)
FIREBASE_CREDENTIALS=<paste-raw-json-here>
# OR
FIREBASE_CREDENTIALS_B64=<paste-base64-json-here>

# Firebase Realtime Database URL (pre-configured)
FIREBASE_DB_URL=https://laroza-8b3ad-default-rtdb.firebaseio.com/

# Node environment
NODE_ENV=production
```

### Firebase Service Account Setup

1. Go to your Firebase Console → Project Settings → Service Accounts
2. Generate a new private key (downloads a JSON file)
3. Either:
   - Paste the entire JSON content into `FIREBASE_CREDENTIALS`
   - Or convert to base64 and paste into `FIREBASE_CREDENTIALS_B64`

### Deployment Configuration

**Build Command**: `npm run build`

**Start Command**: `npm start`

The application will serve both the API and static frontend from the same server.

## Development

```bash
# Install dependencies
npm install

# Set up environment variables (copy from .env.example)
cp .env.example .env

# Start development server
npm run dev
```

## Production Deployment

1. Set environment variables in your hosting platform
2. Configure build and start commands as shown above
3. Deploy to any generic Node.js hosting platform

The app will automatically:
- Serve static files in production
- Use the configured port from `PORT` environment variable
- Connect to Firebase Realtime Database
- Apply security middleware (helmet, CORS, compression)

## API Testing

### Products API

```bash
# Get all products (should be [] initially)
curl -s https://<your-host>/api/products

# Create a product with initial inventory
curl -s -X POST https://<your-host>/api/products \\
  -H "Content-Type: application/json" \\
  -d '{
    "product": {
      "modelNumber": "AB-1001",
      "companyName": "Laroza",
      "productType": "abaya",
      "storePrice": "120.00",
      "onlinePrice": "135.00",
      "imageUrl": "",
      "specifications": "Black, chiffon"
    },
    "inventory": [
      { "color": "black", "size": "M", "quantity": 5 },
      { "color": "black", "size": "L", "quantity": 3 }
    ]
  }'
```

### Sales API

```bash
# Get all sales
curl -s https://<your-host>/api/sales

# Create a sale
curl -s -X POST https://<your-host>/api/sales \\
  -H "Content-Type: application/json" \\
  -d '{
    "sale": {
      "channel": "in-store",
      "paymentMethod": "cash",
      "customerName": "أحمد محمد",
      "customerPhone": "+971501234567",
      "subtotal": "120.00",
      "fees": "0.00",
      "total": "120.00"
    },
    "items": [
      {
        "productId": "<product-id>",
        "color": "black",
        "size": "M", 
        "quantity": 1,
        "unitPrice": "120.00"
      }
    ]
  }'
```

### Returns API

```bash
# Get all returns
curl -s https://<your-host>/api/returns

# Create a return/exchange
curl -s -X POST https://<your-host>/api/returns \\
  -H "Content-Type: application/json" \\
  -d '{
    "return": {
      "originalSaleId": "<sale-id>",
      "returnType": "exchange",
      "exchangeType": "color-change",
      "newColor": "white",
      "refundAmount": "0.00"
    },
    "items": [
      {
        "productId": "<product-id>",
        "color": "black",
        "size": "M",
        "quantity": 1
      }
    ]
  }'
```

## Features

- **Inventory Management**: Track products, colors, sizes, and quantities
- **Sales Processing**: Handle in-store and online sales with automatic inventory updates
- **Returns & Exchanges**: Support for refunds and three types of exchanges:
  - Product-to-product exchange
  - Color change
  - Size change
- **Accounting**: Track expenses and purchases
- **Dashboard**: Real-time analytics and statistics
- **RTL Support**: Full Arabic language support with right-to-left layout

## Database Schema

The application uses Firebase Realtime Database with the following structure:

```
- products/
- product_inventory/<productId>/
- sales/
- sale_items/<saleId>/
- returns/
- return_items/<returnId>/
- expenses/
- purchases/
```

All timestamps are stored as Unix timestamps (milliseconds) for consistency across different time zones." 
