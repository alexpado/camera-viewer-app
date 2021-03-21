<template>
  <div id="app">
    <div id="layout" :class="{closed: closed}" @contextmenu="toggleUI">
      <div class="layout-title">
        <title-bar></title-bar>
      </div>
      <div class="layout-button">
        <buttons></buttons>
      </div>
      <div class="layout-viewer">
        <camera-container></camera-container>
      </div>
    </div>
  </div>
</template>

<script>

import CameraContainer from "@/components/CameraContainer";
import TitleBar        from "@/components/TitleBar";
import Buttons         from "@/components/Buttons";

export default {
  name      : 'App',
  components: {Buttons, TitleBar, CameraContainer},
  data() {
    return {
      closed: false
    }
  },
  methods: {
    toggleUI() {
      this.closed = !this.closed;
    }
  }
}
</script>

<style lang="scss">

* {
  margin:  0;
  padding: 0;
}

#app {
  width:                   100vw;
  height:                  100vh;
  font-family:             Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing:  antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#layout {
  width:          100vw;
  height:         100vh;
  position:       relative;
  overflow:       hidden;

  --ui-title-bar: 30px;
  --ui-tools-bar: 50px;

  &.closed {
    .layout-title {
      top:   calc(var(--ui-title-bar) * -1);
      left:  0;
      right: 0;
    }

    .layout-button {
      bottom:  calc(var(--ui-tools-bar) * -1);
      left:    0;
      right:   0;
      opacity: 0;
    }

    .layout-viewer {
      top:    0;
      left:   0;
      bottom: 0;
      right:  0;
    }
  }

  > div {
    position:   absolute;
    transition: all 0.4s ease-in-out;
  }

  .layout-title {
    height:  var(--ui-title-bar);
    left:    0;
    right:   0;
    top:     0;
    z-index: 2;
  }

  .layout-button {
    left:    0;
    right:   0;
    bottom:  0;
    height:  var(--ui-tools-bar);
    z-index: 2;
    opacity: 1;
    display: flex;
  }

  .layout-viewer {
    top:     var(--ui-title-bar);
    left:    0;
    bottom:  0;
    right:   0;
    z-index: 1;
  }
}
</style>
