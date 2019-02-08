require('dotenv').config()

// import all of our models 
const models = require('./models');

// make sure we are runing node 7.6+
const [major, minor] = process.versions.node.split('.').map(parseFloat);
if (major < 7 || (major === 7 && minor <= 5)) {
  console.log("You\'re on an older version of node that doesn\'t support the latest and greatest things we are learning (Async + Await)! Please go to nodejs.org and download version 7.6 or greater. 👌\n")
  process.exit();
}

// require('dotenv').config({ path: 'variables.env' });


// console.log(process.env);
console.log(process.env.FORCE == false); 
console.log(process.env.FORCE); 

models.sequelize.sync({ force: process.env.FORCE }).then(function () { // change force to true to rebuild db 
  console.log("\x1b[33m%s\x1b[0m", 'Nice! Database looks fine')
}).catch(function (err) {
  console.log(err)
  console.log("\x1b[41m", 'Something went wrong with the database')
});

// require('./seeders/sample_report_create'); 

// Start our app!
const app = require('./app');
app.set('port', process.env.PORT || 7777);

const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});



