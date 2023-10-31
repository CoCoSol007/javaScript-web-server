// routes.js
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');



router.get('/', (req, res) => {
    paramValue = req.query.file;
    const filePath = path.join(__dirname, 'images', paramValue);

    // Check if the file exists
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.sendFile(path.join(__dirname, 'images', 'image_not_found.png'));
    }
});

// Exportez le router pour l'utiliser dans d'autres fichiers
module.exports = router;
