import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { RecipeBackendStack } from '../lib/recipe-backend-stack';

const app = new cdk.App();
new RecipeBackendStack(app, 'RecipeBackendStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
}); 