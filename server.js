const express = require('express');
const app = express();
const crypto = require('crypto');
const path = require('path');
const bodyParser = require('body-parser');
const port = 80;
const fs = require('fs');
const cookieParser = require('cookie-parser');
const session = require('express-session');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: '5ed25af7b1ed23fb00122e13d7f74c4d8262acd8',
  resave: false,
  saveUninitialized: true,
}));

app.get('/', (req, res) => {
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

app.post('/contact_me', (req, res) => {



  appendToFile('msg.json', req.body);
  res.redirect('/');
})

function hash(inputString) {
  const hash = crypto.createHash('sha1');
  hash.update(inputString);
  return hash.digest('hex');
}


app.get('/admin', (req, res) => {
  password = req.query.password;
  if (password == undefined) {
    password = 'a';
  }
  if (hash(password) === '5ed25af7b1ed23fb00122e13d7f74c4d8262acd8') {
    const filePath = path.join(__dirname, "admin.html");
    req.session.admin = 'true';
    res.sendFile(filePath);
  } else {
    req.session.admin = 'false';

    res.redirect("/")

  }
});

app.get('/newarticle', (req, res) => {

  if (req.session.admin === "true") {
    const filePath = path.join(__dirname, "new_article.html");
    res.sendFile(filePath);
  } else {
    res.redirect("/")

  }
});


function appendToFile(fileName, jsonObj) {
  try {
    // Load the current content of the file if it exists
    const existingData = JSON.parse(fs.readFileSync(fileName));

    existingData.reverse();

    // Append the new JSON object to the array
    existingData.push(jsonObj);

    existingData.reverse();
    // Convert the updated array to JSON format
    const updatedDataJSON = JSON.stringify(existingData, null, 2);

    // Write the updated JSON data to the file
    fs.writeFileSync(fileName, updatedDataJSON);

    console.log('Data successfully appended to the file.');
  } catch (err) {
    // In case of an error while reading the file, continue with an empty array.
    console.error('Error appending data to the file:', err);
  }
}

app.post("/new_article", (req, res) => {
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
    appendToFile("data.json", json)
    res.redirect("/")
  }
})

app.get("/data", (req, res) => {
  const data = JSON.parse(fs.readFileSync("data.json"));
  res.json(data);
})

app.get("/article/:id", (req, res) => {
  const articleId = req.params.id;

  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) {
      console.error("Erreur de lecture du fichier de données :", err);
      res.status(500).send("Erreur interne du serveur");
      return;
    }
    const jsonData = JSON.parse(data);
    const article = jsonData.find(entry => entry.id == articleId);
    if (!article) {
      res.redirect("/?file=page_not_found.html");
      return;
    }
    const formattedText = article.text.map(element => `\`${element}\``);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <link rel="stylesheet" href="/?file=style.css">
      </head>
      <body>
          <nav>
              <ul class="navbar">
                  <li class="nav-item"><a href="/?file=main.html">Home</a></li>
                  <li class="nav-item"><a href="/?file=articles.html">Articles</a></li>
                  <li class="nav-item"><a href="/?file=about_me.html">About me</a></li>
                  <li class="nav-item"><a href="/?file=contact_me.html">Contact me</a></li>
              </ul>
          </nav>
          <main class="main">
              <h1>${article.title}</h1>
              <h2>By CoCo Sol</h2> <br>
              <pre><b><u>${article.intro}</u></b><br></pre>
              <div class="text-content"></div>
              <script>
                  // Sélection de l'élément où insérer le texte formaté
                  const textContainer = document.querySelector(".text-content");
                  const textData = [${formattedText}];

                  for (let i = 0; i < textData.length; i++) {
                      const title = textData[i];
                      const txt = textData[i + 1];
                      const paragraph = document.createElement("p");
                      paragraph.classList.add("article");
                      const titleElement = document.createElement("h3");
                      titleElement.textContent = title;
                      const textElement = document.createElement("pre");
                      textElement.textContent = txt;
                      paragraph.appendChild(titleElement);
                      paragraph.appendChild(textElement);
                      textContainer.appendChild(paragraph);
                      i++; // Pour passer au prochain élément
                  }
              </script>
          </main>
      </body>
      </html>
    `;

    res.send(htmlContent);
  });
});



app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port} on ip: 0.0.0.0`);
});