import { WindowInfo } from '../../main/event';

const herf = location.protocol.startsWith('file')
  ? location.origin + location.pathname
  : location.origin;

export const windowList: WindowInfo[] = [
  {
    name: 'App',
    rendererSendId: 'renderer-send-to-app',
    rendererInvokeId: 'renderer-invoke-to-app',
    url: `${herf}`,
    status: 'lock'
  },
  {
    name: 'Bramble',
    rendererSendId: 'renderer-send-to-bramble',
    rendererInvokeId: 'renderer-invoke-to-bramble',
    url: `${herf}#bramble`,
    status: 'normal'
  },
  {
    name: 'Briar',
    rendererSendId: 'renderer-send-to-briar',
    rendererInvokeId: 'renderer-invoke-to-briar',
    url: `${herf}#briar`,
    status: 'normal'
  }
];
