const express = require('express');
const app = express();

app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.send('<form action="/" method="post"><input type="text" name="username"><input type="submit"></form>');
});

app.listen(3000);