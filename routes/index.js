const express=require('express');
const router=express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const customerController=require('../controllers/customerController');
const User = require('../models/users');
router.use('/product',require('./productRoutes'));
router.use('/order',require('./orderRoutes'));
router.get('/',jsonParser,async function(req,res){
    let users= await User.find({});
    return res.render('Home',{
        users:users
    });
})
router.post('/createCustomer',jsonParser,customerController.createCustomer);
router.get('/fetchCustomer',jsonParser,customerController.fetchCustomer);
router.post('/users/update',jsonParser,customerController.updateUser);
router.get('/fetchSpecificCustomerOrderList/:customerId',customerController.fetchSpecificCustomerOrderList);
router.get('/signin',customerController.signIn);
module.exports=router;