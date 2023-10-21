const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const port = 80;
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// get web page  (http://localhost:3000/?name=FilePath)
app.get('/', (req, res) => {
  paramValue = req.query.file;
  if (paramValue == undefined ){
    paramValue = "main.html";
  } 
  const filePath = path.join(__dirname, 'webpage', paramValue );
  res.sendFile(filePath);
})


app.get('/admin', (req, res) => {
  const password = req.query.password; 

  if (password === 'coucou' ) { 
    const filePath = path.join(__dirname, "admin.html" );
    res.cookie("admin", true);
    res.sendFile(filePath);
  } else {
    res.cookie("admin", false);
    res.redirect("/")

  }
});

app.get('/newarticle', (req, res) => {
  
    if (req.cookies.admin === 'true' ) { 
      const filePath = path.join(__dirname, "new_article.html" );
      res.sendFile(filePath);
    } else {
      res.redirect("/")
  
    }
  });

app.post("/new_article", (req, res) =>{
    console.log(req.body)
})
  
app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur le port ${port} on ip: 0.0.0.0`);
});