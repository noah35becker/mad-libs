
const isLoggedInApiAuth = (req, res, next) => {
    if (req.session.loggedIn)
        next();
    else
        res.redirect(401, '/login');
};


const isLoggedInUrlAuth = (req, res, next) => {
    if (req.session.loggedIn)
        next();
    else
        res.status(401).redirect('/login');
};


const isLoggedOutApiAuth = (req, res, next) => {
    if (!req.session.loggedIn)
        next();
    else
        res.redirect(403, '/');
};


const isLoggedOutUrlAuth = (req, res, next) => {
    if (!req.session.loggedIn)
        next();
    else
        res.status(403).redirect('/dashboard');
};


module.exports = {
    isLoggedInApiAuth,
    isLoggedInUrlAuth,
    isLoggedOutApiAuth,
    isLoggedOutUrlAuth
};