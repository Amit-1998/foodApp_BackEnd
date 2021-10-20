// dependencies
const express = require("express");

// router
const reviewRouter = express.Router();
const { protectRoute, bodyChecker, isAuthorized } = require("./utilFns");

const reviewModel = require("../models/reviewModel");
const { createElement, getElement, getElements, updateElement, deleteElement } = require("../helpers/factory");
const planModel = require("../models/planModel");

// functions
// const createReview = createElement(reviewModel);
const getReview = getElement(reviewModel);
const getReviews = getElements(reviewModel);
const updateReview = updateElement(reviewModel);
// const deleteReview = deleteElement(reviewModel);


const createReview = async function(req, res){
     try{
        // review -> put entry
        let review = await reviewModel.create(req.body);
        // extract planId from this review
        let planid = review.plan; // plan ki Id nikali reviewModel se
        // planKiId se hamne vo plan hi dhundh lia
        let plan = await planModel.findById(planid); // planId ke basis par plan nikala from planModel
        // fir us plan ke reviews apne review ki id daaldi
        plan.reviews.push(review["_id"]); // and then plan mein reviews key ke ander jakar review ki Id daal di
  
        // fir plan ki avgrating update kardi
        if(plan.averageRating){
            let sum = plan.averageRating * plan.reviews.length;
            let finalAvgRating = (sum + review.rating) / (plan.review.length+1);
            plan.averageRating = finalAvgRating;
        }
        else{
           plan.averageRating = review.rating; // initially jab koi plan add hota hai to uski koi rating nhi hoti, to jo review ki rating hogi initiall vhi plan ki avg Rating hogi
        }
        await plan.save(); // than us plan ko save kar dia
        res.status(200).json({
            message: "review created",
            review: review
        })
     }
     catch(err){
         res.status(500).json({
             message: err.message
         })
     }
}

const deleteReview = async function(req, res){
    try{
        let review = await reviewModel.findByIdAndDelete(req.body.id);
        let planId = review.plan;
        let plan = await planModel.findById(planId);
        let idxOfReview = plan.reviews.indexOf(review["_id"]);
        plan.review.splice(idxOfReview, 1);
        await plan.save();
        res.status(200).json({
            message: "review created",
            review: review
        })
    }
    catch(err){
       res.status(500).json({
         message: err.message
       })
    }
}

async function getUsersAlso(req, res){
    try{    
            // ref ke saath function aata hai populate
            // reviewModel ke kis key ko populate karvana hai use path mein likho means kis chis ke baare mein jyada info nikalni hai
            // fir vo revieModel mein user key ke ander jo id hai vo kis model ki hai us model ki particular chis ko nikalna hai that would comes in select
            let reviews = await reviewModel.find().populate({
               // ek saath do chiso ko bhi populate kra sakte like user and plan both so give path: "user plan"
               path: "user", // is reviewModel mein  "user" key mein jo id hai us ke basis par yaani us id ko ref mein pade model mein find karega ,milne ke baad usmein se jo chise chahiye use select mein likh denge that's it
               select: "name email"
            })
           res.json({
              reviews
           })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message: "Server error"
        })
    }
}

// route -> id
// reviewRouter.use(protectRoute);

// routes
reviewRouter.get("/getuseralso", getUsersAlso);

// createReview
// review -> put entry
// plan: average rating update
// plan -> reviewId


reviewRouter.route("/")
  .post(protectRoute, bodyChecker, isAuthorized(["admin"]), createReview)
  .get(protectRoute, isAuthorized(["admin","ce"]), getReviews);

reviewRouter.route("/:id")
  .get(getReview)
  .patch(protectRoute, bodyChecker, isAuthorized(["admin", "ce"]), updateReview)
  .delete(protectRoute, bodyChecker, isAuthorized(["admin"]), deleteReview);

module.exports = reviewRouter;