<script setup lang="ts">
import { onMounted } from 'vue';
import { useEvents } from '../hooks';
import { SAY_HI } from '../../utils';

const events = useEvents();

onMounted(() => {
  document.title = 'Briar';
});

events.on('App', SAY_HI, () => {
  console.log('Received a message from App on channel sayHi.');
});
events.on('Bramble', SAY_HI, () => {
  console.log('Received a message from Bramble on channel sayHi.');
});
events.on('*', SAY_HI, () => {
  console.log('Received a mass message on channel sayHi.');
});
</script>

<template>
  <div>Briar</div>
</template>
