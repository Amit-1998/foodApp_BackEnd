// dependencies
const express = require("express");

// router
const planRouter = express.Router();
const { protectRoute, bodyChecker, isAuthorized } = require("./utilFns");

const planModel = require("../models/planModel");
const { createElement, getElement, getElements, updateElement, deleteElement } = require("../helpers/factory");

// functions
const createPlan = createElement(planModel);
// async function createPlan(req, res){
//     try{
//        let user = await planModel.create(req.body);
//        res.status(200).json({
//            user: user
//        })
//     }
//     catch(err){
//         console.log(err);
//         res.status(500).json({
//             message: "Server Error"
//         })
//     }
// }

const getPlan = getElement(planModel);
const getPlans = getElements(planModel);
const updatePlan = updateElement(planModel);

const deletePlan = deleteElement(planModel);
// async function deletePlan(req, res){
//     let { id } = req.params;
//     try{
//        let user = await planModel.findByIdAndDelete(id);
//        res.status(200).json({
//            user: user
//        });
//     }
//     catch(err){
//         console.log(err);
//         req.status(500).json({
//             message: "Server error"
//         });
//     }
// }

// route -> id
planRouter.use(protectRoute);

// routes
planRouter.route("/")
   .post(bodyChecker, isAuthorized(["admin"]), createPlan)
   .get(protectRoute, isAuthorized(["admin","ce"]), getPlans);
  
planRouter.route("/sortByRating", getbestPlans); // jiski jyda rating usbasis par plans dede


planRouter.route("/:id")
  .get(getPlan) // don't put semicolns here
  .patch(bodyChecker, isAuthorized(["admin", "ce"]), updatePlan) // don't put semicolns here
  .delete(bodyChecker, isAuthorized(["admin"]), deletePlan) // last vaali request par u can put semicolon

async function getbestPlans(req, res){
    console.log("Inside getBestPlans");
    try{
        // sort("-averageRating") -> -ve means in decreasing order (sort ke ander key ka name dena padta hai)
        let plans = await planModel.find().sort("-averageRating").populate({
            path: "reviews",
            select: "review"
        })
        console.log(plans);
        res.status(200).json({
           plans
        })
    }
    catch(err){
        console.log(err);
        res.status(200).json({
           message: err.message
        })
    }
}

module.exports = planRouter;