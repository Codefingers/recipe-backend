# Recipe Backend Service

A serverless backend service for managing recipes, built with AWS CDK and TypeScript.

## Overview

This backend provides a RESTful API for managing recipes with the following features:
- Create, read, and update recipes
- Store recipe data in DynamoDB
- CORS-enabled endpoints for frontend integration
- Serverless architecture using AWS Lambda and API Gateway

## Infrastructure

This project uses AWS CDK to define and deploy the following infrastructure:

- **API Gateway**: RESTful API endpoints for recipe management
- **DynamoDB**: NoSQL database for storing recipe data
- **Lambda**: Serverless functions for handling API requests

## API Documentation

The API is documented using OpenAPI 3.0. You can find the complete specification in `openapi.yaml`.

### Base URL
```
https://kgoq68r29f.execute-api.eu-west-1.amazonaws.com/prod
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/recipes` | Get all recipes |
| POST | `/recipes` | Create a new recipe |
| GET | `/recipes/{id}` | Get a specific recipe |
| PUT | `/recipes/{id}` | Update a recipe |

### Example Usage

#### Get all recipes
```bash
curl -X GET https://kgoq68r29f.execute-api.eu-west-1.amazonaws.com/prod/recipes
```

#### Create a new recipe
```bash
curl -X POST https://kgoq68r29f.execute-api.eu-west-1.amazonaws.com/prod/recipes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Chocolate Chip Cookies",
    "description": "Delicious homemade cookies",
    "tags": ["dessert", "cookies"],
    "rating": 5,
    "prepTime": "15 mins",
    "cookTime": "12 mins",
    "ingredients": ["2 cups flour", "1 cup sugar"],
    "instructions": ["Mix ingredients", "Bake at 350°F"],
    "authorId": "user-123",
    "authorName": "John Doe"
  }'
```

#### Get a specific recipe
```bash
curl -X GET https://kgoq68r29f.execute-api.eu-west-1.amazonaws.com/prod/recipes/recipe-123
```

#### Update a recipe
```bash
curl -X PUT https://kgoq68r29f.execute-api.eu-west-1.amazonaws.com/prod/recipes/recipe-123 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Recipe Title",
    "rating": 4
  }'
```

## Prerequisites

- Node.js 22 or later
- AWS CLI configured with appropriate credentials
- AWS CDK CLI (`npm install -g aws-cdk`)

## Project Structure

```
recipe-backend/
├── bin/                    # CDK app entry point
├── lib/                    # CDK stack and construct definitions
├── src/
│   └── handlers/          # Lambda function handlers
│       ├── create-recipe.ts
│       ├── get-recipes.ts
│       ├── get-recipe.ts
│       └── update-recipe.ts
├── __tests__/             # Test files
├── cdk.json               # CDK configuration
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vitest.config.ts       # Vitest configuration
├── openapi.yaml           # OpenAPI specification
└── README.md              # This file
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```

## Development

- Watch mode for TypeScript compilation:
  ```bash
  npm run watch
   ```

- Run tests:
  ```bash
  npm test
   ```

## Deployment

1. Deploy the stack:
   ```bash
   npm run deploy
   ```

2. Destroy the stack:
   ```bash
   npm run destroy
   ```

## CORS Configuration

The API includes CORS headers to allow cross-origin requests from web applications. All endpoints support:

- **Access-Control-Allow-Origin**: `*`
- **Access-Control-Allow-Methods**: `GET, POST, PUT, DELETE, OPTIONS`
- **Access-Control-Allow-Headers**: `Content-Type, Authorization`

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Testing

The project uses Vitest for testing. Tests are located in the `__tests__` directory and can be run using:

```bash
npm test
```

For coverage reports:
```bash
npm test -- --coverage
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License. 