import { Storage } from 'aws-amplify';

export async function s3Upload(file: File) {
  const dateNow = String(Date.now());
  const filename = `${dateNow}-${file.name}`;

  const stored = await Storage.vault.put(filename, file, {
    contentType: file.type,
  });

  return stored.key;
}
