import mongoose,{Schema} from "mongoose"

// const mediaSchema = new Schema({
//     url: { type: String, required: true },
//     type: { type: String, enum: ["image", "video", "gif"], required: true },
//     alt: { type: String }
// }, { _id: false })

// const pollOptionSchema = new Schema({
//     text: { type: String, required: true },
//     votes: { type: Number, default: 0 }
// }, { _id: false })

// const editHistorySchema = new Schema({
//     text: { type: String },
//     editedAt: { type: Date, default: Date.now }
// }, { _id: false })

const tweetSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        trim: true,
        maxlength: 280,
        default: ""
    },
    // media: {
    //     type: [mediaSchema],
    //     validate: {
    //         validator: function(v) { return !v || v.length <= 4 },
    //         message: 'A tweet can have at most 4 media items.'
    //     }
    // },
    // mentions: [{ type: Schema.Types.ObjectId, ref: "User" }],
    // hashtags: [{ type: String }],
    // replyTo: { type: Schema.Types.ObjectId, ref: "Tweets" },
    // retweetOf: { type: Schema.Types.ObjectId, ref: "Tweets" },
    // quoteOf: { type: Schema.Types.ObjectId, ref: "Tweets" },
    // poll: {
    //     options: { type: [pollOptionSchema], default: void 0 },
    //     expiresAt: { type: Date }
    // },
    // location: {
    //     name: { type: String },
    //     coords: {
    //         lat: { type: Number },
    //         lng: { type: Number }
    //     }
    // },
    // isEdited: { type: Boolean, default: false },
    // editHistory: { type: [editHistorySchema], default: [] },
    // visibility: { type: String, enum: ["public", "private", "followers"], default: "public" },
    // sensitive: { type: Boolean, default: false },
    // language: { type: String },
    // stats: {
    //     likes: { type: Number, default: 0 },
    //     retweets: { type: Number, default: 0 },
    //     replies: { type: Number, default: 0 },
    //     views: { type: Number, default: 0 }
    // },
    // pin: { type: Boolean, default: false },
    // scheduledAt: { type: Date },
    // threadId: { type: Schema.Types.ObjectId }
}, { timestamps: true })

// Indexes for common queries
// tweetSchema.index({ owner: 1, createdAt: -1 })
// tweetSchema.index({ text: 'text' })
// tweetSchema.index({ hashtags: 1 })

export const Tweet = mongoose.model("Tweet", tweetSchema);