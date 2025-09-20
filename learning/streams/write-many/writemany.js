const filehandler = require("fs/promises");
const filehandler2 = require("fs");

//  14.5 seconds

// (async () => {
// 	const file = await filehandler.open("test.txt", "w+");
// 	console.time("writeMany");
// 	for (let i = 0; i < 1000000; i++) {
// 		await file.write(`a\n`);
// 	}
// 	console.timeEnd("writeMany");
// 	await file.close();
// })();

// 2.5 seconds

// (async () => {
// 	console.time("writeMany2");
// 	filehandler2.open("test2.txt", "w+", (err, fd) => {
// 		for (let i = 0; i < 1000000; i++) {
// 			filehandler2.writeSync(fd, `a\n`);
// 		}
// 	});
// 	console.timeEnd("writeMany2");
// })();

// (async () => {
// 	console.time("writeMany3");
// 	const stream = filehandler2.createWriteStream("test3.txt", {
// 		flags: "w",
// 	});
// 	for (let i = 0; i < 1000000; i++) {
// 		const buff = Buffer.from(`a\n`, "utf-8");
// 		stream.write(buff);
// 	}
// 	console.timeEnd("writeMany3");
// 	stream.end(() => {});
// })();

(async () => {
	console.time("writeMany4");

	const filehandle = await filehandler.open("test4.txt", "w+");

	const stream = filehandle.createWriteStream();
	// console.log(stream.writableHighWaterMark);

	// stream.on("drain", () => {
	// 	console.log("Drain event");
	// });

	// const buff = Buffer.alloc(16383, 10);

	// stream.write(buff);
	// stream.write(Buffer.alloc(1, 'a'));
	// console.log(stream.writableLength);
	

	

	for (let i = 0; i < 1000000; i++) {
		const buff = Buffer.from(`a\n`, "utf-8");

		stream.write(buff);
	}

	stream.on("finish", () => {
		console.timeEnd("writeMany4");
		filehandle.close();
	})

	// filehandle.close();
})();
