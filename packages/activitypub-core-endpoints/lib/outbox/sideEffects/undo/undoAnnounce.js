"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUndoAnnounce = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function handleUndoAnnounce() {
    if (!('object' in this.activity)) {
        return;
    }
    if (!this.activity.id) {
        throw new Error('Bad activity: no ID.');
    }
    const actorId = (0, activitypub_core_utilities_1.getId)(this.activity.actor);
    if (!actorId) {
        throw new Error('Bad actor: no ID.');
    }
    const actor = await this.databaseService.queryById(actorId);
    if (!actor || !('outbox' in actor)) {
        throw new Error('Bad actor: not found.');
    }
    const objectId = (0, activitypub_core_utilities_1.getId)(this.activity.object);
    if (!objectId) {
        throw new Error('Bad object: no ID.');
    }
    const object = await this.databaseService.queryById(objectId);
    if (!object) {
        throw new Error('Bad object: not found.');
    }
    if (!('shares' in object) || !object.shares) {
        throw new Error('Bad object: no shares collection.');
    }
    const sharesId = (0, activitypub_core_utilities_1.getId)(object.shares);
    if (!sharesId) {
        throw new Error('Bad shares collection: no ID.');
    }
    if (!('streams' in actor) ||
        !actor.streams ||
        !Array.isArray(actor.streams)) {
        throw new Error('Bad actor: no streams.');
    }
    const streams = await Promise.all(actor.streams
        .map((stream) => (stream instanceof URL ? stream : stream.id))
        .map(async (id) => (id ? await this.databaseService.queryById(id) : null)));
    const shared = streams.find((stream) => {
        if (stream && 'name' in stream) {
            if (stream.name === 'Shared') {
                return true;
            }
        }
    });
    if (!shared || !shared.id) {
        throw new Error('Bad actor: no shared collection.');
    }
    await Promise.all([
        this.databaseService.removeOrderedItem(sharesId, this.activity.id),
        this.databaseService.removeOrderedItem(shared.id, object.id),
    ]);
}
exports.handleUndoAnnounce = handleUndoAnnounce;
//# sourceMappingURL=undoAnnounce.js.map