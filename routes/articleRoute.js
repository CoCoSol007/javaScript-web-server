// routes.js
const express = require('express');
const router = express.Router();
const fs = require('fs');



router.get("/:id", (req, res) => {
  const articleId = req.params.id;

  fs.readFile("routes/data/data.json", "utf8", (err, data) => {
    if (err) {
      console.error("Erreur de lecture du fichier de données :", err);
      res.status(500).send("Erreur interne du serveur");
      return;
    }
    const jsonData = JSON.parse(data);
    const article = jsonData.find(entry => entry.id == articleId);
    if (article == undefined) {
      res.redirect("/?file=page_not_found.html");
      return;
    }
    if (article.text === undefined) {
      article.text = [""]
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
                  <li class="nav-item"><a href="/?file=photo.html">Photo</a></li>
                  <li class="nav-item"><a href="/?file=about_me.html">About me</a></li>
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
            <div class="sponsor">
            <a href="https://www.digitalocean.com/?refcode=6d089c7c6c04&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge"><img src="https://web-platforms.sfo2.cdn.digitaloceanspaces.com/WWW/Badge%201.svg" alt="DigitalOcean Referral Badge" /></a>
            </div>
        </body>
        </html>
      `;

    res.send(htmlContent);
  });
});

// Exportez le router pour l'utiliser dans d'autres fichiers
module.exports = router;
