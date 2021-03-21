<template>
  <div id="side">
    <div class="buttons">
      <div class="button">
        <source-select v-if="selectedAudioDevice" v-model="selectedAudioDevice" :devices="availableAudioDevices">
          <mic-icon class="icon" size="1x"></mic-icon>
        </source-select>
      </div>
      <div class="button">
        <source-select v-if="selectedVideoDevice" v-model="selectedVideoDevice" :devices="availableVideoDevices">
          <video-icon class="icon" size="1x"></video-icon>
        </source-select>
      </div>
    </div>
  </div>
</template>

<script>
import {MicIcon, VideoIcon} from 'vue-feather-icons'
import SourceSelect         from "@/components/sources/SourceSelect";

export default {
  name      : "Side",
  components: {
    SourceSelect,
    MicIcon, VideoIcon
  },
  computed  : {
    availableAudioDevices() {
      return this.$store.state.devices.available.audio;
    },
    availableVideoDevices() {
      return this.$store.state.devices.available.video;
    },
    selectedAudioDevice: {
      get() {
        return this.$store.state.devices.selected.audio;
      },
      set(value) {
        this.$store.commit("SET_AUDIO_DEVICE", value);
      }
    },
    selectedVideoDevice: {
      get() {
        return this.$store.state.devices.selected.video;
      },
      set(value) {
        this.$store.commit("SET_VIDEO_DEVICE", value)
      }
    }
  },
  mounted() {
    this.$store.dispatch("initializeDevices")
  }
}
</script>

<style lang="scss">
#side {
  height: 100%;
  width:  100%;
  color:  white;

  .buttons {
    display:         flex;
    height:          100%;
    margin:          auto;
    justify-content: center;

    .button {
      background-color: #343434;
      margin:           auto 4px;
      height:           30px;
      display:          flex;
      opacity:          0.7;
      transition:       0.1s opacity ease-in-out;
      cursor:           pointer;

      &:hover {
        opacity: 1;
      }

      .icon {
        color:  white;
        margin: auto;
      }
    }
  }
}
</style>
