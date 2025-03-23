import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { lambdaHandler } from '@sstv3/core/util';
import { Resource } from 'sst';
import * as uuid from 'uuid';

import { emptyNote, Note, parseNote } from './update';

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = lambdaHandler(async (event) => {
  let note: Note = emptyNote;

  if (event.body !== null) {
    note = parseNote(event.body);
  }

  const params = {
    TableName: Resource.Notes.name,
    Item: {
      // The attributes of the item to be created
      userId: String(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        event.requestContext.authorizer?.iam.cognitoIdentity.identityId
      ),
      // A unique uuid
      noteId: uuid.v1(),
      // Parsed from request body
      content: note.content,
      // Parsed from request body
      attachment: note.attachment,
      // Current Unix timestamp
      createdAt: Date.now(),
    },
  };

  await dynamoDb.send(new PutCommand(params));

  return JSON.stringify(params.Item);
});
