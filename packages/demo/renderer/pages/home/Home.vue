<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { MAIN_EVENT_NAME } from '@core/utils';
import { TestChannelInfo, WindowInfo } from '@demo/main/event';
import { useEvents } from '@demo/renderer/hooks';
import { windowList } from '@demo/renderer/config';
import {
  WINDOW_NAME,
  CHANNEL,
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
  }
};
const invokeWindowEvent = async (windowInfo: WindowInfo) => {
  let title = '';

  switch (windowInfo.name) {
    case WINDOW_NAME.APP:
      title = await events.invoke(CHANNEL.RENDERER_INVOKE_TO_SELF);
      setTitle(title);
      break;
    case WINDOW_NAME.BRAMBLE:
      title = await events.invokeTo(
        WINDOW_NAME.BRAMBLE,
        CHANNEL.RENDERER_INVOKE_ONE_TO_ONE
      );
      setTitle(title);
      break;
    default:
  }
};
const sendWindowsEvent = () => {
  events.emitTo(
    downtimeWindowList.value.map(win => win.name),
    CHANNEL.RENDERER_SEND_ONE_TO_SEVERAL
  );
};
const invokeWindowsEvent = async () => {
  const titles = await events.invokeTo(
    downtimeWindowList.value.map(win => win.name),
    CHANNEL.RENDERER_INVOKE_ONE_TO_SEVERAL
  );

  setTitle(JSON.stringify(titles));
};
const invokeMainEvent = async () => {
  const title = await events.invokeTo('main', CHANNEL.RENDERER_INVOKE_TO_MAIN);

  setTitle(title);
};
const invokeAllWindow = async () => {
  const titles = await events.invokeTo('*', CHANNEL.RENDERER_INVOKE_ONE_TO_ALL);

  setTitle(JSON.stringify(titles));
};
const triggerMainEvent = (params: TestChannelInfo) => {
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
events.on(CHANNEL.RENDERER_SEND_ONE_TO_ALL, () => {
  setTitle(CHANNEL.RENDERER_SEND_ONE_TO_ALL);
  debug(
    'self',
    `Received a message from yourself on channel ${CHANNEL.RENDERER_SEND_ONE_TO_ALL}.`
  );
});
events.handle(CHANNEL.RENDERER_INVOKE_TO_SELF, () => {
  debug(
    'self',
    `Received a message from yourself on channel ${CHANNEL.RENDERER_INVOKE_TO_SELF}.`
  );

  return CHANNEL.RENDERER_INVOKE_TO_SELF;
});
events.handle(CHANNEL.RENDERER_INVOKE_ONE_TO_ALL, () => {
  debug(
    'self',
    `Received a message from yourself on channel ${CHANNEL.RENDERER_INVOKE_ONE_TO_ALL}.`
  );

  return CHANNEL.RENDERER_INVOKE_ONE_TO_ALL;
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

  <hr />

  <h3>Main process event</h3>
  <p>
    <button
      v-for="{ type, content } in mainButtonList"
      :key="type"
      disabled
      @click="triggerMainEvent({ type })"
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
    <button id="renderer-send-to-several" @click="sendWindowsEvent()">
      Send events to Bramble and Briar window
    </button>
    <button
      id="renderer-send-to-all"
      @click="events.emitTo('*', CHANNEL.RENDERER_SEND_ONE_TO_ALL)"
    >
      Send events to main process and other windows
    </button>
  </p>

  <hr />

  <h3>Invoke Events</h3>
  <p>
    <button id="renderer-invoke-to-main" @click="invokeMainEvent">
      Invoke events to the main process
    </button>
    <button
      v-for="windowInfo in windowList"
      :id="windowInfo.rendererInvokeId"
      @click="invokeWindowEvent(windowInfo)"
    >
      {{ `Invoke events to ${windowInfo.name} window` }}
    </button>
  </p>

  <h3>Multiple events</h3>
  <p>
    <button id="renderer-invoke-to-several" @click="invokeWindowsEvent()">
      Invoke events to Bramble and Briar window
    </button>
    <button id="renderer-invoke-to-all" @click="invokeAllWindow">
      Invoke events to main process and other windows
    </button>
  </p>
</template>

<style>
button {
  margin-bottom: 16px;
  cursor: pointer;
}

button:not(:first-child) {
  margin-left: 16px;
}

button:disabled {
  cursor: not-allowed;
}
</style>
