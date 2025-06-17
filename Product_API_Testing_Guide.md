# Product API Testing Guide for Postman

## Prerequisites
1. **Start your backend server**:
   ```bash
   cd backend
   npm install
   npm start
   ```
   Your server should be running on `http://localhost:5000`

2. **Import the Postman Collection**:
   - Open Postman
   - Click "Import" 
   - Select the `Product_API_Postman_Collection.json` file

## Step-by-Step Testing Guide

### Step 1: Health Check
**Purpose**: Verify the server is running
- **Request**: `GET {{baseUrl}}/health`
- **Expected Response**: `{"status": "ok"}`
- **Status Code**: 200

### Step 2: Get All Products
**Purpose**: Retrieve all products (public endpoint)
- **Request**: `GET {{baseUrl}}/products`
- **Expected Response**: Array of product objects
- **Status Code**: 200
- **Sample Response**:
```json
[
  {
    "_id": "product_id_here",
    "name": "Product Name",
    "description": "Product description",
    "price": 299.99,
    "category": "Shop all",
    "stock": 50,
    "length": 10,
    "width": 5,
    "height": 3,
    "images": ["uploads/products/image1.jpg"],
    "isAvailable": true,
    "discount": 10,
    "isDiscountActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Step 3: Get Products by Category
**Purpose**: Filter products by category
- **Request**: `GET {{baseUrl}}/products/category/Shop all`
- **Available Categories**:
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

### Step 4: Get Single Product
**Purpose**: Retrieve a specific product by ID
- **Request**: `GET {{baseUrl}}/products/PRODUCT_ID_HERE`
- **Steps**:
  1. First run "Get All Products" to get a product ID
  2. Copy the `_id` from the response
  3. Replace `PRODUCT_ID_HERE` in the URL with the actual ID
- **Expected Response**: Single product object
- **Status Code**: 200 (if found) or 404 (if not found)

### Step 5: Authentication Setup (Required for Admin Operations)
**Purpose**: Get authentication token for admin operations
- **Request**: `POST {{baseUrl}}/auth/login`
- **Body** (JSON):
```json
{
  "email": "admin@example.com",
  "password": "adminpassword"
}
```
- **Steps**:
  1. Send the login request
  2. Copy the `token` from the response
  3. In Postman, go to Collection Variables
  4. Set `authToken` variable to the copied token value

### Step 6: Create Product (Admin Only)
**Purpose**: Add a new product to the database
- **Request**: `POST {{baseUrl}}/products`
- **Headers**: `Authorization: Bearer {{authToken}}`
- **Body** (Form-data):
  - `name`: "Test Product"
  - `description`: "This is a test product description"
  - `price`: "299.99"
  - `category`: "Shop all"
  - `stock`: "50"
  - `length`: "10"
  - `width`: "5"
  - `height`: "3"
  - `discount`: "10"
  - `isDiscountActive`: "true"
  - `images`: [Select image files]
- **Expected Response**: Created product object
- **Status Code**: 201

### Step 7: Update Product (Admin Only)
**Purpose**: Modify an existing product
- **Request**: `PUT {{baseUrl}}/products/PRODUCT_ID_HERE`
- **Headers**: `Authorization: Bearer {{authToken}}`
- **Steps**:
  1. Get a product ID from "Get All Products"
  2. Replace `PRODUCT_ID_HERE` in the URL
- **Body** (Form-data):
  - `name`: "Updated Test Product"
  - `description`: "This is an updated test product description"
  - `price`: "399.99"
  - `stock`: "75"
  - `images`: [Select new image files (optional)]
- **Expected Response**: Updated product object
- **Status Code**: 200

### Step 8: Delete Product (Admin Only)
**Purpose**: Remove a product from the database
- **Request**: `DELETE {{baseUrl}}/products/PRODUCT_ID_HERE`
- **Headers**: `Authorization: Bearer {{authToken}}`
- **Steps**:
  1. Get a product ID from "Get All Products"
  2. Replace `PRODUCT_ID_HERE` in the URL
- **Expected Response**: `{"message": "Product deleted successfully"}`
- **Status Code**: 200

## Testing Scenarios

### Scenario 1: Complete CRUD Operations
1. Create a new product
2. Get all products (verify the new product appears)
3. Get the specific product by ID
4. Update the product
5. Verify the update by getting the product again
6. Delete the product
7. Verify deletion by getting all products

### Scenario 2: Error Handling
1. **Invalid Product ID**: Try to get/update/delete with non-existent ID
2. **Unauthorized Access**: Try admin operations without auth token
3. **Invalid Data**: Try to create product with missing required fields
4. **Invalid Category**: Try to create product with non-existent category

### Scenario 3: Category Filtering
1. Create products in different categories
2. Test filtering by each category
3. Verify only products from the specified category are returned

## Expected Error Responses

### 401 Unauthorized
```json
{
  "error": "Access denied. No token provided."
}
```

### 403 Forbidden
```json
{
  "error": "Access denied. Admin privileges required."
}
```

### 404 Not Found
```json
{
  "error": "Product not found"
}
```

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

## Tips for Testing

1. **Environment Variables**: Use Postman's environment feature to manage different environments (dev, staging, prod)

2. **Pre-request Scripts**: You can add scripts to automatically set variables or perform setup tasks

3. **Tests**: Add assertions to verify response structure and status codes

4. **Image Upload**: For testing image uploads, prepare some test image files (JPG, PNG)

5. **Data Cleanup**: Always clean up test data after testing to keep your database clean

## Troubleshooting

### Common Issues:
1. **Server not running**: Check if backend server is started on port 5000
2. **CORS errors**: Ensure CORS is properly configured in your backend
3. **Authentication issues**: Verify the auth token is valid and not expired
4. **File upload issues**: Check if uploads directory exists and has proper permissions
5. **Database connection**: Ensure MongoDB is running and connection string is correct

### Debug Steps:
1. Check server logs for error messages
2. Verify request headers and body format
3. Test with simpler requests first
4. Use browser developer tools to check network requests 