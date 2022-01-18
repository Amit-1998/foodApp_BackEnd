const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// let { PASSWORD } = //process.env
let PASSWORD;
//deployed
if(process.env.PASSWORD){
    PASSWORD = process.env.PASSWORD;
}
else{
    //local
    PASSWORD = require("../secrets").PASSWORD;
}

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

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: function () {
            // third party library 
            return validator.validate(this.email)
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    confirmPassword: {
        type: String,
        required: true,
        minlength: 8,
        validate: function () {
            return this.password == this.confirmPassword
        }
    },
    createdAt: {
        type: String,
    },
    token: String,
    validUpto: Date,
    role: {
        type: String,
        enum: ["admin", "ce", "user"], // ye teen hi accept karega
        default: "user"
    },
    bookings: {
        // array of object id
        type: [mongoose.Schema.ObjectId],
        ref: "bookingModel"
    }
})

// hook
userSchema.pre('save',async function(next){
   // do stuff
   const salt = await bcrypt.genSalt(10); // random text dega-> more the value of salt ,more time it takes to encrypt the plaintext
   // password convert into some text and save into DB
   this.password = await bcrypt.hash(this.password, salt); //password jo user ne put kra the vo ab change ho chuka hai 
   this.confirmPassword = undefined;
   next();
});

// document method
userSchema.methods.resetHandler = async function(password, confirmPassword){
    // reset password karte vakt bhi to hame usey hash kra ke save krana hoga
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
    this.confirmPassword = confirmPassword;
    this.token = undefined;
}

// model
let userModel = mongoose.model("userModel", userSchema);
module.exports = userModel;