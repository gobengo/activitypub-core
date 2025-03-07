import { AP, Plugin } from 'activitypub-core-types';
import {
  CONTENT_TYPE_HEADER,
  getId,
  HTML_CONTENT_TYPE,
  LOCAL_DOMAIN,
} from 'activitypub-core-utilities';
import { convertUrlsToStrings } from 'activitypub-core-utilities';
import type { DbAdapter, AuthAdapter } from 'activitypub-core-types';
import type { IncomingMessage, ServerResponse } from 'http';

export class DirectoryGetEndpoint {
  req: IncomingMessage;
  res: ServerResponse;
  adapters: {
    auth: AuthAdapter;
    db: DbAdapter;
  };
  plugins?: Plugin[];
  url: URL;

  constructor(
    req: IncomingMessage,
    res: ServerResponse,
    adapters: {
      auth: AuthAdapter;
      db: DbAdapter;
    },
    plugins?: Plugin[],
    url?: URL,
  ) {
    this.req = req;
    this.res = res;
    this.adapters = adapters;
    this.plugins = plugins;
    this.url = url ?? new URL(`${LOCAL_DOMAIN}${req.url}`);
  }

  public async respond(render: Function) {
    const groups: AP.Group[] = await this.adapters.db.findAll('entity', {
      type: 'Group',
    });

    const groupsWithFollowers = await Promise.all(groups.map(async (group) => ({
      ...convertUrlsToStrings(group),
      shared: convertUrlsToStrings(await this.adapters.db.findEntityById(getId(group.streams.find(stream => `${stream}`.endsWith('shared'))))),
      followers: convertUrlsToStrings(await this.adapters.db.findEntityById(getId(group.followers))),
    }))) as AP.Group[];

    this.res.statusCode = 200;
    this.res.setHeader(CONTENT_TYPE_HEADER, HTML_CONTENT_TYPE);
    this.res.write(
      await render({
        currentUrl: this.req.url,
        groups: groupsWithFollowers,
      }),
    );
    this.res.end();
  }
}
