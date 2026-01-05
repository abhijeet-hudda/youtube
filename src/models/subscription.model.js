import mongoose,{Schema} from "mongoose";
// ya app mongoose.Schema bhi lekh skte h 
const subscriptionSchema = new Schema({
    subscriber:{
        type : Schema.Types.ObjectId, // one who is subscriber
        ref: "User"
    },
    channel:{
        type: Schema.Types.ObjectId,//one to whom "subscriber" is subscribing
        ref: "User"
    }
},{timestamps: true})

export const Subscription = mongoose.model("Subscription", subscriptionSchema);

