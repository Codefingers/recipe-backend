# Recipe Backend Service

A serverless backend service for managing recipes, built with AWS CDK and TypeScript.

## Infrastructure

This project uses AWS CDK to define and deploy the following infrastructure:

- **API Gateway**: RESTful API endpoints for recipe management
- **DynamoDB**: NoSQL database for storing recipe data
- **Lambda**: Serverless functions for handling API requests

## Prerequisites

- Node.js 22 or later
- AWS CLI configured with appropriate credentials
- AWS CDK CLI (`npm install -g aws-cdk`)

## Project Structure

```
recipe-backend/
├── bin/                    # CDK app entry point
├── lib/                    # CDK stack and construct definitions
├── __tests__/             # Test files
├── cdk.json               # CDK configuration
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── vitest.config.ts       # Vitest configuration
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

## API Endpoints

- `GET /recipes`: Retrieve all recipes
- `POST /recipes`: Create a new recipe

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