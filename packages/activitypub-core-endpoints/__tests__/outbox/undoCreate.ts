import { ACTIVITYSTREAMS_CONTEXT } from 'activitypub-core-utilities';
import { AP } from 'activitypub-core-types';
import * as data from '../../__data__';
import { handleOutboxPost } from '../../test_utils';


describe('Endpoints', () => {
  describe('Actor Outbox', () => {
    it('Undo Create', async () => {
      const activity: AP.Undo = {
        '@context': ACTIVITYSTREAMS_CONTEXT,
        type: 'Undo',
        actor: new URL(data.aliceUrl),
        object: new URL(data.createActivityUrl),
      };

      const { res, db, delivery } =
        await handleOutboxPost(activity, data.aliceOutboxUrl);

      expect(res.statusCode).toBe(201);
      expect(db.saveEntity).toBeCalledTimes(5);
      expect(db.insertOrderedItem).toBeCalledTimes(1);
      expect(delivery.broadcast).toBeCalledTimes(1);
    });
  });
});