import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// CORS headers helper
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

interface UpdateRecipeRequest {
  title?: string;
  description?: string;
  ingredients?: string[];
  instructions?: string[];
  prepTime?: string;
  cookTime?: string;
  tags?: string[];
  image?: string;
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  if (!event.pathParameters?.id) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
      body: JSON.stringify({
        message: 'Missing recipe ID',
      }),
    };
  }

  if (!event.body) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
      body: JSON.stringify({
        message: 'Missing request body',
      }),
    };
  }

  const { id } = event.pathParameters;
  let updateData: UpdateRecipeRequest;

  try {
    updateData = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
      body: JSON.stringify({
        message: 'Invalid JSON in request body',
      }),
    };
  }

  // Build the update expression and attribute values
  const updateExpressions: string[] = [];
  const expressionAttributeValues: Record<string, any> = {};
  const expressionAttributeNames: Record<string, string> = {};

  Object.entries(updateData).forEach(([key, value]) => {
    if (value !== undefined) {
      const attributeName = `#${key}`;
      const attributeValue = `:${key}`;
      updateExpressions.push(`${attributeName} = ${attributeValue}`);
      expressionAttributeValues[attributeValue] = value;
      expressionAttributeNames[attributeName] = key;
    }
  });

  if (updateExpressions.length === 0) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
      body: JSON.stringify({
        message: 'No valid fields to update',
      }),
    };
  }

  try {
    const command = new UpdateCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        id,
      },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: expressionAttributeNames,
      ReturnValues: 'ALL_NEW',
      ConditionExpression: 'attribute_exists(id)', // Ensure the recipe exists
    });

    const response = await docClient.send(command);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
      body: JSON.stringify({
        recipe: response.Attributes,
      }),
    };
  } catch (error: any) {
    console.error('Error updating recipe:', error);

    // Handle the case where the recipe doesn't exist
    if (error.name === 'ConditionalCheckFailedException') {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
        body: JSON.stringify({
          message: 'Recipe not found',
        }),
      };
    }

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
      body: JSON.stringify({
        message: 'Internal server error',
      }),
    };
  }
}; 