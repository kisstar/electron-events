import { WindowInfo } from '../../main/event';

export const windowList: WindowInfo[] = [
  {
    name: 'App',
    url: `${location.origin}/`,
    status: 'lock'
  },
  {
    name: 'Bramble',
    url: `${location.origin}/#bramble`,
    status: 'normal'
  },
  {
    name: 'Briar',
    url: `${location.origin}/#briar`,
    status: 'normal'
  }
];
