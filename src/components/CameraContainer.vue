<template>
  <div class="camera-container">
    <video ref="video"></video>
    <audio ref="audio"></audio>
  </div>
</template>

<script>
export default {
  name: "CameraContainer",
  data() {
    return {
      streams     : {
        audio: null,
        video: null
      },
      mediaSource : null,
      audioContext: null,
      gainControl : null
    }
  },
  methods : {
    stopVideoStream() {
      return new Promise(resolve => {
        if (this.streams.video) {
          this.streams.video.getTracks().forEach(function (track) {
            track.stop();
          });
          this.streams.video = null;
        }
        resolve();
      })
    },
    stopAudioStream() {
      return new Promise(resolve => {
        if (this.streams.audio) {
          this.streams.audio.getTracks().forEach(function (track) {
            track.stop();
          });
          this.streams.audio = null;
        }

        if (this.mediaSource) {
          this.mediaSource.disconnect();
          this.mediaSource = null;
        }

        if (this.gainControl) {
          this.gainControl.disconnect();
          this.gainControl = null;
        }

        if (this.audioContext) {
          this.audioContext.close();
          this.audioContext = null;
        }
        resolve();
      });
    },
    openVideoStream() {
      this.stopVideoStream().then(() => {
        if (this.videoSource?.length > 0) {
          navigator.mediaDevices.getUserMedia({
            video: {
              deviceId : this.videoSource,
              width    : {
                ideal: 1280
              },
              height   : {
                ideal: 720
              },
              frameRate: {
                ideal: 60
              },
              latency  : 0.02
            }
          }).then(stream => {
            this.streams.video         = stream;
            this.$refs.video.srcObject = stream;
            this.$refs.video.autoplay  = true;
          });
        }
      });
    },
    openAudioStream() {
      this.stopAudioStream().then(() => {
        if (this.audioSource?.length > 0) {
          navigator.mediaDevices.getUserMedia({
            audio: {
              deviceId        : this.audioSource,
              latency         : 0.02,
              autoGainControl : false,
              echoCancellation: false,
              noiseSuppression: false
            }
          }).then(stream => {
            this.audioContext = new AudioContext();
            this.gainControl  = this.audioContext.createGain();
            const source      = this.audioContext.createMediaStreamSource(stream);
            source.connect(this.gainControl);
            this.gainControl.connect(this.audioContext.destination);
          })
        }
      })
    }
  },
  computed: {
    videoSource() {
      return this.$store.state.devices.selected.video;
    },
    audioSource() {
      return this.$store.state.devices.selected.audio;
    }
  },
  watch   : {
    videoSource() {
      this.openVideoStream();
    },
    audioSource() {
      this.openAudioStream();
    }
  }
}
</script>

<style lang="scss">

.camera-container {
  height:           100%;
  width:            100%;
  background-color: black;
  display:          flex;
  z-index:          50;

  audio {
    display: none;
  }

  video {
    max-width:       100%;
    max-height:      100%;
    width:           100%;
    height:          100%;
    margin:          auto;
    image-rendering: crisp-edges;
    z-index:         50;
  }
}

</style>
