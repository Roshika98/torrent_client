const filehandler = require("fs/promises");
const { Buffer } = require("buffer");

(async () => {
	const commandfile = await filehandler.open("./command.txt", "r");

	const watcher = filehandler.watch("./command.txt");

	for await (const event of watcher) {
		if (event.eventType === "change") {
			console.log("file was changed");

			const filesize = await commandfile.stat();

			const offset = 0;
			const length = filesize.size;
			const position = 0;

			const content = await commandfile.read({
				buffer: Buffer.alloc(filesize.size),
				length: length,
				position: position,
				offset: offset,
			});

			const fileContent = content.buffer.toString("utf-8");

			// create a file:
			if (fileContent.includes("create a file")) {
				const path = fileContent.substring("create a file " + 1);
				try {
					const existingFile = await filehandler.open(path, "r");
				} catch (error) {
					const newfile = await filehandler.open(`${path}.txt`, "w");
				}
			}

			// delete a file:
			if (fileContent.includes("delete a file")) {
				const path = fileContent.split(":")[1].trim();
				try {
					const existingFile = await filehandler.open(path, "r");
					await existingFile.close();
					await filehandler.unlink(path);
				} catch (error) {
					console.log("file does not exist");
				}
			}

			//  rename a file:
			if (fileContent.includes("rename a file")) {
				const paths = fileContent.split(":")[1].trim().split(" to ");
				const originalPath = paths[0];
				const newPath = paths[1];

				try {
					const original = await filehandler.open(originalPath, "r");
					await original.close();

					await filehandler.rename(originalPath, newPath);
				} catch (error) {
					console.log("file does not exist");
				}
			}
		}

		if (event.eventType === "rename") {
		}
	}
})();
