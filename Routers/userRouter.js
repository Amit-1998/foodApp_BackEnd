// dependencies
const express = require("express");
const userModel = require("../models/userModel");

// router
const userRouter = express.Router();
const { protectRoute, bodyChecker, isAuthorized } = require("./utilFns");

const { createElement, getElement, getElements, updateElement, deleteElement } = require("../helpers/factory");
// routes -> id
userRouter.use(protectRoute); // sabke pehle yhi lgado // sabhi function se pehle ham protectRoute lga de rahe hai jisske hoga ye ki hame protectRoute se user mil jayega through decryptedToken mein req.userId
// let authCheckerCE = isAuthorized(["admin", "ce"]); // "ce" is our customer executive (like restaurant owner)
// let authChecker = isAuthorized(["admin"]);

// functions
const createUser = createElement(userModel); // idhar se createUser ban jayega

// createUser is only authorized to admin
// async function createUser(req, res){
//     try{
//        let user = await userModel.create(req.body);
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

const getUser = getElement(userModel);
// getUser is authorized to normal moderators, users
// async function getUser(req, res){
//     let { id } = req.params;
//     try{
//         let user = await userModel.findById(id);
//         // console.log(user);
//         res.status(200).json({
//             "message": user
//         })
//     }
//     catch(err){
//         res.status(502).json({
//             message: err.message
//         })
//     }
// }

const getUsers = getElements(userModel);
// getUsers is authorized to normal moderators, users
// async function getUsers(req, res) {
//     try {
//         let users = await userModel.find();
//         res.status(200).json({
//             "message": users
//         })
//     } catch (err) {
//         res.status(502).json({
//             message: err.message
//         })
//     }
// }

const updateUser = updateElement(userModel);
// async function updateUser(req, res){
//     let { id } = req.params;
//     try{
//         // ham password & confirm Password nhi  update  krvana chahenge through updateUser
//         if (req.body.password || req.body.confirmPassword) {
//             return res.json({
//                 message: "use forget password instead, to update p & cP"
//             })
//         }
//        let user = await userModel.findById(id);
//        if(user){
//            for(let key in user){
//                user[key] = req.body[key];
//            }
//            // save -> confirm, password
//            // [options.validateBeforeSave] «Boolean» set to false to save without validating.
//            // validateBeforeSave: false krane se jo schema mein hamne required: true kra hai and jo email ko validaate function diye ye sab chise ko run or check nhi karega unhe rokega validate karne se
//            // schema mein jo pre('save') likha use bhi nhi chalne dega
//            await user.save({
//                validateBeforeSave: false
//            });
//            res.status(200).json({
//                user: user
//            });
//         }
//        else{
//           res.status(404).json({
//               message: "user not found"
//           })  
//        }
//     } 
//     catch(err){
//          console.log(err);
//          res.status(500).json({
//              message: "Server error"
//          });
//     }
// }

const deleteUser = deleteElement(userModel);
// deleteUser is only authorized to admin
// async function deleteUser(req, res){
//      let { id } = req.params;
//      try{
//         let user = await userModel.findByIdAndDelete(id);
//         res.status(200).json({
//             user: user
//         });
//      }
//      catch(err){
//          console.log(err);
//          req.status(500).json({
//              message: "Server error"
//          });
//      }
// }

// isAuthorized mein ham closure ka use kar rha hu taaki ham sabke liye general code likh paaye 
// function isAuthorized(roles){
//     console.log("I will run when the server is started"); // ye line to return se pehle likhi hai to sirf isAuthorized(roles) ke call par hi chal jayegi
//     // function call
//     // ye async vaala function to request par hi chalega
//     // jab updateUser ya createUser ys deleteUser par request aayegi tab hi ye async function chalega
//     return async function(req, res){
//         console.log("I will run when a call is made ");
//         // jo protectRoute mein decryptedToken se id nikali thi and us id ko hamne req ke object mein add kara diya the usko ham yha use karenge
//         // to fir us req object se userId nikali
//         let { userId } = req; // protectRoute se hame ye userKi Id  mil gayi matlab user mil gya
//         // us userId se user get kra
//         // and fir us user se uska role get kra
//         // id -> user get, user role
//         // than fir is user ka role ko pure "roles" array mein check kra ki vo is array mein exist karta hai ki nhi
//         // if role exist -> allow the user
//         // if role notExist -> don't allow the user
//         try{
//            let user = userModel.findById(userId);
//            let userisAuthorized = roles.includes(user.role);
//            if(userisAuthorized){
//                req.user = user;  // isse hamne whole user hi dediya client ko as we did req.userId in protectRoute
//                next();
//            }
//            else{
//                req.status(200).json({
//                    message: "user not authorized"
//                })
//            }

//         }
//         catch(err){
//             console.log(err);
//             res.status(500).json({
//                 message: "Server error"
//             })
//         }
//     }
// }

// routes
userRouter.route('/')
  .post(bodyChecker, isAuthorized(["admin"]), createUser) // post will call function on itself
   // localhost/user -> get
  .get(protectRoute, isAuthorized(["admin", "ce"]), getUsers);

userRouter.route("/:id")
  .get(getUser)
  .patch(bodyChecker, isAuthorized(["admin", "ce"]), updateUser) 
  .delete(bodyChecker, isAuthorized(["admin"]), deleteUser)

module.exports = userRouter;
