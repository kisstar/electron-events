<script setup lang="ts">
import { onMounted } from 'vue';
import { WindowInfo } from '../../main/events/footstone';

const windowList: WindowInfo[] = [
  {
    name: 'Bramble',
    url: `${location.origin}/#bramble`
  },
  {
    name: 'Briar',
    url: `${location.origin}/#briar`
  }
];

onMounted(() => {
  document.title = 'Electron Events';
});

const createWindow = window.electronAPI.createWindow;
</script>

<template>
  <p v-for="windowInfo in windowList">
    <button @click="createWindow(windowInfo)">
      {{ `创建 ${windowInfo.name} 窗口` }}
    </button>
  </p>
</template>
