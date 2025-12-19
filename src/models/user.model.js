// import mongoose, {Schema} from "mongoose";

// const userSchema = new Schema({})
//or
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
            index: true
            //index for better searching
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        fullname: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        avatar: {
            type: String, //cloudniary url
            required: true,
        },
        coverImage: {
            type: String
        },
        WatchHistory:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref:"Video"
            }
        ],
        password: {
            type: String,
            required: [true,"password is required"]
        },
        refreshToken:{
            type:String
        }
    },{timestamps:true}
);
// yha call back me ()=>{} ye use nahi krte h bcz this ka access nahi hota h
//next ek flag h jo aage pass karna hota h  
userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password,10);
    next();
})
//custom method add in mongoose schema
userSchema.methods.isPasswordCorrect=  async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }

    )
    //.sign(payload,secret,expiry)
};
userSchema.methods.generateRefreshToken= function(){
    return jwt.sign(
        {
            _id: this._id,  
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }

    )
};

export const User = mongoose.model("User",userSchema);