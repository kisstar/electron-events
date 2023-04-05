export const TEST_CHANNEL = 'TEST_CHANNEL';

export const enum WINDOW_NAME {
  APP = 'App',
  BRAMBLE = 'Bramble',
  BRIAR = 'Briar'
}

export const enum CHANNEL {
  RENDERER_SEND_TO_SELF = '0',
  RENDERER_SEND_TO_MAIN = '1',
  RENDERER_SEND_ONE_TO_ONE = '2',
  RENDERER_SEND_ONE_TO_SEVERAL = '3',
  RENDERER_SEND_ONE_TO_ALL = '4'
}

export const enum TestChannelType {
  GET_WINDOW_ID,
  CREATE_WINDOW
}

export const SAY_HI = 'SAY_HI';
