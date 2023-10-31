const express = require('express');
const app = express();
const port = 80;
const path = require('path');




const mainRoute = require('./routes/mainRoute');
const dataRoute = require('./routes/dataRoute');
const articleRoute = require('./routes/articleRoute');
const adminRoute = require('./routes/adminRoute');
const imageRoute = require('./routes/imageRoute');


// Utilisez les routes en tant que middleware
app.use('/', mainRoute);
app.use('/admin', adminRoute)
app.use('/data', dataRoute);
app.use('/article', articleRoute);
app.use('/image', imageRoute);

app.use((req, res, next) => {
  res.redirect("/?file=page_not_found.html")
});


app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});