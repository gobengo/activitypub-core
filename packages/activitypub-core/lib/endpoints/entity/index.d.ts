/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
import { DatabaseService } from '../../DatabaseService';
import { AP } from 'activitypub-core-types';
export declare function entityGetHandler(request: IncomingMessage, response: ServerResponse, providedDatabaseService?: DatabaseService): Promise<{
    props: {};
} | {
    props: {
        entity: AP.Article | AP.Event | AP.Note | AP.Page | AP.Place | AP.Relationship | AP.Tombstone | AP.Profile | AP.Document | AP.Application | AP.Service | AP.Group | AP.Organization | AP.Person | AP.Accept | AP.Follow | AP.Delete | AP.Create | AP.Arrive | AP.Add | AP.Offer | AP.Like | AP.Leave | AP.Ignore | AP.Join | AP.Reject | AP.View | AP.Update | AP.Undo | AP.Remove | AP.Read | AP.Listen | AP.Move | AP.Travel | AP.Announce | AP.Flag | AP.Dislike | AP.Question | AP.Collection | AP.OrderedCollection | AP.CollectionPage | AP.OrderedCollectionPage | import("activitypub-core-types/lib/activitypub/Core/Link").BaseLink | import("activitypub-core-types/lib/activitypub/Core").Mention;
    };
}>;
