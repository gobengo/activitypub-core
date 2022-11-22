"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityGetEndpoint = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activitypub_core_utilities_2 = require("activitypub-core-utilities");
const activitypub_core_utilities_3 = require("activitypub-core-utilities");
const cookie_1 = __importDefault(require("cookie"));
class EntityGetEndpoint {
    req;
    res;
    adapters;
    plugins;
    url;
    constructor(req, res, adapters, plugins, url) {
        this.req = req;
        this.res = res;
        this.adapters = adapters;
        this.plugins = plugins;
        this.url = url ?? new URL(`${activitypub_core_utilities_1.LOCAL_DOMAIN}${req.url}`);
    }
    handleBadRequest() {
        this.res.statusCode = 500;
        this.res.write('Bad request');
        this.res.end();
        return {
            props: {},
        };
    }
    handleNotFound() {
        this.res.statusCode = 400;
        this.res.write('Not found');
        this.res.end();
        return {
            props: {},
        };
    }
    async respond(render) {
        const cookies = cookie_1.default.parse(this.req.headers.cookie ?? '');
        const authorizedActor = await this.adapters.db.getActorByUserId(await this.adapters.auth.getUserIdByToken(cookies.__session ?? ''));
        const entity = await this.adapters.db.findEntityById(this.url);
        if (!entity) {
            return this.handleNotFound();
        }
        if ('publicKey' in entity && entity.publicKey) {
            entity.publicKey = entity.publicKey;
        }
        this.res.setHeader('Vary', 'Accept');
        this.res.statusCode = 200;
        if (this.req.headers.accept?.includes(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE) ||
            this.req.headers.accept?.includes(activitypub_core_utilities_1.LINKED_DATA_CONTENT_TYPE) ||
            this.req.headers.accept?.includes(activitypub_core_utilities_1.JSON_CONTENT_TYPE)) {
            this.res.setHeader(activitypub_core_utilities_1.CONTENT_TYPE_HEADER, activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE);
            if (!(0, activitypub_core_utilities_1.isTypeOf)(entity, activitypub_core_types_1.AP.CollectionTypes)) {
                this.res.write((0, activitypub_core_utilities_3.stringify)(entity));
                this.res.end();
                return;
            }
            if ((0, activitypub_core_utilities_1.isType)(entity, activitypub_core_types_1.AP.CollectionTypes.COLLECTION)) {
                const expandedItems = await Promise.all(entity.items.map(async (id) => {
                    return await this.adapters.db.findEntityById(id) ?? await this.adapters.db.fetchEntityById(id) ?? id;
                }));
                const items = [];
                for (const item of expandedItems) {
                    if (item) {
                        if (item instanceof URL) {
                            items.push(item);
                        }
                        else {
                            if ((0, activitypub_core_utilities_1.isTypeOf)(item, activitypub_core_types_1.AP.ActivityTypes) && 'object' in item && item.object instanceof URL) {
                                const object = await this.adapters.db.findEntityById(item.object);
                                if (object) {
                                    item.object = object;
                                }
                            }
                            items.push(item);
                        }
                    }
                }
                this.res.write((0, activitypub_core_utilities_3.stringify)({
                    ...entity,
                    items,
                }));
                this.res.end();
                return;
            }
            if ((0, activitypub_core_utilities_1.isType)(entity, activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION)) {
                const expandedItems = await Promise.all(entity.orderedItems.map(async (id) => {
                    return await this.adapters.db.findEntityById(id) ?? await this.adapters.db.fetchEntityById(id) ?? id;
                }));
                const orderedItems = [];
                for (const item of expandedItems) {
                    if (item) {
                        if (item instanceof URL) {
                            orderedItems.push(item);
                        }
                        else {
                            if ((0, activitypub_core_utilities_1.isTypeOf)(item, activitypub_core_types_1.AP.ActivityTypes) && 'object' in item && item.object instanceof URL) {
                                const object = await this.adapters.db.findEntityById(item.object);
                                if (object) {
                                    item.object = object;
                                }
                            }
                            orderedItems.push(item);
                        }
                    }
                }
                this.res.write((0, activitypub_core_utilities_3.stringify)({
                    ...entity,
                    orderedItems,
                }));
                this.res.end();
                return;
            }
            this.handleNotFound();
            return;
        }
        else {
            this.res.setHeader(activitypub_core_utilities_1.CONTENT_TYPE_HEADER, activitypub_core_utilities_1.HTML_CONTENT_TYPE);
            this.res.write(await render({
                entity: (0, activitypub_core_utilities_2.convertUrlsToStrings)(entity),
                actor: (0, activitypub_core_utilities_2.convertUrlsToStrings)(authorizedActor),
            }));
        }
        this.res.end();
    }
}
exports.EntityGetEndpoint = EntityGetEndpoint;
//# sourceMappingURL=index.js.map