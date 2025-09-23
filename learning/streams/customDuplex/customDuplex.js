const { Duplex } = require("stream");
const fs = require("fs");

class DuplexStream extends Duplex {
	constructor({ highWaterMark, fileName }) {
		super({ highWaterMark });
		this.fileName = fileName;
		this.fd = null;
		this.position = 0;
	}

	_construct(callback) {
		fs.open(this.fileName, "r+", (err, fd) => {
			if (err) {
				return callback(err);
			}
			this.fd = fd;
			callback();
		});
	}

	_write() {}

	_read() {}
}
