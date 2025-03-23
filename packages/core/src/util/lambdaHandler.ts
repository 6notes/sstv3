import { APIGatewayProxyEvent, Context } from 'aws-lambda';

export function lambdaHandler(
  lambda: (evt: APIGatewayProxyEvent, context: Context) => Promise<string>
) {
  return async function runLambda(
    event: APIGatewayProxyEvent,
    context: Context
  ) {
    let body: string;
    let statusCode: number;
    const statusCodes = { internalServerError: 500, ok: 200 };

    try {
      // Run the Lambda
      body = await lambda(event, context);
      statusCode = statusCodes.ok;
    } catch (error) {
      statusCode = statusCodes.internalServerError;
      body = JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
      });
    }

    // Return HTTP response
    return {
      body,
      statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    };
  };
}
