const fs = require("node:fs/promises");

(async () => {
	const fileHandleRead = await fs.open("src.txt", "r");
	const fileHandleWrite = await fs.open("dest.txt", "w");

	const streamRead = fileHandleRead.createReadStream({ highWaterMark: 64 * 1024 });
	const streamWrite = fileHandleWrite.createWriteStream();

	console.time("pipe");

	// stream.on("data", (chunk) => {
	// 	console.log(`Received ${chunk.length} bytes of data.`);
	// });

	streamRead.on("data", (chunk) => {
		if (!streamWrite.write(chunk)) {
			streamRead.pause();
		}
	});

	streamWrite.on("drain", () => {
		// console.log("-----------------------------");
		// console.log("Drain event, resuming read stream");
		streamRead.resume();
	});

	streamRead.on("end", async () => {
		console.log("Finished reading the file. Closing file handles.");
		await fileHandleRead.close();
		streamWrite.end();
	});

	streamWrite.on("finish", () => {
		console.log("Finished writing to the file. Closing write file handle.");
		console.timeEnd("pipe");
		fileHandleWrite.close();
	});
})();
