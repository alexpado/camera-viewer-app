<template>
  <div class="title-bar">
    <span>Camera Viewer App</span>
    <div class="controls">
      <button class="button close" @click="endApp">
        <x-icon></x-icon>
      </button>
    </div>
  </div>
</template>

<script>
import {XIcon}       from 'vue-feather-icons';
import {ipcRenderer} from 'electron';

export default {
  name      : "TitleBar",
  components: {
    XIcon
  },
  methods   : {
    endApp() {
      ipcRenderer.send('close');
    }
  }
}
</script>

<style lang="scss">
.title-bar {
  display:            flex;
  background-color:   #232323;
  height:             100%;
  width:              100%;
  -webkit-app-region: drag;

  span {
    color:          white;
    margin:         auto 8px;
    text-transform: uppercase;
    font-size:      0.75em;
  }

  .controls {
    margin:             auto 0 auto auto;
    -webkit-app-region: no-drag;
    height:             100%;

    .button {
      border:           none;
      background-color: transparent;
      width:            60px;
      color:            white;
      height:           100%;

      &:focus, &:active {
        outline: none
      }

      &:hover {
        background-color: #343434;
      }

      &.close:hover {
        background-color: #E53636;
      }
    }
  }
}
</style>
