import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { lambdaHandler } from '@sstv3/core/util';
import { Resource } from 'sst';

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = lambdaHandler(async (event) => {
  const params = {
    TableName: Resource.Notes.name,
    Key: {
      userId: String(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        event.requestContext.authorizer?.iam.cognitoIdentity.identityId
      ),
      // The id of the note from the path
      noteId: event.pathParameters?.id,
    },
  };

  await dynamoDb.send(new DeleteCommand(params));

  return JSON.stringify({ status: true });
});
