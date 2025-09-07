import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export class RecipeBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create DynamoDB table
    const table = new dynamodb.Table(this, 'RecipesTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For development only
      pointInTimeRecovery: true,
    });

    // Create API Gateway
    const api = new apigateway.RestApi(this, 'RecipesApi', {
      restApiName: 'Recipes Service',
      description: 'API for managing recipes',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
      },
    });

    api.addUsagePlan('DefaultUsagePlan', {
      throttle: {
        rateLimit: 10,
        burstLimit: 10,
      },
      quota: {
        limit: 500,
        period: apigateway.Period.DAY,
      },
    });

    // Create Lambda functions
    const getRecipesFunction = new NodejsFunction(this, 'GetRecipesFunction', {
      entry: path.join(__dirname, '../src/handlers/get-recipes.ts'),
      runtime: lambda.Runtime.NODEJS_22_X,
      // handler: 'get-recipes.handler',
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    const getRecipeFunction = new NodejsFunction(this, 'GetRecipeFunction', {
      entry: path.join(__dirname, '../src/handlers/get-recipe.ts'),
      runtime: lambda.Runtime.NODEJS_22_X,
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    const createRecipeFunction = new NodejsFunction(this, 'CreateRecipeFunction', {
      entry: path.join(__dirname, '../src/handlers/create-recipe.ts'),
      runtime: lambda.Runtime.NODEJS_22_X,
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    const updateRecipeFunction = new NodejsFunction(this, 'UpdateRecipeFunction', {
      entry: path.join(__dirname, '../src/handlers/update-recipe.ts'),
      runtime: lambda.Runtime.NODEJS_22_X,
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    // Grant DynamoDB permissions to Lambda functions
    table.grantReadData(getRecipesFunction);
    table.grantReadData(getRecipeFunction);
    table.grantWriteData(createRecipeFunction);
    table.grantReadWriteData(updateRecipeFunction);

    // Create API endpoints
    const recipes = api.root.addResource('recipes');
    
    // GET /recipes
    recipes.addMethod(
      'GET',
      new apigateway.LambdaIntegration(getRecipesFunction)
    );

    // POST /recipes
    recipes.addMethod(
      'POST',
      new apigateway.LambdaIntegration(createRecipeFunction)
    );

    // GET /recipes/{id}
    const recipe = recipes.addResource('{id}');
    recipe.addMethod(
      'GET',
      new apigateway.LambdaIntegration(getRecipeFunction)
    );

    // PUT /recipes/{id}
    recipe.addMethod(
      'PUT',
      new apigateway.LambdaIntegration(updateRecipeFunction)
    );

    // Output the API URL
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'API Gateway URL',
    });
  }
} 