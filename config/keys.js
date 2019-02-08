// add this file to .gitignore

module.exports = {
    
    // The url you need to go to destroy the session with AAD
    // destroySessionUrl: 'https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=http://localhost:7777',
    destroySessionUrl: process.env.destroySessionUrl, 
    
    // If you want to use the mongoDB session store for session middleware, set to true; otherwise we will use the default
    // session store provided by express-session.
    // Note that the default session store is designed for development purpose only.
    useMongoDBSessionStore: false,

    // If you want to use mongoDB, provide the uri here for the database.
    //:tabaseUri = 'mongodb://localhost/OIDCStrategy',
    // databaseUri: 'mongodb://your-db:asdfuvUlDXzTUZLSxFrNcTI14SvyoWJEBetHAmQS2Ye9JQDohIPCGsJmoDhwqbGJ9ePAwMblA65qYBE0nyzF4Aow==@server-db.documents.azure.com:10255/?ssl=true&replicaSet=globaldb',

    // How long you want to keep session in mongoDB.
    // mongoDBSessionMaxAge: 24 * 60 * 60, // 1 day (unit is second,

    creds: {
        // identityMetadata: 'https://login.microsoftonline.com/microsoft.onmicrosoft.com/v2.0/.well-known/openid-configuration',
        identityMetadata: 'https://login.microsoftonline.com/microsoft.onmicrosoft.com/v2.0/.well-known/openid-configuration',
        
        // or equivalently: 'https://login.microsoftonline.com/<tenant_guid>/v2.0/.well-known/openid-configuration' 
        // 030gc
        // or you can use the common endpoint
        // 'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration'
        // To use the common endpoint, you have to either turn `validateIssuer` off, or provide the `issuer` value.

        // Required, the client ID of your app in AAD  
        // clientID: 'abc722bb-01e8-4430-90cb-539005ac6d29',
        // clientID: "abcebb46-aa78-409a-9372-5ae3a08c0f85",
        clientID: process.env.clientID,  

        // Required, must be 'code', 'code id_token', 'id_token code' or 'id_token'
        // If you want to get access_token, you must use 'code', 'code id_token' or 'id_token code' 
        // responseType: 'code id_token',
        responseType: 'code id_token', // this is only a login scenario. 

        // Required
        responseMode: 'form_post',

        // Required, the reply URL registered in AAD for your app
        // redirectUrl: 'http://localhost:3000/auth/openid/return',
        // redirectUrl: 'http://localhost:3000/auth/microsoft/redirect',
        // redirectUrl: 'http://localhost:7777/auth/openid/callback', 
        redirectUrl: process.env.redirectUrl, 

        // Required if we use http for redirectUrl
        allowHttpForRedirectUrl: true,

        // Required if `responseType` is 'code', 'id_token code' or 'code id_token'. 
        // If app key contains '\', replace it with '\\'.
        // clientSecret: 'gG{2@*=$zaVSNY]Yj+',
        // clientSecret: "abcyrYfducaLp9gBGxn8w1U251dQjVHCS+MVA24eylkss=", 
        clientSecret: process.env.clientSecret, 

        // Required to set to false if you don't want to validate issuer
        validateIssuer: false,

        // Required if you want to provide the issuer(s) you want to validate instead of using the issuer from metadata
        // issuer could be a string or an array of strings of the following form: 'https://sts.windows.net/<tenant_guid>/v2.0'
        issuer: null,

        // Required to set to true if the `verify` function has 'req' as the first parameter
        passReqToCallback: true,

        // Recommended to set to true. By default we save state in express session, if this option is set to true, then
        // we encrypt state and save it in cookie instead. This option together with { session: false } allows your app
        // to be completely express session free.
        useCookieInsteadOfSession: false,

        // Required if `useCookieInsteadOfSession` is set to true. You can provide multiple set of key/iv pairs for key
        // rollover purpose. We always use the first set of key/iv pair to encrypt cookie, but we will try every set of
        // key/iv pair to decrypt cookie. Key can be any string of length 32, and iv can be any string of length 12.
        // cookieEncryptionKeys: [
        //     { 'key': '12345678901234567890123456789013', 'iv': '123456789012' },
        //     { 'key': 'abcdefghijklmnopqrstuvwxyzabcdef', 'iv': 'abcdefghijkl' }
        // ],

        // The additional scopes we want besides 'openid'.
        // 'profile' scope is required, the rest scopes are optional.
        // (1) if you want to receive refresh_token, use 'offline_access' scope
        // (2) if you want to get access_token for graph api, use the graph api url like 'https://graph.microsoft.com/mail.read'
        // scope: ['profile', 'offline_access', 'https://graph.microsoft.com/mail.read'],
        scope: ['profile'],

        // Optional, 'error', 'warn' or 'info'
        loggingLevel: 'info',

        // If this is set to true, no personal information such as tokens and claims will be logged. The default value is true. 
        loggingNoPII: false, 

        // Optional. The lifetime of nonce in session or cookie, the default value is 3600 (seconds).
        nonceLifetime: null,

        // Optional. The max amount of nonce saved in session or cookie, the default value is 10.
        nonceMaxAmount: 5,

        // Optional. The clock skew allowed in token validation, the default value is 300 seconds.
        clockSkew: null,

    }
};
