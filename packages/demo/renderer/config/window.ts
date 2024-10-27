import { WindowInfo } from '../../main/event';

const href = location.protocol.startsWith('file')
  ? location.origin + location.pathname
  : location.origin;

export const windowList: WindowInfo[] = [
  {
    name: 'App',
    rendererSendId: 'renderer-send-to-app',
    rendererInvokeId: 'renderer-invoke-to-app',
    url: `${href}`,
    status: 'lock'
  },
  {
    name: 'Bramble',
    rendererSendId: 'renderer-send-to-bramble',
    rendererInvokeId: 'renderer-invoke-to-bramble',
    url: `${href}#bramble`,
    status: 'normal'
  },
  {
    name: 'Briar',
    rendererSendId: 'renderer-send-to-briar',
    rendererInvokeId: 'renderer-invoke-to-briar',
    url: `${href}#briar`,
    status: 'normal'
  }
];
