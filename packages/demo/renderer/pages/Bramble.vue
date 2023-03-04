<script setup lang="ts">
import { onMounted } from 'vue';
import { useEvents } from '../hooks';
import { getDebug, SAY_HI } from '../../utils';

const debug = getDebug('Bramble');
const events = useEvents();

onMounted(() => {
  document.title = 'Bramble';
});

events.on('App', SAY_HI, () => {
  debug('App', 'Received a message from App on channel sayHi.');
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
