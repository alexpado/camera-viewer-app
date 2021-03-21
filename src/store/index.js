import Vue  from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state    : {
    devices: {
      available: {
        audio: [],
        video: []
      },
      selected : {
        audio: null,
        video: null
      }
    }
  },
  mutations: {
    CLEAR_AUDIO_DEVICES(state) {
      state.devices.available.audio = [];
      state.devices.selected.audio  = null;
    },
    CLEAR_VIDEO_DEVICES(state) {
      state.devices.available.video = [];
      state.devices.selected.video  = null;
    },
    REGISTER_AUDIO_DEVICE(state, payload) {
      state.devices.available.audio.push(payload);
      if (payload.selected) {
        state.devices.selected.audio = payload.id;
      }
    },
    REGISTER_VIDEO_DEVICE(state, payload) {
      state.devices.available.video.push(payload);
      if (payload.selected) {
        state.devices.selected.video = payload.id;
      }
    },
    SET_AUDIO_DEVICE(state, payload) {
      state.devices.selected.audio = payload;
      localStorage.setItem('lastAudioDevice', payload);
    },
    SET_VIDEO_DEVICE(state, payload) {
      state.devices.selected.video = payload;
      localStorage.setItem('lastVideoDevice', payload);
    }
  },
  actions  : {
    clearDevices({commit}) {
      return new Promise((resolve) => {
        commit("CLEAR_AUDIO_DEVICES");
        commit("CLEAR_VIDEO_DEVICES");
        resolve();
      })
    },
    async initializeDevices({commit, dispatch}) {
      return new Promise(async resolve => {
        dispatch('clearDevices').then(() => {
          navigator.mediaDevices.enumerateDevices().then(devices => {

            const audioDevices = devices.filter(device => device.kind === "audioinput");
            const videoDevices = devices.filter(device => device.kind === "videoinput");

            const defaultAudioDevice = audioDevices.filter(device => device.deviceId === 'default')[0];
            const defaultVideoDevice = videoDevices[0];

            const getShortDeviceName = (device) => {
              /*const idx = device.label.indexOf('(');

               if (idx !== -1) {
               return device.label.substr(0, idx - 1);
               }*/
              return device.label;
            }

            const isAudioDeviceSelected = (device) => {
              const last = localStorage['lastAudioDevice'];
              if (last) {
                const lastDevice = audioDevices.filter(d => d.deviceId === last);
                if (lastDevice.length > 0) {
                  return lastDevice[0].deviceId === device.deviceId;
                }
              }
              return device.groupId === defaultAudioDevice.groupId;
            }

            const isVideoDeviceSelected = (device) => {
              const last = localStorage['lastVideoDevice'];
              if (last) {
                const lastDevice = videoDevices.filter(d => d.deviceId === last);
                if (lastDevice.length > 0) {
                  return lastDevice[0].deviceId === device.deviceId;
                }
              }
              return device.groupId === defaultVideoDevice.groupId
            }

            audioDevices.filter(device => device.deviceId.length === 64).forEach(audioDevice => {
              commit("REGISTER_AUDIO_DEVICE", {
                id      : audioDevice.deviceId,
                name    : getShortDeviceName(audioDevice),
                selected: isAudioDeviceSelected(audioDevice)
              });
            });

            videoDevices.filter(device => device.deviceId.length === 64).forEach(videoDevice => {
              commit("REGISTER_VIDEO_DEVICE", {
                id      : videoDevice.deviceId,
                name    : getShortDeviceName(videoDevice),
                selected: isVideoDeviceSelected(videoDevice)
              })
            });

            resolve();
          })
        });
      });
    }
  },
  modules  : {}
})
