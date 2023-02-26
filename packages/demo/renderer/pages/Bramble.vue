<script setup lang="ts">
import { onMounted } from 'vue';
import { useEvents } from '../hooks';
import { SAY_HI } from '../../utils';

const events = useEvents();
const sendEvent = () => {
  events.emitTo('Briar', SAY_HI);
};

onMounted(() => {
  document.title = 'Bramble';
});

events.on('App', SAY_HI, () => {
  console.log('Received a message from App on channel sayHi.');
});
</script>

<template>
  <h3>Send Events</h3>
  <p>
    <button @click="sendEvent()">
      Send events to Briar window
    </button>
  </p>
</template>
