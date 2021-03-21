<template>
  <div class="source-select">
    <div class="source-icon">
      <slot></slot>
    </div>
    <div class="source-items">
      <div class="source-active">
        <span>{{ activeDevice.name }}</span>
      </div>
      <div class="source-available">
        <div v-for="device in devices" :class="{active: device.id === value}" class="source-item"
             @click="setDevice(device)">
          <span>
            {{ device.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name    : "SourceSelect",
  props   : {
    devices: {
      type    : Array,
      required: true
    },
    value  : {
      type    : String,
      required: true
    }
  },
  methods : {
    setDevice(device) {
      this.$emit('input', device.id);
    }
  },
  computed: {
    activeDevice() {
      const query = this.devices.filter(device => device.id === this.value);
      return query.length > 0 ? query[0] : {id: null, name: null};
    }
  }
}
</script>

<style lang="scss">

.source-select {
  --ui-border: 1px solid #666666;
  --ui-width:  250px;

  &:hover {
    --ui-border: 1px solid #999999;

    .source-items {
      .source-available {
        display: block;
      }
    }
  }

  display:     flex;
  box-sizing:  border-box;
  height:      100%;
  width:       var(--ui-width);
  border:      var(--ui-border);
  cursor:      pointer;

  .source-icon {
    height:  100%;
    width:   24px;
    display: flex;

    > * {
      margin: auto;
    }
  }

  .source-items {
    flex-grow: 1;
    color:     white;
    position:  relative;
    font-size: 0.8em;

    .source-active {
      display:       flex;
      height:        100%;
      box-sizing:    border-box;
      padding:       0 8px;
      width:         calc(var(--ui-width) - 24px);
      white-space:   nowrap;
      overflow:      hidden;
      text-overflow: ellipsis;
    }

    .source-available {
      position:         absolute;
      bottom:           100%;
      left:             -23px;
      width:            calc(100% + 24px);
      background-color: #121212;
      z-index:          1000;
      box-sizing:       border-box;
      border:           var(--ui-border);
      border-bottom:    none;
      display:          none;

      .source-item {
        display:       flex;
        padding:       0 8px;
        height:        24px;
        white-space:   nowrap;
        overflow:      hidden;
        text-overflow: ellipsis;
        transition:    background-color 0.2s ease-in-out;

        &:hover {
          background-color: #232323;
        }

        &.active {
          display: none
        }
      }
    }
  }

  span {
    margin:        auto 0;
    width:         100%;
    white-space:   nowrap;
    overflow:      hidden;
    text-overflow: ellipsis;
  }
}

</style>
