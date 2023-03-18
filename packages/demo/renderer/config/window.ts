import { WindowInfo } from '../../main/event';

export const windowList: WindowInfo[] = [
  {
    name: 'App',
    rendererSendId: 'renderer-send-to-app',
    url: `${location.origin}/`,
    status: 'lock'
  },
  {
    name: 'Bramble',
    rendererSendId: 'renderer-send-to-bramble',
    url: `${location.origin}/#bramble`,
    status: 'normal'
  },
  {
    name: 'Briar',
    rendererSendId: 'renderer-send-to-briar',
    url: `${location.origin}/#briar`,
    status: 'normal'
  }
];
