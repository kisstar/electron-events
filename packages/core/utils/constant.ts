export const EVENT_CENTER = '__ELECTRON_EVENTS_CENTER__';

export const MAIN_EVENT_NAME = 'main';

export const ANY_WINDOW_SYMBOL = '*';

export const SELF_NAME = '__ELECTRON_EVENTS_SELF__';

export const enum EventType {
  NORMAL = 'NORMAL',
  RESPONSIVE = 'RESPONSIVE',
  RESPONSIVE_RESPONSE = 'RESPONSIVE_RESPONSE'
}

export const DEFAULT_TIMEOUT = 5000;

export const enum ErrorCode {
  SUCCESS = 200,
  NOT_FOUNT = 404,
  EXECUTION_EXCEPTION = 500,
  OVERTIME = 408
}
