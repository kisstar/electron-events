<script setup lang="ts">
import { onMounted } from 'vue';
import { useEvents } from '../hooks';
import { CHANNEL, getDebug, SAY_HI, setTitle, WINDOW_AMEM } from '../../utils';

const debug = getDebug(WINDOW_AMEM.BRAMBLE);
const events = useEvents();

onMounted(() => {
  setTitle(WINDOW_AMEM.BRAMBLE);
});

events.on(WINDOW_AMEM.APP, CHANNEL.RENDERER_SEND_ONE_TO_ONE, () => {
  setTitle(CHANNEL.RENDERER_SEND_ONE_TO_ONE);
  debug(
    WINDOW_AMEM.APP,
    `Received a message from App on channel ${CHANNEL.RENDERER_SEND_ONE_TO_ONE}.`
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
