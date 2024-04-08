const fs = require("fs");
const pdf = require("pdf-parse");
const env = process.env.NODE_ENV || "development";
const config = require("../config/credentials.json")[env];
const axios = require("axios");
const { PDFDocument, PDFDocumentWriter, drawText } = require("pdf-lib");
const natural = require("natural");
const wordnet = new natural.WordNet();

function countOccurrences(text, word) {
	const regex = new RegExp("\\b" + word + "\\b", "gi");
	return (text.match(regex) || []).length;
}

async function countWordsOccurrences(filePath, wordsToCount) {
	try {
		const occurrencesMap = {};
		const pdfData = fs.readFileSync(filePath);

		const pdfResult = await pdf(pdfData, {
			pagerender: {
				normalizeWhitespace: false,
				disableCombineTextItems: false,
			},
		});

		const textContent = pdfResult.text;
		wordsToCount.forEach((word) => {
			const count = countOccurrences(textContent.toLowerCase(), word.toLowerCase());
			occurrencesMap[word.toLowerCase()] = (occurrencesMap[word.toLowerCase()] || 0) + count;
		});
		return occurrencesMap;
	} catch (err) {
		throw new Error("Error while counting --> " + err.message);
	}
}
async function countWordsUniqueOccurrences(filePath) {
	try {
		const occurrencesMap = {};
		const pdfData = fs.readFileSync(filePath);

		const pdfResult = await pdf(pdfData, {
			pagerender: {
				normalizeWhitespace: false,
				disableCombineTextItems: false,
			},
		});

		const textContent = pdfResult.text;
		const wordsToCount = textContent.toLowerCase().match(/\b\w+\b/g) || [];
		wordsToCount.forEach((word) => {
			const count = occurrencesMap[word.toLowerCase()] ? (occurrencesMap[word.toLowerCase()] || 0) + 1 : 1;
			occurrencesMap[word.toLowerCase()] = (occurrencesMap[word.toLowerCase()] || 0) + count;
		});
		let sum = 0;
		Object.values(occurrencesMap).forEach((ele) => {
			sum = sum + ele;
		});
		return { occurrencesMap, uniqueWordCount: sum };
	} catch (err) {
		throw new Error("Error while counting --> " + err.message);
	}
}

async function fetchSynonyms(word) {
	try {
		const response = await axios.get(config.Yandex.url, {
			params: {
				key: config.Yandex.apiKey,
				lang: "en-en",
				text: word,
			},
		});

		if (response.data.def.length === 0 || !response.data.def[0].tr) return [];
		return response.data.def[0].tr.map((item) => item.text);
	} catch (err) {
		throw new Error("Error fetching synonyms --> " + err.message);
	}
}

async function maskPDF(filePath, wordsToMask) {
	try {
		const pdfData = fs.readFileSync(filePath);

		const pdfResult = await pdf(pdfData, {
			pagerender: {
				normalizeWhitespace: false,
				disableCombineTextItems: false,
			},
		});
		let textContent = pdfResult.text;
		wordsToMask.forEach((word) => {
			const regex = new RegExp(`\\b${word}\\b`, "gi");
      textContent = textContent.replace(regex, "*****");
		});
		const pdfDoc = await PDFDocument.create();

    let page = pdfDoc.addPage();
		const sanitizedTextContent = textContent.replace(/[^\x20-\x7E]/g, ''); 

    page.drawText(sanitizedTextContent, {
        x: 50, 
        y: 500, 
        size: 12,
    });
		const pdfBytes = await pdfDoc.save();
		return pdfBytes;
	} catch (err) {
		throw new Error("Error while masking --> " + err.message);
	}
}

module.exports = {
	countWordsOccurrences,
	fetchSynonyms,
	countWordsUniqueOccurrences,
	maskPDF,
};
