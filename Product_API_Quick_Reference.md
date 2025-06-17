# Product API Quick Reference

## Base URL
```
http://localhost:5000/api
```

## Public Endpoints (No Authentication Required)

| Method | Endpoint | Description | Status Code |
|--------|----------|-------------|-------------|
| GET | `/health` | Health check | 200 |
| GET | `/products` | Get all products | 200 |
| GET | `/products/category/:category` | Get products by category | 200 |
| GET | `/products/:id` | Get single product | 200/404 |

## Protected Endpoints (Admin Authentication Required)

| Method | Endpoint | Description | Status Code |
|--------|----------|-------------|-------------|
| POST | `/products` | Create new product | 201 |
| PUT | `/products/:id` | Update product | 200 |
| DELETE | `/products/:id` | Delete product | 200 |

## Authentication
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "adminpassword"
}
```

## Product Schema
```json
{
  "name": "string (required)",
  "description": "string (required)",
  "price": "number (required, min: 0)",
  "category": "string (required, enum)",
  "stock": "number (required, min: 0)",
  "length": "number (required, min: 0)",
  "width": "number (required, min: 0)",
  "height": "number (required, min: 0)",
  "images": "array of strings",
  "discount": "number (default: 0, min: 0, max: 100)",
  "isDiscountActive": "boolean (default: false)",
  "discountStartDate": "date",
  "discountEndDate": "date",
  "offerPrice": "number (min: 0)",
  "offerStartDate": "date",
  "offerEndDate": "date",
  "isOfferActive": "boolean (default: false)",
  "expiryDays": "number (default: 7)"
}
```

## Available Categories
- "Shop all"
- "Sanchi Stupa"
- "Warli House"
- "Tiger Crafting"
- "Bamboo Peacock"
- "Miniaure Ship"
- "Bamboo Trophy"
- "Bamboo Ganesha"
- "Bamboo Swords"
- "Tribal Mask -1"
- "Tribal Mask -2"
- "Bamboo Dry Fruit Tray"
- "Bamboo Tissue Paper Holder"
- "Bamboo Strip Tray"
- "Bamboo Mobile Booster"
- "Bamboo Card-Pen Holder"

## Headers for Protected Endpoints
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## File Upload
- Use `multipart/form-data` for endpoints with image uploads
- Maximum 5 images per product
- Supported formats: JPG, PNG, etc.

## Common Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error 