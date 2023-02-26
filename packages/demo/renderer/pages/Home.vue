<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { MAIN_EVENT_NAME } from '@core/utils';
import { useEvents } from '../hooks';
import { windowList } from '../config';
import { CREATE_WINDOW, SAY_HI } from '../..//utils';
import { WindowInfo } from '../../main/event';

const events = useEvents();
const downtimeWindowList = computed(() =>
  windowList.filter(win => win.status !== 'lock')
);
const createWindow = (windowInfo: WindowInfo) => {
  events.emitTo(MAIN_EVENT_NAME, CREATE_WINDOW, windowInfo);
};
const sendEvent = (windowInfo: WindowInfo) =>
  events.emitTo(windowInfo.name, SAY_HI);
const sendWindowsEvent = () => {
  events.emitTo(
    downtimeWindowList.value.map(win => win.name),
    SAY_HI
  );
};
const sendAllEvent = () => events.emitTo('*', SAY_HI);

onMounted(() => {
  document.title = 'Electron Events';
});

events.on('App', SAY_HI, () => {
  console.log('Received a message from app on channel sayHi.');
});
</script>

<template>
  <h3>Create a window</h3>
  <p>
    <button
      v-for="windowInfo in downtimeWindowList"
      @click="createWindow(windowInfo)"
    >
      {{ `Create a ${windowInfo.name} window` }}
    </button>
  </p>
  <h3>Send Events</h3>
  <p>
    <button v-for="windowInfo in windowList" @click="sendEvent(windowInfo)">
      {{ `Send events to ${windowInfo.name} window` }}
    </button>
  </p>
  <h3>Broadcast events</h3>
  <p>
    <button @click="sendWindowsEvent()">
      {{
        `Send events to ${downtimeWindowList
          .map(win => win.name)
          .join(' and ')} window`
      }}
    </button>
    <button @click="sendAllEvent()">
      {{
        `Send events to ${windowList.map(win => win.name).join(' and ')} window`
      }}
    </button>
  </p>
</template>

<style>
p button:not(:first-child) {
  margin-left: 16px;
}
</style>
