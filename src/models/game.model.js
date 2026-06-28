import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
    {
        userId : {
            required : true,
            type : String ,
        },
        id : {
            required : true,
            type : Number,
        },
        rating : {
            type : Number ,
            required : true,
        },
        name : {
            required : true,
            type : String ,
        },
        released : {
            type : String ,
            required : true,
        },
        background_image : {
            type : String ,
            required : true,
        },
        status : {
            required : true,
            type : String ,
            enum : ["playing" , "completed" , "dropped" , "wishlist"]
        },
        review : {
            type : String ,
            default : "No notes added"
        } ,
        personalRating : {
            type : Number ,
            default : 0,
        },
        favourite : {
            type : Boolean,
            default : false,
        },
        
        platforms: [
            {
            platform: {
                id: {
                type: Number,
                required: true,
                    },
                name: {
                type: String,
                required: true,
                },
            },
        },
        ],
    },{
        timestamps : true,
    }
)
gameSchema.index(
  { userId: 1, id: 1 },
  { unique: true }
);
export const Game = mongoose.model("Game" , gameSchema);