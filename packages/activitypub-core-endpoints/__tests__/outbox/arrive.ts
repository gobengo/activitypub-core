import {
  ACTIVITYSTREAMS_CONTEXT,
  getCollectionNameByUrl,
} from 'activitypub-core-utilities';
import { AP } from 'activitypub-core-types';
import * as data from '../../__data__';
import { handleOutboxPost } from '../../test_utils';


describe('Endpoints', () => {
  describe('Actor Outbox', () => {
    it('Accepts Activity Objects (outbox:accepts-activities)', async () => {
      const activity: AP.Arrive = {
        '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
        type: AP.ActivityTypes.ARRIVE,
        actor: new URL(data.aliceUrl),
        location: {
          type: AP.ExtendedObjectTypes.PLACE,
          name: 'NYC',
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
