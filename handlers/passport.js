var OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const config = require('../config/keys');
const finduser = require('./findUser')
const db = require('../models');

var users = [];

module.exports = (passport) => {

  passport.serializeUser((user, done) => {
    done(null, user.oid);
  });

  passport.deserializeUser((oid, done) => {
    finduser.findByOid(oid, function (err, user) {
      done(err, user);
    });
  });

  passport.use(
    new OIDCStrategy({
      identityMetadata: config.creds.identityMetadata,
      clientID: config.creds.clientID,
      responseType: config.creds.responseType,
      responseMode: config.creds.responseMode,
      redirectUrl: config.creds.redirectUrl,
      allowHttpForRedirectUrl: config.creds.allowHttpForRedirectUrl,
      clientSecret: config.creds.clientSecret,
      validateIssuer: config.creds.validateIssuer,
      isB2C: config.creds.isB2C,
      issuer: config.creds.issuer,
      passReqToCallback: config.creds.passReqToCallback,
      scope: config.creds.scope,
      loggingLevel: config.creds.loggingLevel,
      loggingNoPII: config.creds.loggingNoPII,
      nonceLifetime: config.creds.nonceLifetime,
      nonceMaxAmount: config.creds.nonceMaxAmount,
      useCookieInsteadOfSession: config.creds.useCookieInsteadOfSession,
      cookieEncryptionKeys: config.creds.cookieEncryptionKeys,
    },
      (req, iss, sub, profile, accessToken, refreshToken, done) => {

        if (!profile.oid) {
          return done(new Error('No oid found'), null)
        }

        // if you wanted to add them to your database during login: 

        // db.User.findOne({
        //   where: {
        //     OID: profile.oid
        //   }
        // }).then((user) => {
        //   if (user) {
        //     // TODO: check for updates of roles/user info
        //     console.log("\x1b[33m%s\x1b[0m", "WELCOME BACK")
        //   } else {
        //     let [firstName, lastName] = profile.displayName.split(' '); 

        //     return db.User.create({
        //       OID: profile.oid,
        //       Given_Name: firstName,
        //       Surname: lastName || 'NoLastName',  
        //     })
            
        //   }
        // }, (reason) => {
        //   console.log("\x1b[33m%s\x1b[0m", "SOMETHING HAPPENED")
        //   console.log(reason);
        // }).then(() => {
        //   for (i in profile._json.roles) {
        //     db.User_Role.create({
        //       Role_Name: profile._json.roles[i],
        //       serOID: profile.oid
        //     })
        //   }
        //   return
        // });

        // Still need to clean this up and have a better understanding of how we're interacting with the user object. 

        console.log("\x1b[33m%s\x1b[0m", ' - doing authentication routine in application')
        finduser.findByOid(profile.oid, (err, user) => {
          if (err) {
            return done(err)
          }
          if (!user) {
            console.log("\x1b[33m%s\x1b[0m", ' - user does not exist. writing new user info to state and session')
            let newUser = {}
            newUser.oid = profile.oid
            newUser.roles = profile._json.roles;
            newUser.displayName = profile.displayName;
            newUser.refreshToken = refreshToken;
            finduser.users.push(newUser)

            req.session.userid = profile.oid
            req.session.displayName = profile.displayName
            req.session.refreshToken = refreshToken
            req.session.roles = profile._json.roles;
            users.push(profile);

            return done(null, newUser)
          }
          console.log("\x1b[33m%s\x1b[0m", ' - user did exist in state but not in session, writing new session info')

          req.session.userid = user.oid
          req.session.displayName = user.displayName
          req.session.refreshToken = refreshToken
          req.session.roles = profile._json.roles;
          return done(null, user)
        })

      }
    )
  );

}