// routes.js
const express = require('express');
const router = express.Router();
const path = require('path');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const session = require('express-session');


router.use(bodyParser.urlencoded({ extended: true }));
router.use(cookieParser());
router.use(session({
  secret: '5ed25af7b1ed23fb00122e13d7f74c4d8262acd8',
  resave: false,
  saveUninitialized: true,
}));

function hash(inputString) {
    if (inputString == undefined) {
        inputString = 'a';
    }
    const hash = crypto.createHash('sha1');
    hash.update(inputString);
    return hash.digest('hex');
}
 
router.get('/add-article', (req, res) => {
    if (req.session.admin === "true") {
      const filePath = path.join(__dirname, "admin/new_article.html");
      res.sendFile(filePath);
    } else {
      res.redirect("/")
  
    }
  });


router.get('/remove-msg/:id', (req, res) => {
  const articleId = req.params.id;
  if (req.session.admin === "true") {


  fs.readFile('routes/data/msg.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Erreur de lecture du fichier de données :', err);
      res.status(500).send('Erreur interne du serveur');
      return;
    }
    const jsonData = JSON.parse(data);

    // Recherche de l'index de l'article à supprimer
    const articleIndex = jsonData.findIndex(entry => entry.id == articleId);

    if (articleIndex === -1) {
      res.redirect('/?file=page_not_found.html');
      return;
    }

    // Suppression de l'article du tableau jsonData
    jsonData.splice(articleIndex, 1);

    // Écriture des données mises à jour dans le fichier
    fs.writeFile('routes/data/msg.json', JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error('Erreur lors de l\'écriture des données dans le fichier :', err);
        res.status(500).send('Erreur interne du serveur');
      } else {
        res.send('Article supprimé avec succès');
      }
    });
  })};
})

router.get("/check-messages", (req,res)=>{
    if (req.session.admin === "true") {
      const filePath = path.join(__dirname, "admin/check_msg.html");
      res.sendFile(filePath);
    } else {
      res.redirect("/")
  
    }
  });

router.get("/msg-data", (req,res)=>{
    if (req.session.admin === "true") {
      const data = JSON.parse(fs.readFileSync("routes/data/msg.json"));
      res.json(data);
    } else {
      res.redirect("/")
  
    }
});

router.post("/new_article", (req, res) => {
    if (req.session.admin === "true") {
      const title = req.body.articleTitle;
      const intro = req.body.introContent;
      const text = req.body.articleSection;
      const id = Date.now();
      const json = {
        "title": title,
        "intro": intro,
        "text": text,
        "id": id,
      }
      appendToFile("routes/data/data.json", json)
      res.redirect("/admin")
    }
    else {
      res.redirect("/")
    }
  })

router.get('/login/:password', (req, res) => {

        password = req.params.password;
        if (hash(password) === '5ed25af7b1ed23fb00122e13d7f74c4d8262acd8') {
          req.session.admin = 'true';
          res.redirect("/admin")

        } else {
          req.session.admin = 'false';
          res.redirect("/")
      
        }
      });

router.get("/", (req, res)=>{
    if (req.session.admin === "true") {
        const filePath = path.join(__dirname, "admin/admin.html");
        res.sendFile(filePath);
    } else {
        res.redirect("/")
    }
})

// Exportez le router pour l'utiliser dans d'autres fichiers
module.exports = router;


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