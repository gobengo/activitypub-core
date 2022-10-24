import { ACTIVITYSTREAMS_CONTEXT } from 'activitypub-core-utilities';
import { AP } from 'activitypub-core-types';
import * as data from '../../__data__';
import { handleOutboxPost } from '../../test_utils';


describe('Endpoints', () => {
  describe('Actor Outbox', () => {
    it('Accepts Announce', async () => {
      const activity: AP.Activity = {
        '@context': ACTIVITYSTREAMS_CONTEXT,
        type: 'Announce',
        actor: new URL(data.aliceUrl),
        object: new URL(data.note2Url),
      };

      const { res, db, delivery } =
        await handleOutboxPost(activity, data.aliceOutboxUrl);

      expect(res.statusCode).toBe(201);
      expect(db.saveEntity).toBeCalledTimes(4);
      expect(db.insertOrderedItem).toBeCalledTimes(3);
      expect(delivery.broadcast).toBeCalledTimes(1);
    });
  });
});

