"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAndSendToForeignActorInbox = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function signAndSendToForeignActorInbox(foreignActorInbox, actor, activity) {
    console.log('SENDING TO...', foreignActorInbox.toString());
    const convertedActivity = (0, activitypub_core_utilities_1.convertUrlsToStrings)(activity);
    const { dateHeader, digestHeader, signatureHeader } = await (0, activitypub_core_utilities_1.getHttpSignature)(foreignActorInbox, actor.id, await this.adapters.db.getPrivateKey(actor), convertedActivity);
    return await this.adapters
        .fetch(foreignActorInbox.toString(), {
        method: 'post',
        body: JSON.stringify(convertedActivity),
        headers: {
            [activitypub_core_utilities_1.CONTENT_TYPE_HEADER]: activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE,
            [activitypub_core_utilities_1.ACCEPT_HEADER]: activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE,
            Host: foreignActorInbox.hostname,
            Date: dateHeader,
            Digest: digestHeader,
            Signature: signatureHeader,
        },
    })
        .then(async (res) => {
        console.log(await res.text(), res.statusCode);
        return res;
    });
}
exports.signAndSendToForeignActorInbox = signAndSendToForeignActorInbox;
//# sourceMappingURL=signAndSendToForeignActorInbox.js.map