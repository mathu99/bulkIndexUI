const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const proxyUrl = "http://Matthew.Mills:Jambo.16@03rnb-isa01.za.ds.naspers.com:8080";
const request = require('request').defaults({ 'proxy': proxyUrl });

const app = express();
app.use(express.static(__dirname));

app.use(bodyParser.json()); // support json encoded bodies
// app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var config = require('./config');

app.get('/', (req, res) => {  // the "index" route, which serves the Angular app
    res.sendFile(path.join(__dirname, '/dist/index.html'))
});

app.get('/api/countries/', (req, res) => {
    res.send(config.countries);
});

app.get('/api/config/:key', (req, res) => {
    var options = {
        url: `${config.esb}config/${req.params.key}`,
        json: true,
        headers: {
            Accept: 'application/json'
        }
    }
    request(options, (request, respond, body) => {
        res.send(body);
    })
});

app.get('/api/batTest/', (req, res) => {
    let child_process = require('child_process');
    child_process.exec('run.bat', (error, stdout, stderr) => {
        console.log(stdout);
    });
});

// HTTP listener
app.listen(3000, () => {
    console.log('Example listening on port 3000!');
});
module.exports = app;