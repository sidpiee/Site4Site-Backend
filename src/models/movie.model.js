import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
    {
        userId : {
            required : true,
            type : String ,
        },
        imdbID : {
            required : true,
            type : String,
        },
        imdbRating : {
            type : String ,
            required : true,
        },
        Title : {
            required : true,
            type : String ,
        },
        Year : {
            type : String ,
        },
        Poster : {
            type : String ,
        },
        Runtime : {
            type : String , 
            required : true,
        },
        status : {
            required : true,
            type : String ,
            enum : ["watched" , "plan"]
        },
        Plot : {
            type : String,
            required : true,
        },
        notes : {
            type : String ,
            default : "No notes added"
        } ,
        Genre: {
            type : String ,
            required : true,
        },
        Ratings : {
            type : [
                {
                    Source : String , 
                    Value : String ,
                }
            ],
            default : [],
        }
    },{
        timestamps : true,
    }
)
movieSchema.index(
  { userId: 1, imdbID: 1 },
  { unique: true }
);
export const Movie = mongoose.model("Movie" , movieSchema);