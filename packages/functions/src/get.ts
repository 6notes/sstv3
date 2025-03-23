import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { lambdaHandler } from '@sstv3/core/util';
import { Resource } from 'sst';

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = lambdaHandler(async (event) => {
  const params = {
    TableName: Resource.Notes.name,
    // 'Key' defines the partition key and sort key of
    // The item to be retrieved
    Key: {
      userId: String(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        event.requestContext.authorizer?.iam.cognitoIdentity.identityId
      ),
      // The id of the note from the path
      noteId: event.pathParameters?.id,
    },
  };

  const result = await dynamoDb.send(new GetCommand(params));
  if (!result.Item) {
    throw new Error('Item not found.');
  }

  // Return the retrieved item
  return JSON.stringify(result.Item);
});
