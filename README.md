# oauth-demo

To run this project: 
1. Make sure your working directory is inside oauth-demo
2. `npm install` 
3. add a `.env` file to the root of the project. ie: as a sibling to start.js and app.js. here's a sample: 
(You'll need to get the settings for redirect url, post logout, and clientID/secret from Azure Active Directory)
```
NODE_ENV=development
PORT=7777
SECRET=forlife
KEY_NAME=sweetsesh

redirectUrl=http://localhost:7777/auth/openid/callback
destroySessionUrl=https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=http://localhost:7777
clientID=d42ebb46-aa78-409a-9372-5ae3a08c0f85
clientSecret=jyrYfducaLp9gBGxn8w1U251dQjVHCS+MVA24eylkss=

dbusername=sqladmin
dbpassword=!Password4d4
host=sqlsrv.database.windows.net
db=tim-dev
```
4. `npm run start` will start as if we're running in production. This will synchronize our database and start our application.
5. In start.js there is an object passed to our `sequelize orm` to force a rebuild of our db: 
```JavaScript
models.sequelize.sync({ force: false }).then(function () { // change force to true to rebuild db 
```
6. Now visit http://localhost:7777 (or whatever port you've set in .env) to view our site. 


## Some things to be aware of. 

Using a signed session. 
We need to issue back a signed json token to the client. 
So they can't reverse engineer the session info. 

Sign server signed, from the token from passport, once a day we need to validate that the token you're using to sign is still a valid passport.
If that's valid and the signing of your token is valid. 
Depends on the risk model and threat model. 

"role based security with oauth node json web tokens" 

Mapping the AAD Role to a Scope. 
OAUTH - Scopes is what we should be looking for. 
OpenID Connect - Scopes - Shall live here. Properties on the JWT, libraries will utilize this. 
Take a look at AuthO - for express 


# Todo: 

Adding TLS to express: https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener 


### Reading List:

https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Azure-Active-Directory-now-with-Group-Claims-and-Application/ba-p/243862

https://tools.ietf.org/html/rfc6749 

JWT For AD: https://github.com/Azure-Samples/active-directory-dotnet-webapi-manual-jwt-validation 

References: 

https://github.com/AzureAD/passport-azure-ad 

### Team
[Heba Elayoty](https://github.com/helayoty)
[Sanjeev Dwivedi](https://github.com/sanjeevdwivedi)



