# camera-viewer-app

*Please note that this is a personal project. Its aim is not to be publicly used, but still, I will offer minimum
support if you encounter a bug (might as well accept feature request only if I'm not lazy too)*

## Why ?

I wanted to play games on my Switch and also screen share it on Discord to my friends. So I bought an HDMI to USB
adapter which would "emulate" a camera with microphone from the HDMI input stream (because capture cards are freaking
expensive).

I found multiple software allowing to stream the video/audio stream, but none of them had video and audio synchronized
or had decent latency to not obliterate the game experience.

So what was my last option ? DIY !

## Support

This software can support any video/audio stream as long as they are detected as input device by the OS. Although I
don't know how this would be useful streaming your camera with your microphone, but that works too.

## Bug, Feature request

As stated above, I won't offer full support and active development on this project. As long as it works for me, I won't
update it.

If you ever encounter a bug, open an issue, I might look into it when I don't have better things to do.

If you have a feature request, do not hesitate to also open an issue, but keep in mind that I can straight up refuse
working on it due to my laziness (or wait for an undefined amount of time).

## How to use

Not really the most complicated software out there:

- Right click to lock/unlock the UI
- F11/Double click to enable fullscreen
- Scroll on the volume bar to change volume
- Press F12 to take a screenshot
- Press F10 to start/stop video recording

## TODO

- [x] Change volume within the app
- [x] Toggle fullscreen with double click
- [x] Video settings (resolution & framerate)
- [x] Add back the close button (you can use CTRL+W or ALT+F4 in the meantime)
- [ ] Auto device list refresh (restart or CTRL+R in the meantime)
- [x] Keep the volume level when switching audio source
- [x] Remember the last audio & video devices used
- [ ] Stream video data to file when recording (see [issue #4](https://github.com/alexpado/camera-viewer-app/issues/4))

## Using this for you Nintendo Switch ?

Although I think it depends on the adapter used, I had a better rendering quality by setting my switch's resolution to
720p (don't ask me why). At 1080p, everything was a bit blurry.

**To change the switch's resolution:** System Settings > TV Output > TV Resolution

For reference, here's what the adapter I'm using looks like and I paid it around 7€:

![HDMI to USB Adapter](repository/hdmi-usb.jpg)

