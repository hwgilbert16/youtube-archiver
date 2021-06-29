const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const save = require('./routes/save');
const search = require('./routes/search');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

//set static files directory
app.use(express.static('public'))
app.set('view engine', 'pug');

app.use('/save', save);
app.use('/search', search);

// render root page
app.get('/', (req, res) => {
    res.render('index');
});

app.listen(3000);