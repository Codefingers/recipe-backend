import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// CORS headers helper
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  tags: string[];
  rating: number;
  prepTime: number;
  cookTime: number;
  ingredients: string[];
  instructions: string[];
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
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

  try {
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

    const { 
      title, 
      description, 
      imageUrl, 
      tags, 
      rating, 
      prepTime, 
      cookTime, 
      ingredients,
      instructions,
      authorId,
      authorName
    }: Recipe = JSON.parse(event.body);
    const now = new Date().toISOString();

    const command = new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: {
        id: uuidv4(),
        title,
        description,
        imageUrl,
        tags,
        rating,
        prepTime,
        cookTime,
        ingredients,
        instructions,
        authorId,
        authorName,
        createdAt: now,
        updatedAt: now,
      },
    });

    await docClient.send(command);

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
      body: JSON.stringify({
        message: 'Recipe created successfully',
        recipe: {
          id: command.input.Item?.id,
          createdAt: now,
        },
      }),
    };
  } catch (error) {
    console.error('Error creating recipe:', error);
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