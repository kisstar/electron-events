<script setup lang="ts">
import { onMounted } from 'vue';
import { useEvents } from '../hooks';
import { CHANNEL, getDebug, SAY_HI, setTitle, WINDOW_NAME } from '../../utils';

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
events.on('*', SAY_HI, () => {
  debug('*', 'Received a mass message on channel sayHi.');
});
</script>

<template>
  <h3>Send Events</h3>
  <p>
    <button @click="events.emitTo('Briar', SAY_HI)">
      Send events to Briar window
    </button>
    <button @click="events.emitTo('main', SAY_HI)">
      Send events to main process
    </button>
  </p>
</template>
