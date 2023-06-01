/**
 * @param {string} tagName
 * @return {Element}
 */
const findTaggedElement = (tagName) => {
    return document.querySelector(`[data-tag="${tagName}"]`);
}

export default {
    VideoContainer: findTaggedElement('container'),
    VideoPlayer: findTaggedElement('media'),
    Overlay: findTaggedElement('overlay'),
    VolumeController: findTaggedElement('audio-output'),
    VolumeFeedback: findTaggedElement('volume'),
    AudioDevicesContainer: findTaggedElement('audio-devices'),
    VideoDevicesContainer: findTaggedElement('video-devices'),
    VideoOptionsContainer: findTaggedElement('video-options'),
    GameContainer: findTaggedElement('games'),
    GameSettingList: findTaggedElement('game-setting-list'),
    NewGameForm: findTaggedElement('form-add-game'),
    SettingsButton: findTaggedElement('settings'),
    CloseButton: findTaggedElement('close'),
    NotificationContainer: findTaggedElement('notifications')
};
