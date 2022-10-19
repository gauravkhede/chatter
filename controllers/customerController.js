const Client = require('../models/client');
const Customer= require('../models/customerDetails');
const Product = require('../models/productDetails');
const User = require('../models/users');

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
module.exports.updateUser=function(req,res){
    console.log("********** ",req.body);
    try{
        User.uploadedAvatar(req,res,function(err){
            if(err){ console.log('*****Multer Error ',err); return;}
            
            if(req.file){
                console.log("req.file ke andar aagaya");
                User.create({
                    avatar:User.avatarPath+'/'+req.file.filename
                },function(err,user){
                    if(err){
                        console.log("error in creating user",err);
                        return;
                    }
                    
                    console.log(user);
                    return res.redirect('back');
                })
            }else{
                console.log(" no file found in request");
            }
        })
    
    }
    catch (err) {
    console.log('Error',err);
    return res.redirect('back');
    }

}
module.exports.signIn=function(req,res){
    Client.findOne({email:req.body.email},function(err,user){
        if(err){
            console.log("Error in finding the user in signIn",err);
            return;
        }
        if(user){
            if(user.password!=req.body.password){
                console.log("password Incorrect");
                return res.redirect("back");
            }
            // handle session creation 
            res.cookie('user_id',user._id);
            return res.redirect('/profile');
        }
    })
   
}
module.exports.signUp=function(req,res){
    console.log(req.body," is the requested body");
    if(req.body.password!=req.body.confirm_password){
        return res.redirect('back');
    }
    Client.findOne({email:req.body.email},function(err,user){
        if(err){
            console.log("error in finding user",err);
            return;
        }
        if(!user){
            Client.create({
                email:req.body.email,
                password:req.body.password
            },function(err,newUser){
                if(err){
                    console.log("error in finding user while signUp",err);
                    return;
                }
                return res.redirect('back');
            })
        }
        else{
            console.log('user already exist');
            return res.redirect('back');
        }
    })
   
}

module.exports.Profile=async function(req,res){
    let all_users=await Client.find({});
    console.log(req.cookies);
    if(req.cookies.user_id){
        Client.findById(req.cookies.user_id,function(err,user){
            if(user){
                res.render('Welcome',
                {
                    title:"User joined",
                    user:user,
                    all_users:all_users
                })
            }else{
                return res.redirect('/signUp');
            }
        })
    }else{
        return res.redirect('/signIn');
    }
}