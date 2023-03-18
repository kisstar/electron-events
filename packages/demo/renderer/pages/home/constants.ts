import { TestChannel } from '@demo/main/event';

interface ButtonInfo {
  type: TestChannel;
  content: string;
}

export const mainButtonList: ButtonInfo[] = [
  {
    type: 'own',
    content: 'Trigger main process'
  },
  {
    type: 'someone',
    content: 'Send events to App window'
  },
  {
    type: 'several',
    content: 'Send events to App and Bramble window'
  },
  {
    type: 'all',
    content: 'Send events to all windows'
  }
];
