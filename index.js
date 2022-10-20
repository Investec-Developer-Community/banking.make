const express = require('express');
const app = express();
const axios = require('axios');

const handlebars = require('express-handlebars');

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(express.json());


app.get('/', async (_req, _res) => _res.render('index.handlebars', {}))
app.use('/investec', require('./routes/investec'))
app.use('/something_cool', require('./routes/something_cool'));


// TODO upgrade this to catching on the controller level and returning a json error, rather than just timing out on the request side (but not breaking)
process.on('uncaughtException', function(err) {
  console.log(err)
})


app.listen(3000, () => { })
