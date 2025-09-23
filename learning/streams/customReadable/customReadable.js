const { Readable } = require("stream");
const fs = require("fs");

class ReadStream extends Readable {
	constructor({ highWaterMark, fileName }) {
		super({ highWaterMark });
		this.fileName = fileName;
		this.fd = null;
		this.position = 0;
	}

	_construct(callback) {
		fs.open(this.fileName, "r", (err, fd) => {
			if (err) {
				return callback(err);
			}
			this.fd = fd;
			callback();
		});
	}

	_read(size) {
		const buffer = Buffer.alloc(size);
		fs.read(this.fd, buffer, 0, size, null, (err, bytesRead) => {
			if (err) {
				this.destroy(err);
				return;
			}
			this.push(bytesRead > 0 ? buffer.subarray(0, bytesRead) : null);
		});
    }
    
    _destroy(err, callback) {
        if (this.fd) {
            fs.close(this.fd, (closeErr) => {
               callback(closeErr || err);
            });
        }
        else callback(err);
    }
}
