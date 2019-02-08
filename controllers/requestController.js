const models = require('../models');
const Op = models.Sequelize.Op;

exports.homePage = (req, res) => {
    res.render('index');
};

// warm up example of entering data into SQL using Sequelize
exports.submitRequest = async (req, res, next) => {

    const tag = await models.Tag.findOne({
        where: {
            id: 1
        }
    });

    const newRequest = await models.Request.create({
        Employee_Number: "123",
        isClosed: false,
        Fulfiller_ID_Number: "89",
        Fulfiller_Given_Name: "Bob",
        Fulfiller_Surname: "Sacamano",
        Employee_Detail: "MORE SPOONS PLEASE",
        Fulfiller_Detail: "MOARRR!?",
        Request_Date: Date.now()

    });

    const r = await newRequest.setListOfTag(tag)

    res.json({ "you've": "done it" });
}

exports.addRequest = async (req, res) => {
    res.render('editRequest', {
        title: 'Add Request',
        user: req.user
    })
}

exports.createRequest = async (req, res, next) => {
    req.body.author = req.user.oid;
    req.body.ListOfTag = req.body.tags;
    req.body.requesterClosed = req.body.requesterClosed == "on" ? true : false;
    var t = await models.Tag.findAll({ where: { name: req.body.tags } });
    const request = await models.Request.create(req.body);
    const r = await request.setListOfTag(t);
    req.flash('success', `Successfully created ${request}`);
    res.redirect(`/account`);
}

exports.editRequest = async (req, res, next) => {
    // find store given id: 
    const request = await models.Request.findOne({
        where: {
            'id': req.params.id
        }, include: [
            {
                model: models.Tag,
                as: `ListOfTag`,
                attributes: ["Name"]
            }
        ]
    });

    request.tags = request.ListOfTag.map(a => a.Name);

    // TODO: confirm they are the owner of the Request...

    res.render('editRequest', { title: "Edit this one", request, user: req.user}); 
}

exports.getRequests = async (req, res) => {
    const requests = await models.Request.findAll()
    res.json(requests);
}

exports.fulfillerUpdateRequest = async (req, res) => {
    const request = await models.Request.findOne({
        where: {
            'id': req.params.id
        }, include: [
            {
                model: models.Tag,
                as: `ListOfTag`,
                attributes: ["Name"]
            }
        ]
    });

    request.tags = request.ListOfTag.map(a => a.Name);

    res.render('fulfillerUpdateRequest', { request, user: req.user });
}

exports.updateRequest = async (req, res) => {
    req.body.requesterClosed = req.body.requesterClosed == "on" ? true : false;
    req.body.fulfillerClosed = req.body.fulfillerClosed == "on" ? true : false;

    const r = models.Request.update(req.body,
        {
            where: {
                id: req.params.id
            }
        });
    res.redirect('/');
}