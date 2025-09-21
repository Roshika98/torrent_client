const fs = require("node:fs/promises");
const { pipeline } = require("stream");

// (async () => {
//     const destFile = await fs.open("dest.txt", "w");
//     const result=await fs.readFile("src.txt");
// })();

// (async () => {
// 	const srcFile = await fs.open("src.txt", "r");
// 	const destFile = await fs.open("dest.txt", "w");

// 	let bytesRead = 1;
// 	let lastIndex = 0;
// 	while (bytesRead > 0) {
// 		const readResult = await srcFile.read({ position: lastIndex, offset: 0 });
// 		bytesRead = readResult.bytesRead;

// 		if (bytesRead) {
//             if (bytesRead !== 16384) {

// 			} else await destFile.write(readResult.buffer, { offset: 0, position: lastIndex + 1 });
// 		}
// 		lastIndex += bytesRead;
// 	}
// })();

// (async () => {
// 	const srcFile = await fs.open("src.txt", "r");
// 	const destFile = await fs.open("dest.txt", "w");

// 	const readStream = srcFile.createReadStream();
// 	const writeStream = destFile.createWriteStream();

// 	readStream.pipe(writeStream);
// })();

(async () => {
	const srcFile = await fs.open("src.txt", "r");
	const destFile = await fs.open("dest.txt", "w");

	const readStream = srcFile.createReadStream();
	const writeStream = destFile.createWriteStream();

	pipeline(readStream, writeStream, (err) => {
		if (err) {
			console.error("Pipeline failed", err);
		} else {
			console.log("Pipeline succeeded");
		}
		console.log("Closing file handles");
	});
})();
