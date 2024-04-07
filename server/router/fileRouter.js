const express = require('express');
const fileRouter = express.Router()
fileRouter.use(express.json())
const { getExistingFiles, createDocumentEntry } = require("../service/documentService");
const multer = require("multer");
const { fetchSynonyms, countWordsOccurrences, countWordsUniqueOccurrences } = require('../utils/textUtils');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } }).array('pdfFiles');

fileRouter.route('/getDocs').get(async (req, res) => {
  try {
    if (!req.query.userID) return res.status(400).json({ isSuccess: false, error: "User ID not provided" });
    const userDocData = await getExistingFiles(req.query.userID);
    return res.status(200).json({ isSuccess: true, data: userDocData });
  } catch (err) {
    return res.status(500).json({ isSuccess: false, error: "Failed To get user file status --> " + err.message });
  }
});

fileRouter.route('/upload').post(async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (!req.body.userID) return res.status(400).json({ isSuccess: false, error: "User ID not provided" });
      if (err) {
        throw new Error("Error uploading file. --> " + err.message);
      }
      const createDocData = await Promise.allSettled(req.files.map(async (file) => {
        return await createDocumentEntry(req.body.userID, file)
      }));
      const rejectedCount = createDocData.reduce((count, result) => {
        if (result.status === 'rejected') {
          return count + 1;
        }
        return count;
      }, 0);
      return res.status(200).json({ isSuccess: true, data: { rejectedCount: rejectedCount, fileInfo: createDocData } });
    });
  } catch (err) {
    return res.status(500).json({ isSuccess: false, error: "Failed To uplaod files --> " + err.message });
  }
});

fileRouter.post('/countWords', async (req, res) => {
  try {
    if (!req.body.userID) return res.status(400).json({ isSuccess: false, error: "User ID not provided" });
    if (!req.body.fileName || req.body.fileName.length === 0) return res.status(400).json({ isSuccess: false, error: "fileName not provided" });
    if (!req.body.word || req.body.word.length === 0) return res.status(400).json({ isSuccess: false, error: "word not provided" });

    const synonyms = req.body.findSynonyms? await fetchSynonyms(req.body.word): [];
    synonyms.push(req.body.word);
    const wordsOccurrences = await countWordsOccurrences(__dirname+'../../../uploads/'+req.body.fileName, synonyms);
    return res.status(200).json({ isSuccess: true, data: wordsOccurrences });
  } catch (err) {
    return res.status(500).json({ isSuccess: false, error: "Failed count word and the synonyms --> " + err.message });
  }
});

fileRouter.post('/countUniqueWords', async (req, res) => {
  try {
    if (!req.body.userID) return res.status(400).json({ isSuccess: false, error: "User ID not provided" });
    if (!req.body.fileName || req.body.fileName.length === 0) return res.status(400).json({ isSuccess: false, error: "fileName not provided" });
    if (!req.body.word || req.body.word.length === 0) return res.status(400).json({ isSuccess: false, error: "word not provided" });

    const wordsOccurrences = await countWordsUniqueOccurrences(__dirname+'../../../uploads/'+req.body.fileName);
    return res.status(200).json({ isSuccess: true, data: wordsOccurrences });
  } catch (err) {
    return res.status(500).json({ isSuccess: false, error: "Failed To get uniquewordCount --> " + err.message });
  }
});

module.exports = fileRouter;