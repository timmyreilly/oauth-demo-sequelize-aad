require('dotenv').config()

const db = require('./../models');

const sampleUser = {
    OID: '1234',
    Given_Name: 'Timbo Reilly',
    Surname: "Reilly is my last name",
    roles: ['Fulfiller']
}

db.sequelize.sync({ force: false }).then(function () { // change force to true to rebuild db 
    console.log("\x1b[33m%s\x1b[0m", 'Nice! Database looks fine')
}).catch(function (err) {
    console.log(err)
    console.log("\x1b[41m", 'Something went wrong with the database')
}).then(function (result) {
    console.log(db.User);
    return db.User.create(
        sampleUser
    )
}).then(function (result) {
    for (i in sampleUser.roles) {
        db.User_Role.create({
            Role_Name: sampleUser.roles[i],
            UserOID: sampleUser.OID
        })
    }
    return;
}).catch(function (error) {
    console.log(error);
});


