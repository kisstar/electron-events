<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { MAIN_EVENT_NAME } from '@core/utils';
import { TestChannelInfo, WindowInfo } from '@demo/main/event';
import { useEvents } from '@demo/renderer/hooks';
import { windowList } from '@demo/renderer/config';
import {
  WINDOW_NAME,
  CHANNEL,
  SAY_HI,
  TEST_CHANNEL,
  getDebug,
  setTitle
} from '@demo/utils';
import { mainButtonList } from './constants';

const debug = getDebug(WINDOW_NAME.APP);
const events = useEvents();
const downtimeWindowList = computed(() =>
  windowList.filter(win => win.status !== 'lock')
);
const createWindow = (windowInfo: WindowInfo) => {
  window.electronAPI.createWindow(windowInfo);
};
const sendWindowEvent = (windowInfo: WindowInfo) => {
  switch (windowInfo.name) {
    case 'App':
      events.emit(CHANNEL.RENDERER_SEND_TO_SELF);
      break;
    case 'Bramble':
      events.emitTo(WINDOW_NAME.BRAMBLE, CHANNEL.RENDERER_SEND_ONE_TO_ONE);
      break;
    default:
      events.emitTo(windowInfo.name, SAY_HI);
  }
};
const sendWindowsEvent = () => {
  events.emitTo(
    downtimeWindowList.value.map(win => win.name),
    SAY_HI
  );
};
const triggerMainEventn = (params: TestChannelInfo) => {
  events.emitTo(MAIN_EVENT_NAME, TEST_CHANNEL, params);
};

onMounted(() => {
  setTitle(WINDOW_NAME.APP);
});

events.on(CHANNEL.RENDERER_SEND_TO_SELF, () => {
  setTitle(CHANNEL.RENDERER_SEND_TO_SELF);
  debug(
    'self',
    `Received a message from yourself on channel ${CHANNEL.RENDERER_SEND_TO_SELF}.`
  );
});
events.on(MAIN_EVENT_NAME, SAY_HI, () => {
  debug(
    MAIN_EVENT_NAME,
    'Received a message from the main process on channel sayHi.'
  );
});
</script>

<template>
  <h3>Create a window</h3>
  <p>
    <button
      v-for="windowInfo in downtimeWindowList"
      :id="`create-${windowInfo.name}`"
      @click="createWindow(windowInfo)"
    >
      {{ `Create a ${windowInfo.name} window` }}
    </button>
  </p>

  <h3>Main process event</h3>
  <p>
    <button
      v-for="{ type, content } in mainButtonList"
      :key="type"
      @click="triggerMainEventn({ type })"
    >
      {{ content }}
    </button>
  </p>

  <h3>Send Events</h3>
  <p>
    <button
      id="renderer-send-to-main"
      @click="events.emitTo('main', CHANNEL.RENDERER_SEND_TO_MAIN)"
    >
      Send events to the main process
    </button>
    <button
      v-for="windowInfo in windowList"
      :id="windowInfo.rendererSendId"
      @click="sendWindowEvent(windowInfo)"
    >
      {{ `Send events to ${windowInfo.name} window` }}
    </button>
  </p>

  <h3>Broadcast events</h3>
  <p>
    <button @click="sendWindowsEvent()">
      Send events to Bramble and Briar window
    </button>
    <button @click="events.emitTo('*', SAY_HI)">
      Send events to main process and other windows
    </button>
  </p>
</template>

<style>
button {
  margin-bottom: 16px;
}

button:not(:first-child) {
  margin-left: 16px;
}
</style>
