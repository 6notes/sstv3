import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { lambdaHandler } from '@sstv3/core/util';
import { Resource } from 'sst';

export type Note = {
  attachment: string;
  content: string;
};

export const emptyNote = { attachment: '', content: '' };

function isNote(input: unknown): input is Note {
  return (
    typeof (input as Note).attachment !== 'undefined' &&
    typeof (input as Note).content !== 'undefined'
  );
}

export function parseNote(input: string | null): Note {
  if (!input) {
    return emptyNote;
  }
  const parsedInput: unknown = JSON.parse(input);
  if (!isNote(parsedInput)) {
    return emptyNote;
  }
  return parsedInput;
}

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = lambdaHandler(async (event) => {
  const note = parseNote(event.body);

  const params = {
    TableName: Resource.Notes.name,
    Key: {
      // The attributes of the item to be created
      userId: String(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        event.requestContext.authorizer?.iam?.cognitoIdentity.identityId
      ),
      // The id of the note from the path
      noteId: event.pathParameters?.id,
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: 'SET content = :content, attachment = :attachment',
    ExpressionAttributeValues: {
      ':attachment': note.attachment || null,
      ':content': note.content || null,
    },
  };

  await dynamoDb.send(new UpdateCommand(params));

  return JSON.stringify({ status: true });
});
