const { postSchema , commentSchema} = require('./schema')

class PostRepository {
    async createPost(body) {
        try{
            const response  = await postSchema.create(body);
            console.log('Post created successfuly :: ',response._id);
            return response._id;
        } catch(ex) {
            throw ex;
        }
    }

    async deletePost(filter) {
        try{
            const response = await postSchema.deleteOne(filter);
            console.log('Post deleted successfully.',response);
        } catch(ex) {
            throw ex;
        }
    }

    async deleteAllPosts(filter) {
        try{
            const response = await postSchema.deleteMany(filter);
            console.log('Post deleted successfully.',response);
        } catch(ex) {
            throw ex;
        }
    }


    async updatePost(postID,body){
        try{

            // If the key you're trying to increment in the Map field is not already set in the document,
            // MongoDB will automatically create the key and set its value to the increment amount specified
            // in the $inc operator. $inc operator increments BY 1.

            await postSchema.updateOne({_id:postID},body);
        } catch(ex) {
            throw ex;
        }
    }

   async findPost(body){
    try{
        const response = await postSchema.find(body);
        return response;
    } catch(ex) {
        throw ex;
    }
   }





   async postComment(body) {
    try{
        // create instance of comment entity 
        const {_id} = await commentSchema.create(body);
        console.log('Comment instance created successfully with id :: ',_id);
        return _id;
    } catch(ex) {
        throw ex;
    }
   }

   async deleteComment(filter) {
    try{
        await commentSchema.deleteOne(filter);
        console.log(`Comment got deleted successfully.`);
    } catch(ex) {
        throw ex;
    }
   }

   async updateComment(commentID,body){
    try{
        await commentSchema.updateOne({_id:commentID},body);
    } catch(ex) {
        throw ex;
    }
   }

   async deleteCommentsOfPost(postID) {
    try{
        await commentSchema.deleteMany({postID});
    } catch(ex) {
        throw ex;
    }
   }

   async findComment(body) {
    try{
        return await commentSchema.find(body);
    } catch(ex) {
        throw ex;
    }
   }
}

module.exports = PostRepository;