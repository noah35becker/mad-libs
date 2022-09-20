
// IMPORTS

const express = require('express');
    const app = express();

require('dotenv').config();

const handlebarsHelpers = require('./utils/handlebars-helpers');

const exphbs = require('express-handlebars');
    const hbs = exphbs.create({helpers: handlebarsHelpers});

const sequelize = require('./config/connection');

const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const path = require('path');

const routes = require('./controllers');

const PORT = process.env.PORT || 3001;

const {SESSION_TIMEOUT} = require('./utils/general-helpers');



// MIDDLEWARE

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.urlencoded({extended: true}));
app.use(express.json());

const sess = {
    secret: process.env.SESSION_SECRET,
    cookie: {maxAge: SESSION_TIMEOUT}, // Login session expires after sessionTimeout ms...
    rolling: true, // ...for which the timer resets each time a page load/reload occurs
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};
app.use(session(sess));

app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);



// CONNECT TO SERVER
sequelize.sync({force: false}).then(() => 
    app.listen(PORT, () => console.log(`Now listening on Port ${PORT}`))
);