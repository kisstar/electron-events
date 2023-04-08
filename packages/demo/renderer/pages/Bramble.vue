<script setup lang="ts">
import { onMounted } from 'vue';
import { useEvents } from '../hooks';
import { CHANNEL, getDebug, setTitle, WINDOW_NAME } from '@demo/utils';

const debug = getDebug(WINDOW_NAME.BRAMBLE);
const events = useEvents();

onMounted(() => {
  setTitle(WINDOW_NAME.BRAMBLE);
});

events.on(WINDOW_NAME.APP, CHANNEL.RENDERER_SEND_ONE_TO_ONE, () => {
  setTitle(CHANNEL.RENDERER_SEND_ONE_TO_ONE);
  debug(
    WINDOW_NAME.APP,
    `Received a message from ${WINDOW_NAME.APP} on channel ${CHANNEL.RENDERER_SEND_ONE_TO_ONE}.`
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
events.handle(WINDOW_NAME.APP, CHANNEL.RENDERER_INVOKE_ONE_TO_ONE, () => {
  debug(
    WINDOW_NAME.APP,
    `Received a message from ${WINDOW_NAME.APP} on channel ${CHANNEL.RENDERER_INVOKE_ONE_TO_ONE}.`
  );

  return CHANNEL.RENDERER_INVOKE_ONE_TO_ONE;
});
</script>

<template>
  <div>Bramble</div>
</template>
