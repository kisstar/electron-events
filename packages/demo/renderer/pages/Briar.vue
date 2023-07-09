<script setup lang="ts">
import { onMounted } from 'vue';
import { useEvents } from '../hooks';
import { CHANNEL, getDebug, setTitle, WINDOW_NAME } from '@demo/utils';

const debug = getDebug('Briar');
const events = useEvents();

onMounted(() => {
  document.title = 'Briar';
});

events.on(WINDOW_NAME.APP, CHANNEL.RENDERER_SEND_ONE_TO_SEVERAL, () => {
  setTitle(CHANNEL.RENDERER_SEND_ONE_TO_SEVERAL);
  debug(
    WINDOW_NAME.APP,
    `Received a message from ${WINDOW_NAME.APP} on channel ${CHANNEL.RENDERER_SEND_ONE_TO_SEVERAL}.`
  );
});
events.on('main', CHANNEL.RENDERER_SEND_ONE_TO_ALL, () => {
  setTitle(CHANNEL.RENDERER_SEND_ONE_TO_ALL);
  debug(
    'main',
    `Received a message from main on channel ${CHANNEL.RENDERER_SEND_ONE_TO_ALL}.`
  );
});
events.handle(WINDOW_NAME.APP, CHANNEL.RENDERER_INVOKE_ONE_TO_SEVERAL, () => {
  debug(
    WINDOW_NAME.APP,
    `Received a message from ${WINDOW_NAME.APP} on channel ${CHANNEL.RENDERER_INVOKE_ONE_TO_SEVERAL}.`
  );

  return CHANNEL.RENDERER_INVOKE_ONE_TO_SEVERAL;
});
events.handle(WINDOW_NAME.APP, CHANNEL.RENDERER_INVOKE_ONE_TO_ALL, () => {
  debug(
    WINDOW_NAME.APP,
    `Received a message from ${WINDOW_NAME.APP} on channel ${CHANNEL.RENDERER_INVOKE_ONE_TO_ALL}.`
  );

  return CHANNEL.RENDERER_INVOKE_ONE_TO_ALL;
});
</script>

<template>
  <div>Briar</div>
</template>
