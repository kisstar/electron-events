<script setup lang="ts">
import { onMounted } from 'vue';
import { useEvents } from '../hooks';
import { CHANNEL, getDebug, SAY_HI, setTitle, WINDOW_NAME } from '../../utils';
import { MAIN_EVENT_NAME } from '@core/utils';

const debug = getDebug('Briar');
const events = useEvents();

onMounted(() => {
  document.title = 'Briar';
});

events.on(MAIN_EVENT_NAME, SAY_HI, () => {
  debug(
    MAIN_EVENT_NAME,
    'Received a message from the main process on channel sayHi.'
  );
});
events.on(WINDOW_NAME.APP, CHANNEL.RENDERER_SEND_ONE_TO_SEVERAL, () => {
  setTitle(CHANNEL.RENDERER_SEND_ONE_TO_SEVERAL);
  debug(
    WINDOW_NAME.APP,
    `Received a message from ${WINDOW_NAME.APP} on channel ${CHANNEL.RENDERER_SEND_ONE_TO_SEVERAL}.`
  );
});
events.on(WINDOW_NAME.APP, CHANNEL.RENDERER_SEND_ONE_TO_ALL, () => {
  setTitle(CHANNEL.RENDERER_SEND_ONE_TO_ALL);
  debug(
    WINDOW_NAME.APP,
    `Received a message from ${WINDOW_NAME.APP} on channel ${CHANNEL.RENDERER_SEND_ONE_TO_ALL}.`
  );
});
events.on(['App', 'Bramble'], SAY_HI, () => {
  debug(
    ['App', 'Bramble'].join('|'),
    'Received a message from Bramble on channel sayHi.'
  );
});
</script>

<template>
  <div>Briar</div>
</template>
