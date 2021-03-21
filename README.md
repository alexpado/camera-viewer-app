# camera-viewer-app

I've made this application just for the sole purpose of displaying my Nintendo Switch screen on my computer using an
HDMI to USB adapter which behave like a camera, which allows me to screen share it on Discord with sounds.

As I'm playing few rhythm game, I needed to have a very low audio latency, which I was unable to find in other software.

This can be used with any video / audio devices as long as your computer can detect them as such.

________
> I don't really plan to add a lot of feature or keep it frequently updated as it's a fairly simple app.
________

### TODO

- [ ] Add volume control
- [ ] Double click to toggle fullscreen
- [ ] Video stream options (resolution, framerate, ...)

### Project Setup (NodeJS + NPM)

```
git clone https://github.com/alexpado/camera-viewer-app.git
cd camera-viewer-app
npm install
npm run electron:serve
```
