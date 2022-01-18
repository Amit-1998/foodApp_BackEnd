// npm init -y
// npm i express
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

// const jwt = require('jsonwebtoken');
// const { JWT_SECRET } = require('./secrets');
const cookieParser = require('cookie-parser');
const userRouter = require("./Routers/userRouter");
const authRouter = require('./Routers/authRouter');
const planRouter = require('./Routers/planRouter');
const reviewRouter = require("./Routers/reviewRouter");
const bookingRouter = require("./Routers/bookingRouter");
// let userModel = require("./models/userModel");

const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require('express-mongo-sanitize');


// Server: // route  -> request -> response/file 
// File system// path -> interact/type -> file /folder
// server init
const app = express();
// this line 
// post -> /
// app.post("/", function (req, res, next) {
//     let body = req.body;
//     console.log("before", body);
//     next();
// })
app.use(cors({origin:"https://amit-1998.github.io"}));
app.use(express.json());
app.use(cookieParser());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
    next();
  });
  
//  apply to all requests -> sabhi requests se pehle likho
app.use(rateLimit({
    max: 100, // limit each IP to 100 requests per windowMs // start blocking after 100 requests
    windowMs: 15*60*1000, // 15 minutes
    message:
    "Too many accounts created from this IP, please try again after an hour"
}))

// extra param na ho inke alawa
app.use(hpp({
    whitelist:['select', 'page', 'sort', 'myquery']
}))

// to set http headers
app.use(helmet());

// inbuilt menthods of express has next already implmeneted
// always use me
//  express json -> req.body add
// reserve a folder only from which client can acces the files 
app.use(express.static("Frontend_folder")); // yha se saari files serve hoti hai


// cross site scripting
app.use(xss());
// mongodb query sanitize
app.use(mongoSanitize());

// // function -> route  path
// // frontend -> req -> /
// read data storage
// localhost/user/10 -> post 
// let content = JSON.parse(fs.readFileSync("./data.json"));
// const userRouter = express.Router();
// const authRouter = express.Router();
// // localhost / auth / 10-> patch
app.use('/api/user', userRouter);
app.use("/api/plan", planRouter);
app.use('/api/auth', authRouter);
app.use("/api/review", reviewRouter);
app.use("/api/booking", bookingRouter);

// userRouter
    // .route('/')
//     localhost/user -> get
    // .get(protectRoute, getUsers)
//     localhost/user -> post
//     .post(bodyChecker, isAuthenticated, isAuthorized, createUser);
// userRouter
//     .route("/:id")
//     // localhost/user/10-> post
//     .get(getUser)

// authRouter.route("/signup")
//     .post(bodyChecker, signupUser);

// authRouter.route("/login")
//     .post(bodyChecker, loginUser);

/* jwtkey bnane se pehle protectRoute aise likha the*/

// function protectRoute(req, res, next){
//     console.log("reached body checker");
//     // jwt 
//     // -> verify everytime that if 
//     // you are bringing the token to get your response
//     let isallowed = false;
//     if (isallowed) {
//         next();
//     } else {
//         res.send("kindly login to access this resource ");
//     }
// }

/* after require JWT_SECRET key*/ 
// function protectRoute(req, res, next){
//     try{
//         console.log("reached body checker");
//         // cookie-parser
//         console.log("61", req.cookies);
//         // jwt 
//         // -> verify everytime that if 
//         // you are bringing the token to get your response
//         let decryptedToken = jwt.verify(req.cookies.JWT, JWT_SECRET);
//         // console.log("66", decryptedToken);
//         console.log("68", decryptedToken);  
//         if(decryptedToken){
//             next();
//         }
//         else{
//             res.send("kindly login to access this resource ");
//         }
//     }
//     catch(err){
//         res.status(200).json({
//             message: err.message
//         })
//     }

// }

// function getUsers(req, res)
// {  res.status(200).json({
//       "message" : content
//    })
// }


// function bodyChecker(req, res, next) {
//     console.log("reached body checker");
//     let isPresent = Object.keys(req.body).length; // check object mein keys hai kya ?
//     console.log("ispresent", isPresent)
//     if (isPresent) {
//         next();
//     } else {
//         res.send("kind send details in body ");
//     }
// }

