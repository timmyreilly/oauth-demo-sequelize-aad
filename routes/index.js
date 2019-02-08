const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const requestController = require('../controllers/requestController'); 
const { catchErrors } = require('../handlers/errorHandlers');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Request Faculty Demo' });
});

// AUTHENTICATION
router.get('/login', authController.authenticateAzure())
router.post('/auth/openid/callback', authController.authenticateAzureCallback())
router.get('/authError', authController.loginError); 
router.get(`/logout`, authController.logout())


// Faculty Request
router.get('/getRequests', authController.isLoggedIn, catchErrors(requestController.getRequests)); 
router.get('/testRequestEntry', catchErrors(requestController.submitRequest))

// go to create new request: 
router.get('/add', authController.isLoggedIn, requestController.addRequest);
// create new request from scratch 
// go to edit a request: 
// router.get('/editRequest/:id', authController.isLoggedIn, requestController.addRequest);
router.get('/request/:id/edit', authController.isLoggedIn, catchErrors(requestController.editRequest)); 
// router.post('/add/:id', catchErrors(requestController.editRequest)); 
router.post('/add', catchErrors(requestController.createRequest));
router.post('/add/:id', authController.isLoggedIn, catchErrors(requestController.updateRequest)); 

// fulfiller only update endpoint 
router.post('/update/:id', authController.isLoggedIn, authController.isFulfiller, catchErrors(requestController.updateRequest)); 

// go to fulfiller page: 
router.get('/claimRequest/:id', authController.isLoggedIn, authController.isFulfiller, catchErrors(requestController.fulfillerUpdateRequest)); 

// see all relevant info about user and requests
router.get('/account', authController.isLoggedIn, catchErrors(userController.account)); 

// raw json of all requests 
router.get('/requests', catchErrors(requestController.getRequests));

module.exports = router;

