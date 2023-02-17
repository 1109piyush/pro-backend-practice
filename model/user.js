const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
        maxlength: [40, "Name should be under 40 characters"],
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        validate: [validator.isEmail, "Please enter email in correct format"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: [6, "password should be atleast 6 char"],
        // means whenever we request password it doesnot send to frontend
        select: false,
    },
    role: {
        type: String,
        default: "user",
    },
    // we get from cloudinary
    photo: {
        id: {
            type: String,
            required: true,
        },
        secure_url: {
            type: String,
            required: true,
        },
    },
    // forgot password token is when someone forgot password we send token to both user and db and then db verify token
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// cannot use arrow function in mongoose 
//encrypt password before save - HOOKS
// !this.isModified means if password is modified return to next otherwise it become loop everytime password  come it brypt before saving again and again
// if field is not been modified return to next otherwise encrypt it    * it is most explatory
userSchema.pre("save", async function (next) {
    // Only run this function if password was moddified (not on other update functions)
    if (!this.isModified("password")) {
        return next();
    }
    // this means above password
    this.password = await bcrypt.hash(this.password, 10);
});

// validate the password with passed on user password thispassword is saved encrypt password
userSchema.methods.isValidatedPassword = async function (usersendPassword) {
    return await bcrypt.compare(usersendPassword, this.password);
};

//create and return jwt token we sending payload as id  than we can decode later to get id
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
    });
};

//generate forgot password token (string)  use crypto because it comes with node js
userSchema.methods.getForgotPasswordToken = function () {
    // generate a long and randomg string     we are sending to client side
    const forgotToken = crypto.randomBytes(20).toString("hex");

    // getting a hash - make sure to get a hash on backend       forgotPasswordToken store one extra layer of secuirty it is store in db when client send forgotToken we compare that
    this.forgotPasswordToken = crypto
        .createHash("sha256")
        .update(forgotToken)
        .digest("hex");

    //time of token   20 minute
    this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;
// only send forgettoken not    .createHash("sha256")
    return forgotToken;
};

module.exports = mongoose.model("User", userSchema);
