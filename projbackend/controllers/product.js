const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getProductId = (req,res,next,id) => {
    Product.findById(id).exec((err,product)=>{
        if(err) {
            return res.status(400).json({
                error:"Cannot find product"
            })
        }
        req.product = product;
        next();
    }) 
}
exports.createProduct = (req,res) => {
let form =  new formidable.IncomingForm();
form.keepExtensions = true;
form.parse(req,(err, fileds, file) => {
    if(err) {
        return res.status(400).json({
            error: "problem in file uploading file"
        })
    }
    const { name, description, price, category, stock }  = fileds;
    // console.log(fileds);

    if (
        !name ||
        !description ||
        !price ||
        !category ||
        !stock 
     ) {
        return res.status(400).json({
        error:"Enter all fileds of product"
        })
    }

    //TODO: restriction on fileds
    let product = new Product(fileds);

    // handle file
    if(file.photo) {
        if(file.photo.size > 3000000) {
            return res.status.json({
                error: "File size too big!"
            })
        }
        product.photo.data = fs.readFileSync(file.photo.path)
        product.photo.contentType = file.photo.type
    }
    // save to DB
    product.save((err, product) => {
        if(err) {
            res.status(400).json({
            error :"error in saving product"
            })
        }
        res.json(product);
    })
})
};
exports.getProductById = (req,res) => {
req.product.photo = undefined;
return res.json(req.product);
}
exports.photo = (req,res,next) => {
    if(req.product.photo) {
        res.set("Content-Type",req.product.photo.contentType);
        return res.send(req.product.product.data);
    }
    next();
};

// delete Controllers
exports.deleteProduct = (req,res) => {
 let product = req.product;
 product.remove((err,deletedProduct)=> {
     if(err) {
         return res.status(400).json({
             error: "Failed to delete product"
         })
     }
     return res.json({
         msg : "deleted Successfully",
         deleteProduct
     })
 })
}

exports.updateProduct = (req,res) => {
    let form =  new formidable.IncomingForm();
form.keepExtensions = true;
form.parse(req,(err, fileds, file) => {
    if(err) {
        return res.status(400).json({
            error: "problem in file uploading file"
        })
    }

    //Updataion code
    let product = req.product;
    product= _.extend(product, fileds);

    // handle file
    if(file.photo) {
        if(file.photo.size > 3000000) {
            return res.status.json({
                error: "File size too big!"
            })
        }
        product.photo.data = fs.readFileSync(file.photo.path)
        product.photo.contentType = file.photo.type
    }
    // save to DB
    product.save((err, product) => {
        if(err) {
            res.status(400).json({
            error :"error in updating product"
            })
        }
        res.json(product);
    })
})
    
}
exports.getAllProducts = (req,res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sort ? req.query.sort : "_id";
    Product.find().
    // select(-photo).
    populate("category").
    sort([[sortBy, "asc"]]).
    limit(limit).
    exec((err,products) => {
        if(err) {
            return res.status(400).json({
                err: " error in fetching products"
            });
        }
        return res.json(products);
    })
};
exports.updateStock = (res,req, next) => {

    let myOperations = req.body.order.products.map( prod => {
        return {
            updateOne: {
                filter: {_id: prod._id},
                update: {$inc: {stock: -prod.count, sold: +prod.count}}
            }
        }
    })
    Product.bulkWrite(myOperations,{},(err,products) => {
        if(err) {
            return res.json({
                err: "Bulk operation is failed"
            })
        }
        return res.json(products);
    });
}
exports.getAllUniqeCategories = (req,res) => {
    Product.distinct("category",{},(err,category)=> {
        if(err) {
            return res.status(400).json({
                err:"error is fetching categories"
            })
        }
        return res.json(category);
    })
}