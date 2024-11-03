import { type EventKey } from '@core/index';

export const setTitle = (title: string | EventKey<any> | EventKey<any>[]) => {
  let _title = '';
  if (typeof title === 'string') {
    _title = title;
  } else if (Array.isArray(title)) {
    _title = title.join();
  }

  document.title = _title;
};
