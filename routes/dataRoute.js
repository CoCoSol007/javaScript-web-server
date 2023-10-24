// routes.js
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const cookieParser = require('cookie-parser');
const session = require('express-session');


const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));


router.get('/:name', (req, res) => {
  param = req.params.name;
  if (param === "msg") {
    const data = JSON.parse(fs.readFileSync("routes/data/msg.json"));
    res.json(data);
  } else {
    const data = JSON.parse(fs.readFileSync("routes/data/data.json"));
    res.json(data);
    }
});


function appendToFile(fileName, jsonObj) {
    try {
      const existingData = JSON.parse(fs.readFileSync(fileName));
  
      existingData.reverse();
  
      existingData.push(jsonObj);
  
      existingData.reverse();
      const updatedDataJSON = JSON.stringify(existingData, null, 2);
  
      fs.writeFileSync(fileName, updatedDataJSON);
  
    } catch (err) {
      console.error('Error appending data to the file:', err);
    }
  }

router.post('/send-msg', (req, res) => {
    data = req.body
    console.log(req.body)
    data.id = Date.now()
    appendToFile('routes/data/msg.json', data);
    res.redirect('/');
})

// Exportez le router pour l'utiliser dans d'autres fichiers
module.exports = router;
