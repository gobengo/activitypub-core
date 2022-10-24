import { parseStream } from 'activitypub-core-utilities';
import { OutboxEndpoint } from '.';

export async function parseBody(this: OutboxEndpoint) {
  const result = await parseStream(this.req);

  if (!result) {
    throw new Error('Bad request: Could not parse stream.');
  }

  this.activity = result;
}
