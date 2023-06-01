const path = require('path');
const fs   = require('fs');

class Disk {
    /**
     * Create a filename using the current system time.
     *
     * @param {string} type String prepended to the filename representing the file type or category.
     * @param {string} ext File extension to use.
     * @return {string}
     */
    createFilename(type, ext) {
        const date    = new Date();
        const dateStr = date.toLocaleDateString().replaceAll('/', '-');
        const timeStr = date.toLocaleTimeString().replaceAll(':', '-');

        return `${type}-${dateStr}-${timeStr}.${ext}`;
    }

    /**
     * Retrieve the absolute path pointing to the application directory within the user directory.
     *
     * @return {string}
     */
    getApplicationDirectory() {
        return path.join(require('os').homedir(), 'cwa');
    }

    /**
     * Save the provided data into an image file.
     *
     * @param {string} data The base64 representation of the image.
     * @return {Promise<{storage: string, filename: string, file: string},NodeJS.ErrnoException>}
     */
    saveScreenshot(data) {
        return new Promise((resolve, reject) => {
            const directory = this.getApplicationDirectory();
            const storage   = path.join(directory, 'screenshots');
            const filename  = this.createFilename('screenshot', 'png');

            if (!fs.existsSync(storage)) {
                fs.mkdirSync(storage, {recursive: true});
            }

            const file = path.join(storage, filename);

            fs.writeFile(file, data, 'base64', function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        storage,
                        filename,
                        file,
                    });
                }
            });
        });
    }

    /**
     * Save the provided ArrayBuffer into a video file.
     *
     * TODO: Find a way to open the file and continuously write to it, instead of keeping everything into memory.
     *
     * @param {ArrayBuffer} data The raw data representation of the video.
     * @return {Promise<{storage: string, filename: string, file: string},NodeJS.ErrnoException>}
     */
    saveRecording(data) {
        return new Promise((resolve, reject) => {
            const directory = this.getApplicationDirectory();
            const storage   = path.join(directory, 'recordings');
            const filename  = this.createFilename('recording', 'webm');

            if (!fs.existsSync(storage)) {
                fs.mkdirSync(storage, {recursive: true});
            }
            const file   = path.join(storage, filename);
            const buffer = Buffer.from(data);

            console.log('[DISK]', `Writing to file ${file}...`);
            fs.writeFile(file, buffer, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        storage,
                        filename,
                        file,
                    });
                }
            });
        });
    }
}

module.exports = new Disk();
