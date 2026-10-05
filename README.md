
# Real Estate Listing API

A scalable real-estate listing backend built with **Node.js, Express, TypeScript, PostgreSQL, and Prisma**.

The API provides user authentication, property management, search/filtering, pagination, sorting, Cloudinary image uploads, and favorite properties.

---

## Features

- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Property CRUD operations
- Property image upload using Cloudinary
- Search and filtering
- Pagination
- Sorting
- Favorite properties
- Zod request validation
- User authorization for property updates and deletion
- Centralized error handling
- CORS configuration
- Health check endpoint
- PostgreSQL database with Prisma ORM

---

## Tech Stack

### Backend

- Node.js
- Express.js
- TypeScript

### Database

- PostgreSQL
- Prisma ORM

### Authentication

- JWT
- bcrypt

### Validation

- Zod

### File Upload

- Multer
- Cloudinary

---

## Project Structure

src/
├── controllers/
│   ├── favorite.controller.ts
│   ├── property.controller.ts
│   └── user.controller.ts
│
├── lib/
│   ├── cloudinary.ts
│   ├── database.ts
│   └── prisma.ts
│
├── middleware/
│   ├── auth.ts
│   ├── error.middleware.ts
│   ├── query.middleware.ts
│   ├── upload.ts
│   └── validate.middleware.ts
│
├── routes/
│   ├── favorite.routes.ts
│   ├── property.routes.ts
│   └── user.routes.ts
│
├── services/
│   ├── favorite.service.ts
│   ├── property.service.ts
│   └── user.service.ts
│
├── utils/
│   ├── property.filters.ts
│   ├── property.pagination.ts
│   └── property.sorting.ts
│
├── validators/
│   ├── property.validator.ts
│   └── user.validator.ts
│
├── app.ts
└── server.ts

prisma/
├── models/
│   ├── property.prisma
│   └── user.prisma
├── migrations/
└── schema.prisma

prisma.config.ts
.env
.env.example
.gitignore
package.json
README.md
tsconfig.json


# Getting Started

## Prerequisites

Make sure you have installed:

- Node.js
- PostgreSQL
- npm

---

## Installation

Clone the repository and install dependencies:

```bash
npm install


---

# Environment Variables

Create a `.env` file in the project root.

```env
PORT=5000

DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/ib_real_estate"

JWT_SECRET=your_long_random_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

