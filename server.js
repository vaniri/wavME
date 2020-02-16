const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const path = require("path");

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded());

app.use(require('./routes/htmlRoutes'));
app.use(require('./routes/api/index'));

app.use(express.static(path.join(__dirname, 'public')));

app.listen(process.env.PORT || PORT, () => {
  console.log(`server running on ${process.env.PORT || PORT}`);
});