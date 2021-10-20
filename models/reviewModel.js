const mongoose = require("mongoose");
// let { PASSWORD } = process.env || require("../secrets");
let { PASSWORD } = process.env
const validator = require("email-validator");  

let dbLink = `mongodb+srv://AmitfoodApp:${PASSWORD}@cluster0.lwgl1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

mongoose.connect(dbLink).then(function(connection){
    console.log("db has been connected");
})
.catch(function(err){
    console.log("err", err);
})

const reviewSchema = new mongoose.Schema({
     review: {
         type: String,
         required: [true, "Review can't be empty"]
     },
     rating: {
         type: Number,
         min: 1,
         max: 5,
         required: [true, "Review must contain some rating"]
     },
     createdAt: {
         type: Date,
         default: Date.now
     },
     user: {
         type: mongoose.Schema.ObjectId,
         required: [true, "Review must belong to a user"],
         ref: "userModel" // jab hame data mangaane hoga na to kis chis se ham is user ko refer karenge i.e userModel // ref mein btayenge ki uper jo "type" mein user ki id hai vo kis model ki hai 
     },
     plan: {
         type: mongoose.Schema.ObjectId,
         ref: "planModel", // jab hame data mangaane hoga na to kis chis se ham is plan ko refer karenge i.e planModel // ref mein btayenge ki type mein jo id hai vo kis model ki hai
         required: [true, "Review must belong to a plan"]
     }
});

const reviewModel = mongoose.model("reviewModel", reviewSchema);
module.exports = reviewModel;