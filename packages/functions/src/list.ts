import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { lambdaHandler } from '@sstv3/core/util';
import { Resource } from 'sst';

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = lambdaHandler(async (event) => {
  const params = {
    TableName: Resource.Notes.name,
    // 'KeyConditionExpression' defines the condition for the query
    // - 'userId = :userId': only return items with matching 'userId'
    //   Partition key
    KeyConditionExpression: 'userId = :userId',
    // 'ExpressionAttributeValues' defines the value in the condition
    // - ':userId': defines 'userId' to be the id of the author
    ExpressionAttributeValues: {
      ':userId':
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        String(event.requestContext.authorizer?.iam.cognitoIdentity.identityId),
    },
  };

  const result = await dynamoDb.send(new QueryCommand(params));

  // Return the matching list of items in response body
  return JSON.stringify(result.Items);
});
