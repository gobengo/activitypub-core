import { ACTIVITYSTREAMS_CONTEXT } from 'activitypub-core-utilities';
import { AP } from 'activitypub-core-types';
import * as data from '../../__data__';
import { handleOutboxPost } from '../../test_utils';


describe('Endpoints', () => {
  describe('Actor Outbox', () => {
    it('Create Activity', async () => {
      const activity: AP.Activity = {
        '@context': ACTIVITYSTREAMS_CONTEXT,
        type: AP.ActivityTypes.CREATE,
        actor: new URL(data.aliceUrl),
        object: {
          type: 'Note',
          content: 'Hello world',
        },
      };

      const { res, db, delivery } =
        await handleOutboxPost(activity, data.aliceOutboxUrl);

      expect(res.statusCode).toBe(201);
      expect(db.saveEntity).toBeCalledTimes(8);
      expect(db.insertOrderedItem).toBeCalledTimes(1);
      expect(delivery.broadcast).toBeCalledTimes(1);
    });
  });
});
