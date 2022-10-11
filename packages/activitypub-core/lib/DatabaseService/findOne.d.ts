import { DatabaseService } from '.';
import { AP } from 'activitypub-core-types';
export declare function findOne(this: DatabaseService, collection: string, matchingObject: {
    [key: string]: unknown;
}): Promise<AP.Entity | null>;
