// routes.js
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');



router.get('/', (req, res) => {
  paramValue = req.query.file;
  if (paramValue == undefined) {
    paramValue = "main.html";
  }
  const filePath = path.join(__dirname, 'webpage', paramValue);

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    res.sendFile(path.join(__dirname, 'webpage', 'page_not_found.html'));
  } else {
    res.sendFile(filePath);
  }
});

// Exportez le router pour l'utiliser dans d'autres fichiers
module.exports = router;
