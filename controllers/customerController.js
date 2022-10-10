const Customer= require('../models/customerDetails');
const Product = require('../models/productDetails');

module.exports.createCustomer=async function(req,res){
    try{
        console.log(req.body,' is the requested body');
        var customer=await Customer.find({email:req.body.email});
        if(customer.length==0){
            var newCustomer=await Customer.create({
                email:req.body.email,
                name:req.body.name,
                phone:req.body.phone

            });
           return res.status(200).json({
                customer:newCustomer,
                message:"Customer created a successfully"
                
            })
        }
        return res.status(409).json({
            message:'Customer already Exist! Try different Email Id'
        })}catch(error){
            console.log(error);
            return;
        }
}
module.exports.fetchCustomer=async function(req,res){
    let allCustomer=await Customer.find({});
    if(allCustomer){
        return res.status(200).json({
            allCustomer:allCustomer,
            message:'All customer fetched Successfully'
        });
    }
    return res.status(404).json({
        message:"unable to fetch customers list"
    });
}
module.exports.fetchSpecificCustomerOrderList=async function(req,res){
    console.log("customer id",req.params.customerId);
    let customer=await Customer.find({"id":req.params.customerId});
    console.log(customer," is the customer who want to fetch specific customer order list");
    if(customer){
        let productListName=[];
        // customer[0].productId.map((product)=>{
            // Product.find({"id":product},function(err,productFound){
            //     console.log(productFound," is productFound");
            //     console.log(productFound[0].productName," is the productFound name");
        //         productListName.push({[productName]:[productFound[0].productName]});
        //         // productListName.save();
        //     });
        // });
        console.log(customer," is customer[0] with product Id");
        customer[0].productId.forEach((product)=>{
            Product.find({"id":product},function(err,productFound){
                console.log(productFound," is productFound");
                console.log(productFound[0].productName," is the productFound name");
            return productListName.push(productFound[0].productName);

        })
        })
        console.log(typeof customer[0].productId," is product list name");
        return res.status(200).json({
            customerProductList:customer[0].productId,
            message:"customer product Details fetched"
        });
    }
    return res.status(404).json({
        message:"Invalid customer Id or Unable to fetch Customer product Details"
    })
}