FRONTEND_URLS=http://localhost:3000,http://localhost:5173
```

### Important

Never commit `.env` to GitHub.

The following values must remain private:

- PostgreSQL password
- JWT secret
- Cloudinary API secret

---

# Database Setup

Create the PostgreSQL database:

ib_real_estate


Then run Prisma migrations:

```bash
npx prisma migrate dev
```

Generate the Prisma client:

```bash
npx prisma generate
```

---

# Run the Application

Start the development server:

```bash
npx tsx src/server.ts
```

The API will run at:

```text
http://localhost:5000
```

---

# Health Check

Check whether the API is running:

```http
GET /api/health
```

Example:

```text
http://localhost:5000/api/health
```

Response:

```json
{
  "success": true,
  "message": "API is running"
}
```

---

# Authentication

Authentication uses JWT.

After login, copy the returned token and send it with protected requests.

```http
Authorization: Bearer YOUR_TOKEN
```

---

# API Endpoints

## Users

### Register

```http
POST /api/users/register
```

Request:

```json
{
  "name": "Thiru",
  "email": "thiru@example.com",
  "password": "Password123",
  "phone": "9876543210"
}
```

---

### Login

```http
POST /api/users/login
```

Request:

```json
{
  "email": "thiru@example.com",
  "password": "Password123"
}
```

The response contains a JWT token.

Use that token for protected endpoints.

---

# Properties

## Create Property

```http
POST /api/properties
```

Authentication required.

Header:

```http
Authorization: Bearer YOUR_TOKEN
```

The endpoint accepts `multipart/form-data`.

Example fields:

```text
title
description
price
location
city
bedrooms
bathrooms
area
propertyType
listingType
images
```

Example:

```text
title        = 2BHK Apartment
description  = Spacious apartment in Chennai
price        = 7500000
location     = OMR
city         = Chennai
bedrooms     = 2
bathrooms    = 2
area         = 1200
propertyType = APARTMENT
listingType  = SALE
images       = house1.jpg
images       = house2.jpg
```

Maximum images per request:

```text
10
```

Images are uploaded to Cloudinary and the resulting URLs are stored in PostgreSQL.

---

## Get All Properties

GET /api/properties


Example:

GET /api/properties?page=1&limit=10


---

## Search and Filter Properties

### Filter by city

```http
GET /api/properties?city=Chennai
```

### Filter by property type

```http
GET /api/properties?propertyType=APARTMENT
```

### Filter by listing type

```http
GET /api/properties?listingType=SALE
```

### Filter by price

```http
GET /api/properties?minPrice=3000000&maxPrice=8000000
```

### Combine filters

```http
GET /api/properties?city=Chennai&propertyType=APARTMENT&listingType=SALE
```

---

# Pagination

Example:

```http
GET /api/properties?page=1&limit=10
```

Parameters:

```text
page
limit
```

Example response:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

---

# Sorting

### Lowest price first

```http
GET /api/properties?sort=price_asc
```

### Highest price first

```http
GET /api/properties?sort=price_desc
```

### Latest properties

```http
GET /api/properties?sort=latest
```

---

# Get Property By ID

```http
GET /api/properties/:id
```

Example:

```text
GET /api/properties/1
```

---

# Update Property

```http
PUT /api/properties/:id
```

Authentication required.

A user can update only their own property.

---

## Update Property Images

Images can also be updated separately.

```http
PUT /api/properties/1
```

Header:

```http
Authorization: Bearer YOUR_TOKEN
```

Body:

```text
multipart/form-data
```

Use repeated `images` fields:

```text
images = new-house-1.jpg
images = new-house-2.jpg
```

The new images replace the existing images for that property.

---

# Delete Property

```http
DELETE /api/properties/:id
```

Authentication required.

Example:

```text
DELETE /api/properties/1
```

A user can delete only their own property.

---

# Favorites

Authenticated users can save properties to their favorites.

## Add Favorite

```http
POST /api/favorites/:propertyId
```

Example:

```text
POST /api/favorites/1
```

Authentication required.

---

## Get My Favorites

```http
GET /api/favorites
```

Authentication required.

---

## Remove Favorite

```http
DELETE /api/favorites/:propertyId
```

Example:

```text
DELETE /api/favorites/1
```

Authentication required.

---

# Property Types

The API supports:

```text
APARTMENT
VILLA
HOUSE
PLOT
OFFICE
SHOP
```

# Listing Types

The API supports:

```text
SALE
RENT
```

---

# Validation

Request validation is handled using Zod.

Examples of validation:

- Name must contain at least 2 characters
- Email must be valid
- Password must contain at least 8 characters
- Phone number must be a valid 10-digit Indian number
- Property title must contain at least 3 characters
- Price must be greater than zero
- Property type must be valid
- Listing type must be valid
- Maximum 10 images per upload

Invalid requests return a response similar to:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

---

# Authentication Flow

```text
Register
   ↓
Password hashed with bcrypt
   ↓
User stored in PostgreSQL
   ↓
Login
   ↓
JWT generated
   ↓
Client sends JWT
   ↓
Auth middleware verifies JWT
   ↓
Protected controller
```

---

# Image Upload Flow

```text
Client
   ↓
multipart/form-data
   ↓
Multer
   ↓
Cloudinary
   ↓
Cloudinary image URL
   ↓
PostgreSQL
```

Images are not stored directly inside PostgreSQL.

Only their Cloudinary URLs are stored in the `images` field.

---

# Error Handling

The API uses centralized error handling for:

- Prisma errors
- Validation errors
- Authentication errors
- Authorization errors
- Invalid requests
- Unknown routes
- Internal server errors

Example:

```json
{
  "success": false,
  "message": "Property not found"
}
```

---

# CORS

Allowed frontend URLs are configured through:

```env
FRONTEND_URLS=http://localhost:3000,http://localhost:5173
```

Additional production frontend URLs can be added when deploying.

---

# Development Commands

Start the development server:

```bash
npx tsx src/server.ts
```

Generate Prisma Client:

```bash
npx prisma generate
```

Create and apply a migration:

```bash
npx prisma migrate dev --name migration_name
```

Validate Prisma schema:

```bash
npx prisma validate
```

Open Prisma Studio:

```bash
npx prisma studio
```

---

# Production Build

Compile TypeScript:

```bash
npx tsc
```

The compiled files will be generated according to the TypeScript configuration.

Start the compiled application:

```bash
node dist/server.js
```

---

# Security

The project follows basic backend security practices:

- Passwords are hashed using bcrypt
- Authentication uses JWT
- JWT secret is stored in environment variables
- Cloudinary API secret is stored in environment variables
- Database credentials are stored in environment variables
- `.env` is excluded from Git
- Protected routes require authentication
- Users can modify/delete only their own properties
- Request data is validated using Zod
- Unexpected errors are not exposed to API clients

---
