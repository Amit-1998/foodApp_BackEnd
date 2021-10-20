const mongoose = require("mongoose");
// let { PASSWORD } = process.env || require("../secrets");
let { PASSWORD } = process.env
const validator = require("email-validator");                       

// let dbLink = `mongodb+srv://admin:${PASSWORD}@cluster0.y9gic.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
let dbLink = `mongodb+srv://AmitfoodApp:${PASSWORD}@cluster0.lwgl1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

mongoose.connect(dbLink).then(function(connection){
    console.log("db has been connected");
})
.catch(function(err){
    console.log("err", err);
})

//mongoose -> data -> exact -> data -> that is required to form an entity 
//  data completness , data validation
// name ,email,password,confirmPassword-> min ,max,confirmPassword,required ,unique 

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "kindly pass the name"], // agar aap required: true nhi karoge to error mein "kindly pass the name" ye dega 
        unique: [true, "plan name should be unique"],
        // error
        maxlength: [40, "Your plan length is more than 40 characters"], // agar maxlength 40 nhi diya to ye error dega
    },
    duration: {
        type: Number,
        required: [true, "You need to provide duration"]
    },
    price: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        validate: {
             validator: function(){
                 return this.discount < this.price; // agar ye condition false nikli to niche vaala message error mein jayega
             },
             message: "Discount must be less than actual price",
        },
    },
    planImages: {
        type: [String], // plan ki Images has array of Strings i.e array of URL of Images 
    },
    reviews: { // is plan ke reviews kya-kya hai 
        // array of object id
        type: [mongoose.Schema.ObjectId],
        ref: "reviewModel" 
    },
    averageRating: Number
    
})

// model
let planModel = mongoose.model("planModel", planSchema);
module.exports = planModel;