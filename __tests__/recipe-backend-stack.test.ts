import { describe, test, expect, beforeEach } from 'vitest';
import { Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
import { RecipeBackendStack } from '../lib/recipe-backend-stack';

describe('RecipeBackendStack', () => {
  let stack: RecipeBackendStack;
  let template: Template;

  beforeEach(() => {
    const app = new cdk.App();
    stack = new RecipeBackendStack(app, 'TestStack');
    template = Template.fromStack(stack);
  });

  test('creates DynamoDB table with correct configuration', () => {
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      TableName: expect.stringMatching(/RecipesTable/),
      AttributeDefinitions: [
        {
          AttributeName: 'id',
          AttributeType: 'S'
        },
        {
          AttributeName: 'createdAt',
          AttributeType: 'S'
        }
      ],
      KeySchema: [
        {
          AttributeName: 'id',
          KeyType: 'HASH'
        },
        {
          AttributeName: 'createdAt',
          KeyType: 'RANGE'
        }
      ],
      BillingMode: 'PAY_PER_REQUEST',
      PointInTimeRecoverySpecification: {
        PointInTimeRecoveryEnabled: true
      }
    });
  });

  test('creates API Gateway with correct configuration', () => {
    template.hasResourceProperties('AWS::ApiGateway::RestApi', {
      Name: 'Recipes Service',
      Description: 'API for managing recipes'
    });
  });

  test('creates GET /recipes endpoint', () => {
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'GET',
      ResourceId: expect.objectContaining({
        'Fn::GetAtt': expect.arrayContaining([
          expect.stringMatching(/recipes/)
        ])
      })
    });
  });

  test('creates POST /recipes endpoint', () => {
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'POST',
      ResourceId: expect.objectContaining({
        'Fn::GetAtt': expect.arrayContaining([
          expect.stringMatching(/recipes/)
        ])
      })
    });
  });

  test('creates Lambda functions for endpoints', () => {
    template.resourceCountIs('AWS::Lambda::Function', 2);
  });
}); 