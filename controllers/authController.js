const passport = require('passport');
const config = require('./../config/keys');

exports.authenticateAzure = () => {
    return (req, res, next) => {
        //   const concatUrl = params => {
        //     let string = ''
        //     Object.keys(params).forEach(e => {
        //       if (params[e]) string = `${string}/${params[e]}`
        //     })
        //     return string.toString()
        //   }
        //   req.session.redirectUrl = concatUrl(req.params)
        try {
            console.log("\x1b[33m%s\x1b[0m", ' - redirecting to Azure AD for authentication')
            passport.authenticate('azuread-openidconnect', {
                response: res,
                // resourceURL: 'b36e92f3-d48b-473d-8f69-e7887457bd3f', // ## Use if need accesstoken during login
                successRedirect: '/',
                failureRedirect: '/authError',
                successFlash: 'You are now logged in'
            })(req, res, next)
        } catch (err) {
            throw `ERROR during authentication: ${err}`
        }
    }
}

exports.authenticateAzureCallback = () => {
    return (req, res, next) => {
        console.log("\x1b[33m%s\x1b[0m", ' - got callback from Azure AD')
        try {
            passport.authenticate('azuread-openidconnect', {
                response: res,
                successRedirect: req.session.redirectUrl || '/account',
                failureRedirect: '/authError'
            })(req, res, next)
        } catch (err) {
            throw `ERROR during authentication: ${err}`
        }
        req.flash('success', 'you are now logged in'); 
    }
}

exports.logout = (req, res) => {
    return (req, res) => {
        console.log("\x1b[33m%s\x1b[0m", ' - logging out')
        req.flash('success', 'you have been logged out'); 
        req.session.destroy((err) => {
            req.logOut();
            res.redirect(config.destroySessionUrl);
        });
    }
}

exports.isLoggedIn = (req, res, next) => {
    // first check if the user is authenticated 
    if (req.isAuthenticated()) {
        console.log('authenticated'); 
        console.log(req.user); 
        next();
        return;
    } else {
        req.flash('error', 'You must be logged in');
        res.redirect('/');
    }
}

// a way to check user roles using middleware: 
exports.isFulfiller = (req, res, next) => {
    if (req.user.roles.indexOf('Fulfiller') > -1) {
        console.log("Fulfiller Authenticated"); 
        req.flash('success', '');
        return next(); 
    } else {
        console.log("Not an Fulfiller"); 
        res.redirect('/');
        return next(); 
    }
}

exports.loginError = (req, res, next) => {
    console.log('Not a User');
    req.flash('error', 'you cant handle the truth');  
    res.redirect('/'); 
}