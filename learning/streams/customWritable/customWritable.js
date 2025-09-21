const { Writable } = require("stream");
const fs = require("fs");
const { Buffer } = require("buffer");

class WriteStream extends Writable {
	constructor({ highWaterMark, fileName }) {
		super({ highWaterMark });
		this.fileName = fileName;
		this.chunks = [];
		this.fd = null;
		this.chunkSize = 0;
	}

	// this will run after the constructor and it will put off all the other methods unitl it calls the callback
	_construct(callback) {
		fs.open(this.fileName, "w", (err, fd) => {
			if (err) {
				// if there is an error we pass it to the callback
				// this will emit an 'error' event on the stream
				callback(err);
				return;
			}
			this.fd = fd;
			// no arguments means everything is ok
			callback();
		});
	}

	_write(chunk, encoding, callback) {
		this.chunks.push(chunk);
		this.chunkSize += chunk.length;

		if (this.chunkSize >= this.writableHighWaterMark) {
			fs.write(this.fd, Buffer.concat(this.chunks, this.chunkSize), (err) => {
				if (err) {
					return callback(err);
				}
				callback();
			});
			this.chunks = [];
			this.chunkSize = 0;
		} else callback();
	}

	_final(callback) {
		fs.write(this.fd, Buffer.concat(this.chunks, this.chunkSize), (err) => {
			if (err) {
				return callback(err);
			}
			this.chunks = [];
			this.chunkSize = 0;
			callback();
		});
	}

	_destroy(err, callback) {
		if (this.fd) {
			fs.close(this.fd, (closeerr) => {
				callback(closeerr || err);
			});
		} else callback(err);
	}
}

const writeStream = new WriteStream({
	highWaterMark: 10,
	fileName: "customWritable.txt",
});
writeStream.write(Buffer.from("hello"));
writeStream.end(Buffer.from("world!"));
