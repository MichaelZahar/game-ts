'use strict';

let express = require('express');
let path = require('path');
let app = express();

app.use(express.static(path.resolve(__dirname, '../client')));

app.listen(3000, () => console.log('Static server is running on http://127.0.0.1:3000'));
