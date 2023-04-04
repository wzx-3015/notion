<script setup>
import { reactive } from 'vue'

const versions = reactive({ ...window.electron.process.versions })

const handleGO = () => {
  console.log('===')
}
</script>

<template>
  <ul class="versions">
    <li class="electron-version">Electron v{{ versions.electron }}</li>
    <li class="chrome-version">Chromium v{{ versions.chrome }}</li>
    <li class="node-version">Node v{{ versions.node }}</li>
    <li class="v8-version">V8 v{{ versions.v8 }}</li>
  </ul>\
  <el-button @click="handleGO">测试</el-button>
</template>
