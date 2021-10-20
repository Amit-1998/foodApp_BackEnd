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

const bookingSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    boughtAtPrice: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        required: [true, "Booking must belong to a user"],
        ref: "userModel" // jab hame data mangaane hoga na to kis chis se ham is user ko refer karenge i.e userModel // ref mein btayenge ki uper jo "type" mein user ki id hai vo kis model ki hai 
    },
    plan: {
        type: mongoose.Schema.ObjectId,
        ref: "planModel", // jab hame data mangaane hoga na to kis chis se ham is plan ko refer karenge i.e planModel // ref mein btayenge ki type mein jo id hai vo kis model ki hai
        required: [true, "Booking must belong to a plan"]
    },
    status: {
        type: String,
        enum: ["pending","successful","rejected"],
        default: "pending",
        required: true
    }
});

const bookingModel = mongoose.model("bookingModel", bookingSchema);
module.exports = bookingModel;