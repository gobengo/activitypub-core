import {
  ACTIVITYSTREAMS_CONTEXT,
  getCollectionNameByUrl,
} from 'activitypub-core-utilities';
import { AP } from 'activitypub-core-types';
import * as data from '../../__data__';
import { handleOutboxPost } from '../../test_utils';


describe('Endpoints', () => {
  describe('Actor Outbox', () => {
    it('Accepts JSON-LD Objects', async () => {
      const activity = {
        "@context": {
          "as": `${ACTIVITYSTREAMS_CONTEXT}#`,
          "schema": "https://schema.org/",
        },
        "@type": [
          "as:Arrive",
          "schema:Person",
        ],
        "as:actor": [
          {
            "@id": new URL(data.aliceUrl),
          },
        ],
        "as:location": {
          "@type": "Place",
          "as:name": "Disney World",
        },
      };

      const { res, db, delivery } =
        await handleOutboxPost(activity, data.aliceOutboxUrl);

      expect(res.statusCode).toBe(201);
      expect(db.saveEntity).toBeCalledTimes(4);
      expect(db.insertOrderedItem).toBeCalledTimes(1);
      expect(delivery.broadcast).toBeCalledTimes(1);
    });
  });
});
