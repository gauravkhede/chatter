const Product=require('../models/productDetails');

module.exports.createProduct=async function(req,res){
    console.log(typeof parseInt(req.body.quantityAvailable)," is req.body");
    let product=await Product.findOne({productName:req.body.productName});
    if(product){
        product.quantityAvailable+=parseInt(req.body.quantityAvailable);
        product.save();
        return res.status(200).json({
            message:` Product already available So, we increased the quantity of the ${product.productName} by ${req.body.quantityAvailable}`
        })

    }else{
        let newProduct=await Product.create({
            productName:req.body.productName,
            productCategory:req.body.productCategory,
            productInfo:req.body.productInfo,
            price:req.body.price,
            quantityAvailable:req.body.quantityAvailable
        });
        return res.status(200).json({
            data:newProduct,
            success:true,
            message:"product created successfully"
        })
    }
}
module.exports.updateQuantity=async function(req,res){
    let updateProduct=await Product.find({"id":req.body.productId});
    if(updateProduct){
    updateProduct[0].quantityAvailable=req.body.quantityAvailable;
    updateProduct[0].save();
    return res.status(200).json({
        data:updateProduct,
        success:true,
        message:`Product quantity updated to ${updateProduct[0].quantityAvailable}`
    })
    }
    else{
        return res.status(404).json({
            message:"cannot find the product",
            success:false
        })
    }
}
module.exports.updateProduct=async function(req,res){
    let updatedProduct=await Product.findOne({"productName":req.body.productName});
    if(updatedProduct){
        updatedProduct.productCategory=req.body.productCategory;
        updatedProduct.productInfo=req.body.productInfo;
        updatedProduct.price=req.body.price;
        if(req.body.productInfo==="unavailable"){
            updatedProduct.quantityAvailable=0;
        }else{
            updatedProduct.quantityAvailable=req.body.quantityAvailable;
        }
        updatedProduct.save();
        return res.status(200).json({
            data:updatedProduct,
            success:true,
            message:`Product updated to ${updatedProduct}`
        })
        }
        return res.status(404).json({
            message:"cannot find the product",
            success:false
        })

    }
module.exports.fetchProducts=async function(req,res){
    let itemsPerPage=req.query.limit;
    let page=req.query.page;
    
    let totalPage=parseInt(await Product.countDocuments({ "_id": { "$exists": true } })/itemsPerPage)+1;
    let products=await Product.find({}).skip(page*itemsPerPage).limit(itemsPerPage);
    if(products){
        return res.status(200).json({
            data:products,
            message:"Products fetched Successfully",
            totalPage:totalPage,
            success:true
        });
    }
    else{
        return res.status(404).json({
            message:"products not found",
            success:false
        })
    }
}
module.exports.deleteProduct=async function(req,res){
    let productToBeDeleted=await Product.findById(req.params.id);
    if(productToBeDeleted){
        // console.log("deleted product",productToBeDeleted.productName," with id ",req.params.id);
        productToBeDeleted.remove();
        return res.status(200).json({
            deletedProduct:productToBeDeleted,
            message:"product deleted a successfully",
            success:true
        });
    }
    return res.status(401).json({
        message:"products not found",
        success:false
    })

}
module.exports.productSearch=async function(req,res){
    let page=req.query.page;
    let itemsPerPage=req.query.limit;
    let selectedKeys=req.query.selectedKeys;
    console.log(selectedKeys," is the selected keys");
    let totalPage=parseInt(await Product.countDocuments({ "_id": { "$exists": true } })/itemsPerPage)+1;
    let products=await  Product.find({"productName":{$regex:new RegExp(selectedKeys)}, $options: "i"});
    console.log(products);
    return res.status(200).json({
        data:products,
        success:true
    });

}