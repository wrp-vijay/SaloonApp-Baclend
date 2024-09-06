const express = require('express');
const bodyParser  = require('body-parser');
const session = require('express-session');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('./src/helper/logger');
require('dotenv').config();
const db = require('./src/models')
const authRoute = require('./src/routes/auth')
const ownerRoute = require('./src/routes/owner')
const saloonRoute = require('./src/routes/saloon')
const saloonRattingRoute = require('./src/routes/saloonRatting')
const barberRoute = require('./src/routes/barber')
const barberRatingRoute = require('./src/routes/barberrating')

const app = express();
app.use(session({
    secret: '4da07d05795b4bfe5f212032d91361ac39e8ea0e3cfb45cf491890ecef3253ddfb914aa34532e508e60228cbfa8db2057ce501e55594caa6982ecc7ca7c10dcd', // Replace with your own secret key
    resave: false,
    saveUninitialized: true
}));

app.use(helmet());
app.use(bodyParser.json());

app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Setup rate limiting
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, 
//     max: 10 
// });
// app.use(limiter);

const PORT = process.env.PORT || 3000;

app.use("/", authRoute);
app.use("/", ownerRoute);
app.use("/", saloonRoute);
app.use("/", saloonRattingRoute);
app.use("/", barberRoute);  
app.use("/", barberRatingRoute);

app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send('Something broke!');
});

app.get("/", (req,res) =>{
    res.send("hello")
}) 

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`server started at port ${PORT}`);
    })
})


