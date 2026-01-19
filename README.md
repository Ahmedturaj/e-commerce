# Node.js E-commerce/Subscription Backend

A robust and scalable Node.js backend built with TypeScript, Express, and MongoDB. This project supports user authentication, product management, order creation, Stripe payment integration, and real-time updates. The backend is deployed on Vercel and ready to serve as a foundation for web applications.

## Features

- **User Management**
  - User registration & login (JWT authentication)
  - Get logged-in user profile

- **Product / Plan Management**
  - Create and list products or subscription plans

- **Order & Payment**
  - Create orders
  - Initiate Stripe payment (test mode)
  - Handle payment success via Stripe webhooks
  - Update order status after payment

- **Security & Utilities**
  - JWT-based authentication
  - Environment variable management for secrets
  - Proper CORS and error handling setup

## Tech Stack

- Node.js + TypeScript
- Express.js
- MongoDB (Mongoose)
- Stripe (Payment Gateway)
- Vercel (Deployment)

## Project Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd <your-project-folder>

2. **Install dependencies**
`npm install`

3. **Environment Variables**

Create a .env file in the root directory with the following keys:

`NODE_ENV=development`
`PORT=5000`

`MONGO_URI=<your-mongodb-uri>`

`ACCESS_TOKEN_SECRET=<your-access-token-secret>`
`ACCESS_TOKEN_EXPIRES=7d`
`REFRESH_TOKEN_SECRET=<your-refresh-token-secret>`
`REFRESH_TOKEN_EXPIRES=90d`

`STRIPE_SECRET_KEY=<your-stripe-secret-key>`
`STRIPE_WEBHOOK_SECRET=<your-stripe-webhook-secret>`

4. **Start the development server**

`npm run dev`


The server will run on http://localhost:5000 by default.

Stripe Payment Flow

Create Order

The client sends a request to create an order with selected products or subscription plan.

Create Payment Intent

Backend calls Stripe API to create a payment intent with the order amount.

Returns client_secret to the frontend for Stripe Checkout or payment confirmation.

Payment Confirmation

User completes payment via Stripe frontend (test card: 4242 4242 4242 4242).

Stripe sends a webhook event to the backend (/api/webhook endpoint).

Update Order Status

Backend verifies the webhook signature.

Updates the order status to paid or failed in the database.

API Endpoints

Auth

POST /api/auth/register – Register a new user

POST /api/auth/login – Login user

GET /api/auth/me – Get logged-in user profile

Products

POST /api/products – Create a product

GET /api/products – List all products

Orders

POST /api/orders – Create order and initiate payment

POST /api/webhook – Stripe webhook to handle payment status

Note: Use JWT token in Authorization header for protected routes.

Postman Collection

A Postman collection with all endpoints, JWT setup, and sample request/response is included in the repository:
/docs/PostmanCollection.json

Deployment

Live API Base URL: <your-vercel-deployed-url>

Stripe Webhook Endpoint: <your-vercel-deployed-url>/api/webhook

CORS is configured to allow frontend requests, and proper error handling middleware ensures clean API responses.