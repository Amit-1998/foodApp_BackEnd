const jwt = require('jsonwebtoken');
// const { JWT_SECRET } = process.env || require("../secrets");
const { JWT_SECRET } = process.env

const userModel = require('../models/userModel');

module.exports.protectRoute = function protectRoute(req, res, next) {
    try {
        console.log("reached body checker");
        // cookie-parser
        console.log("61", req.cookies)
        // jwt 
        // -> verify everytime that if 
        // you are bringing the token to get your response
        let decryptedToken = jwt.verify(req.cookies.JWT, JWT_SECRET);
        // console.log("66", decryptedToken)
        console.log("68", decryptedToken)
        if (decryptedToken) {
            let userId = decryptedToken.id; // isliye hmane jwtTOken bnate vakt jaan bujh kar payload mein uid ko userModel kw user ki id hi de daali thi taaki ham uska use yha par kar sake (isAuthorized function mein)
            req.userId = userId; // req object hamesha same rahega, to ham req Obj mein userId ko add kar denge 
            next(); // then fir bodychecker par jayega usmein body check hoyegi then body check hone ke baad isAuthorized([roles]) par jayega ismein ham is req.userId ko use karenge
        } else {
            res.send("kindly login to access this resource ");
        }
    } catch (err) {
        res.status(200).json({
            message: err.message
        })
    }

}

module.exports.bodyChecker = function bodyChecker(req, res, next) {
    console.log("reached body checker");
    let isPresent = Object.keys(req.body).length;
    console.log("ispresent", isPresent)
    if (isPresent) {
        next();
    } else {
        res.send("kind send details in body ");
    }
}

// isAuthorized mein ham closure ka use kar rha hu taaki ham sabke liye general code likh paaye 
module.exports.isAuthorized = function(roles){
    console.log("I will run when the server is started"); // ye line to return se pehle likhi hai to sirf isAuthorized(roles) ke call par hi chal jayegi
    // function call
    // ye async vaala function to request par hi chalega
    // jab updateUser ya createUser ys deleteUser par request aayegi tab hi ye async function chalega
    return async function(req, res, next){
        console.log("I will run when a call is made ");
        // jo protectRoute mein decryptedToken se id nikali thi and us id ko hamne req ke object mein add kara diya the usko ham yha use karenge
        // to fir us req object se userId nikali
        let { userId } = req; // protectRoute se hame ye userKi Id  mil gayi matlab user mil gya
        // us userId se user get kra
        // and fir us user se uska role get kra
        // id -> user get, user role
        // than fir is user ka role ko pure "roles" array mein check kra ki vo is array mein exist karta hai ki nhi
        // if role exist -> allow the user
        // if role notExist -> don't allow the user
        try{
           let user = await userModel.findById(userId);
           console.log("5", user);
        //    console.log(req.body.role);
        //    let userisAuthorized = roles.includes(req.body.role);
           let userisAuthorized = roles.includes(user.role);
           console.log(userisAuthorized);
           if(userisAuthorized){
               req.user = user;  // isse hamne whole user hi dediya client ko as we did req.userId in protectRoute
               next();
           }
           else{
               res.status(200).json({
                   message: "user not authorized"
               })
           }

        }
        catch(err){
            console.log(err);
            res.status(500).json({
                message: "Server error"
            })
        }
    }
}