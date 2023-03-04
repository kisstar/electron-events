<script setup lang="ts">
import { onMounted } from 'vue';
import { useEvents } from '../hooks';
import { getDebug, SAY_HI } from '../../utils';
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
events.on('App', SAY_HI, () => {
  debug('App', 'Received a message from App on channel sayHi.');
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
