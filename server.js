const express = require('express');
const path = require('path');

const app = express();

app.use(express.static('./dist/gutenberg-ui'))

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, './dist/gutenberg-ui/index.html'));
});

app.listen(process.env.PORT || 8080);