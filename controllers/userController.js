var models = require('../models');
const Op = models.Sequelize.Op;

exports.loginForm = (req, res) => {
    res.render('login', { title: 'Login' });
}

exports.account = async (req, res, next) => {
    try {
        const forms = await models.Request.findAll({
            where: {
                employeeNumber: req.user.oid
            }
        });

        let allForms;
        let fulfillerAssignedForms;
        if (req.user.roles.includes('Fulfiller')) {
            allForms = await models.Request.findAll({})
            fulfillerAssignedForms = await models.Request.findAll({
                where: {
                    fulfillerNumber: req.user.oid
                }
            })
        }

        res.render('account', { title: 'View your account', user: req.user, allForms, forms, fulfillerAssignedForms });
    } catch (error) {
        console.log(error);
        next();
    }
}
