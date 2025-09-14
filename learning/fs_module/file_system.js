const filehandler = require("node:fs/promises");

async function copyfilePromise() {
	try {
		await filehandler.copyFile("file.txt", "copied-promise.txt");
	} catch (error) {
		console.error(error);
	}
}

copyfilePromise();
