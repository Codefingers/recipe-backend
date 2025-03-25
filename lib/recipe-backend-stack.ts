import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class RecipeBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create DynamoDB table
    const table = new dynamodb.Table(this, 'RecipesTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
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

    // Create API endpoints
    const recipes = api.root.addResource('recipes');
    
    // GET /recipes
    recipes.addMethod(
      'GET',
      new apigateway.LambdaIntegration(new cdk.aws_lambda.Function(this, 'GetRecipesFunction', {
        runtime: cdk.aws_lambda.Runtime.NODEJS_22_X,
        handler: 'index.handler',
        code: cdk.aws_lambda.Code.fromInline(`
          exports.handler = async (event) => {
            return {
              statusCode: 200,
              body: JSON.stringify({ message: 'Get recipes endpoint' })
            };
          };
        `),
      }))
    );

    // POST /recipes
    recipes.addMethod(
      'POST',
      new apigateway.LambdaIntegration(new cdk.aws_lambda.Function(this, 'CreateRecipeFunction', {
        runtime: cdk.aws_lambda.Runtime.NODEJS_22_X,
        handler: 'index.handler',
        code: cdk.aws_lambda.Code.fromInline(`
          exports.handler = async (event) => {
            return {
              statusCode: 201,
              body: JSON.stringify({ message: 'Create recipe endpoint' })
            };
          };
        `),
      }))
    );

    // Output the API URL
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'API Gateway URL',
    });
  }
} 