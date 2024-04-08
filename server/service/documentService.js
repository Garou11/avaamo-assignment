const { user_documents } = require("../models");

async function getExistingFiles(userID) {
	try {
		const userDocuments = await user_documents.findAll({
			where: {
				userid: userID,
				isactive: true
			},
			raw: true
		});
		return userDocuments;
	} catch (err) {
		throw new Error("Error while fetching existing documents --> " + err.message);
	}
}



async function createDocumentEntry(userId, data) {
	try {
		const entry = await user_documents.findOne({
			where: {
				userid: userId,
				filename: data.filename,
				isactive: true
			},
			raw: true
		});
		if (entry) {
			const updateEntry = await user_documents.update({
				isactive: false
			}, {
				where: {
					id: entry.id
				}
			});
		}
		const createDocEntry = await user_documents.create({
			userid: userId,
			size: parseInt(data.size),
			filename: data.filename,
			isactive: true
		});
		return { id: createDocEntry.docid, name: data.filename};

	} catch (err) {
		throw new Error("Error while adding entry --> " + err.message);
	}
}

module.exports = {
	getExistingFiles,
	createDocumentEntry
}