// userModel se pehle ka signUpUser function
// function signupUser(req, res) {
//     let { name, email, password,confirmPassword } = req.body;
//     console.log("req.body", req.body);
    
//     if (password == confirmPassword) {
//         let newUser = { name, email, password }
//         // entry put 
//         content.push(newUser);
//         // save in the datastorage
//         fs.writeFileSync("data.json",JSON.stringify(content));
//         res.status(201).json({
//             createdUser: newUser
//         })
//     } else {
//         res.status(422).json({
//             message: 
//             "password and confirm password do not match"
//         })
//     }
// }

// userModel bnane ke baad ka signUpUser function
// async function signupUser(req, res) {
//     try{
//         let newUser = await userModel.create(req.body);
//         res.status(200).json({
//             "message": "user created successfully",
//             user: newUser
//         })
//     }
//     catch(err){
//         console.error(err);
//         res.status(500).json({
//             message: err.message
//         })
//     }
// }



/* token se pehle aise likha the*/ 
// function loginUser(req, res){
//      let { email, password } = req.body;
//      let obj = content.find((obj)=>{ // content ke har ek obj par kind of loop
//          return obj.email == email
//      })

//      if (!obj) {
//         return res.status(404).json({
//             message: "User not found"
//         })
//      }

//     if (obj.password == password) {
//         res.status(200).json({
//             message: "user logged In",
//             user: obj
//         })
//     }
//     else {
//         res.status(422).json({
//             message: "password doesn't match"
//         })
//     }     

// }

// token ke baad
// function loginUser(req, res){
//     let { email, password } = req.body;
//     let obj = content.find((obj)=>{ // content ke har ek obj par kind of loop
//         return obj.email == email
//     })

//     if (!obj) {
//        return res.status(404).json({
//            message: "User not found"
//        })
//     }

//    if (obj.password == password) {
//        var token = jwt.sign({ email: obj.email },JWT_SECRET); // when first time login // here email is our payload
//        console.log(token);

//        res.cookie("JWT", token); // server ye cookie with its token client ko dega
//        // sign with RSA SHA256
//         // res body 

//        res.status(200).json({
//            message: "user logged In",
//            user: obj
//        })
//    }
//    else {
//        res.status(422).json({
//            message: "password doesn't match"
//        })
//    }     
// }

// authRouter.route("/:id").patch(forgetPassword)
// function createUser(req, res) {
//     console.log("create users");
//     let body = req.body;
//     console.log("req.body", req.body);
//     content.push(body);
//     // put data storage 
//     fs.writeFileSync("./data.json", JSON.stringify(content));
//     res.json({ message: content });
// }
// function getUsers(req, res) {
//     res.json({ message: content });
// }

// heroku physical -> multiple server run
app.listen(process.env.PORT||8081, function () {
    console.log("server started");
})
// app.post("/", function (req, res, next) {
//     let body = req.body;
//     console.log("inside first post", body);
//     next();
// })
// app.use(function (req, res, next) {
//     console.log("inside app.use",)
//     next();
// })
// app.get("/", function (req, res) {
//     let body = req.body;
//     console.log("inside first get", body);

// })
// app.post("/", function (req, res, next) {
//     let body = req.body;
//     console.log("inside second post ", body);
//     res.send("tested next");
// })
app.use(function (req, res) {
    // console.log("fullPath", fullPath);
    // res.status(404).sendFile
    // (path.join(__dirname, "404.html"));
    res.status(404).json({
        message: "404 page not found"
    })
})
// app.get("/", function (req, res) {
//     console.log("hello from home page")
//     // res.send("<h1>Hello from Backend</h1>");
//     res.status(200).json(
//         { message: content }
//     )
// })
// app.put("/", function (req, res) {
//     console.log("hello from home page")
//     res.send("<h1>Hello from Backend</h1>");
// })
// app.update("/", function (req, res) {
//     console.log("hello from home page")
//     res.send("<h1>Hello from Backend</h1>");
// })
// app.delete("/", function (req, res) {
//     console.log("hello from home page")
//     res.send("<h1>Hello from Backend</h1>");
// })
// app.get("/user", function (req, res) {
//     console.log("users")
//     // for sending key value pair
//     res.json(obj);
// })
// //localhost:8080 ??
    // / port, ip,localhost