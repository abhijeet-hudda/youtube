import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
        videofile:{
            type: String, //cloudnairy url
            required: true
        },
        thumbnail:{
            type: String, //cloudnairy url
            required: true
        },
        title:{
            type: String, 
            required: true
        },
        description:{
            type: String, 
            required: true
        },
        duration:{
            type: Number,  //cloudnairy se
            required: true
        },
        views:{
            type: Number, 
            default: 0
        },
        isPublished:{
            type: Boolean,
            default: true
        },
        owner:{ 
            type: Schema.Types.ObjectId,
            ref:"User"
        }
        //owner
    }
,{timestamps: true})

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video",videoSchema);