<script setup lang="ts">
import { onMounted } from 'vue';
import type { EventKey } from '@core/index';
import { CHANNEL, getDebug, setTitle, WINDOW_NAME } from '@demo/utils';
import { useEvents } from '@demo/renderer/hooks';

const debug = getDebug(WINDOW_NAME.BRAMBLE);
const events = useEvents();
const recordMap = new Map<EventKey, EventKey[]>();

onMounted(() => {
  setTitle(WINDOW_NAME.BRAMBLE);
});

events.once(WINDOW_NAME.APP, CHANNEL.RENDERER_SEND_ONE_TO_ONE_ONCE, () => {
  let record = recordMap.get(CHANNEL.RENDERER_SEND_ONE_TO_ONE_ONCE);

  if (!record) {
    record = [];
    recordMap.set(CHANNEL.RENDERER_SEND_ONE_TO_ONE_ONCE, record);
  }

  record.push(CHANNEL.RENDERER_SEND_ONE_TO_ONE_ONCE);
  setTitle(record);
  debug(
    WINDOW_NAME.APP,
    `Received a message from ${WINDOW_NAME.APP} on channel ${CHANNEL.RENDERER_SEND_ONE_TO_ONE_ONCE}.`
  );
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
events.handleOnce(WINDOW_NAME.APP, CHANNEL.RENDERER_INVOKE_ONE_TO_ONE_ONCE, () => {
  debug(
    WINDOW_NAME.APP,
    `Received a message from ${WINDOW_NAME.APP} on channel ${CHANNEL.RENDERER_INVOKE_ONE_TO_ONE_ONCE}.`
  );

  return CHANNEL.RENDERER_INVOKE_ONE_TO_ONE_ONCE;
});
</script>

<template>
  <div>Bramble</div>
</template>
