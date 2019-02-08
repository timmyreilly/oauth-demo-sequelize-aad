const express = require('express');

const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const passport = require('passport');

const path = require('path');
const promisify = require('es6-promisify');
const flash = require('connect-flash');
const expressValidator = require('express-validator');
const routes = require('./routes/index');
const helpers = require('./helpers');
const errorHandlers = require('./handlers/errorHandlers');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('./models');

require('./handlers/passport')(passport);


// create our Express app 
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// use helmet: https://expressjs.com/en/advanced/best-practice-security.html 
app.use(helmet());

app.use(expressValidator());

// populates req.cookies with any cookies that came along with the request
app.use(cookieParser());

// sessions allow us to store data on visitors from request to request.
// this keeps users logged in and allows us to send flash messages
// use scalable session store: https://expressjs.com/en/advanced/best-practice-security.html  
app.use(session({
    secret: process.env.SECRET,
    name: process.env.KEY_NAME,
    store: new SequelizeStore({
        db: db.sequelize,
        expiration: 5 * 60 * 10000,
        checkExpirationInterval: 3 * 60 * 10000
    }),
    resave: false,
}))

app.use(methodOverride());

// Passport JS is what we use to handle our logins. 
app.use(passport.initialize());
app.use(passport.session());

// The flash middleware let's us user req.flash('error', 'mistake made'), which will then pass to the next page the user requests 
app.use(flash());

// pass variables to our templates + all requests
app.use((req, res, next) => {
    res.locals.h = helpers;
    res.locals.flashes = req.flash();
    res.locals.user = req.user || null;
    res.locals.currentPath = req.path;
    next();
});

// promisify some callback based APIs
app.use((req, res, next) => {
    req.login = promisify(req.login, req);
    next();
})

// ALL DONE WITH MIDDLEWARE

// Quick middleware demo and place to catch reqs when totally confused: 
// app.use((req, res, next) => {
//     console.log("before we begin"); 
//     console.log(req); 
//     next(); 
// })

// our routes: 
app.use('/', routes);

// if that above routes didn't work, we 404 them and forward to the error handler 
app.use(errorHandlers.notFound);

// one of our error handlers will see if these errors are just validation errors: 
app.use(errorHandlers.flashValidationErrors);

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get('env') === 'development') {
    /* Development Error Handler - Prints stack trace */
    app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

// done! we export it so we can start the site in start.js
module.exports = app;
