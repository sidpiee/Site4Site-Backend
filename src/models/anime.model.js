import mongoose from "mongoose";

const animeSchema = new mongoose.Schema(
    {
        userId : {
            required : true,
            type : String ,
        },
        mal_id : {
            required : true,
            type : Number,
        },
        title : {
            required : true,
            type : String ,
        },
        title_english : {
            type : String ,
        },
        image : {
            required : true,
            type : String ,
        },
        episodes : {
            required : true,
            type : Number ,
        },
        status : {
            required : true,
            type : String ,
            enum : ["Watching" , "Plan to watch" , "Completed"]
        },
        rating : {
            type : Number,
            min : 0,
            max : 5,
            default : null,
        },
        episodesWatched : {
            type : Number,
            min : 0,
            default : 0,
        },
        notes : {
            type : String ,
            default : "No notes added"
        } ,
        genres: {
             type: [
                {
                mal_id: Number,
                name: String,
                },
            ],
            default: [],
        },
    },{
        timestamps : true,
    }
)
animeSchema.index(
  { userId: 1, mal_id: 1 },
  { unique: true }
);
export const Anime = mongoose.model("Anime" , animeSchema);