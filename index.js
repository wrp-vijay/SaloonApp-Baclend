const express = require('express');
const svgCaptcha = require('svg-captcha');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const port = 8080;

app.use(express.json());
app.use(bodyParser.json());
app.use(session({
    secret: '1234567890',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // For development only; set to true in production with HTTPS
}));
app.use(express.static('public'));

app.get('/captcha', (req, res) => {
    const captcha = svgCaptcha.create();
    req.session.captcha = captcha.text;  // Store the captcha text in session for verification
    // console.log(captcha.data,"===");
    res.type('svg');
    res.status(200).send(captcha.data);
});

app.post('/verify-captcha', (req, res) => {
    const userCaptcha = req.body.captcha;
    if (userCaptcha === req.session.captcha) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
