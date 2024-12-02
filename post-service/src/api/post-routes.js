const { isAuthenticate }  = require('./middleware').isAuth;
const PostService = require('../services/post-service');

module.exports = (app) => {

    const postService = new PostService () ; 

    this.getError = async(res,error) =>{
    
        res.status(400).send({
            status:false,
            statusCode:error.code || 500,
            error:error.message || error,
        });
    }

    /* Service Check Function */
    app.get('/',async(req,res)=>{
        res.status(200).send({
            message:"post-service is working fine."
        })
    });

    
    /* Creating Media Post */
    app.post('/new/post',isAuthenticate,async(req,res)=>{
        try{
            const body = {
                ...req.body,
                author:req.user._id
            };
            const post_id = await postService.createPost(body);

            res.status(200).send({
                status:true,
                message:`Post created successfully by ${req.user._id} with post-instance-id :: ${post_id} `
            });
        } catch(ex) {
            await this.getError(res,ex);
        }
    });

    /* Delete the created Post */
    app.delete('/post/delete/:id',isAuthenticate,async(req,res)=>{
        try{
            const post_id = req.params.id;
            const author_id = req.user._id;
            await postService.deletePost(post_id,author_id);
            res.status(200).send({
                status:true,
                message:`Post with instance-id ${post_id} is deleted successfully.`
            })
        } catch(ex) {
            await this.getError(res,ex);
        }
    })

    /* Fetch All Posts */
    app.get('/posts',async(req,res)=>{
        try{
            const posts =  await postService.fetchAllPosts();
            res.status(200).send({
                status:true,
                posts
            });
        } catch(ex) {
            await this.getError(res,ex);
        }
    })

    /* Fetch Specific Post */
    app.get('/post/:id',async(req,res)=>{
        try{
            const postID = req.params.id;
            const post =  await postService.getPost(postID);
            res.status(200).send({
                status:true,
                post
            });
        } catch(ex) {
            await this.getError(res,ex);
        }
    })

    /* Like-Unlike someone's Post */
    app.put('/post/toggle/like/:id',isAuthenticate,async(req,res)=>{
        try{
            const {action} = req.query;
            const userID = req.user._id;
            const postID = req.params.id;

            if(!action){
                throw(`Action un-specified for post to like or dislike.`)
            }

            const validActions = ["like","dislike"];
            if (!validActions.includes(action.toLowerCase())) { // Case-insensitive check
                throw("Invalid action specified.");
            }

            let message = await postService.togglePostLike(postID,userID,action);

            if(!message){
                message = `Post ${postID} is ${action}d by ${userID}`;
            } 

            res.status(200).send({
                status:true,
                message
            })
        } catch(ex) {
            await this.getError(res,ex);
        }
    })

     /* Edit the caption */
    app.put('/post/edit/:id',isAuthenticate,async(req,res)=>{
        try{
            const postID = req.params.id;
            const Authuser = req.user._id;
            const {caption} = req.body;

            if(caption==undefined){
                throw (`Only caption of the Post can be edited`);
            }
            
            await postService.updatePostCaption(postID,Authuser,caption);
            res.status(200).send({
                status:true,
                message:"Post's caption editted successfully."
            })
        } catch(ex) {
            await this.getError(res,ex);
        }
    })

    /* Comment on someone's Post */
    // comment ka alag entity banana padega taki target kar sake ki kon sa comment hatana hai
    app.put('/post/comment/:id',isAuthenticate,async(req,res)=>{
        try{
            const postID = req.params.id;
            const author = req.user._id;
            const {comment} = req.body;
           
            if(!comment){
                throw(`Comment field can't be empty.`);
            }
        
            let message = await postService.postComment(postID,author,comment);

            if(!message){
                message = `${author} commented on the post-id ${postID}`;
            }

            res.status(200).send({
                status:true,
                message
            });

        } catch(ex) {
            await this.getError(res,ex);
        }
    })

    /* Uncomment on someone's Post */
    app.delete('/post/uncomment/:id',isAuthenticate,async(req,res)=>{
        try{
            const commentID = req.params.id;
            const Authuser = req.user._id;

            let message = await postService.postUncomment(commentID,Authuser);

            if(!message){
                message = `Uncommented ${commentID} by user ${Authuser} successfully.`;
            }

            res.status(200).send({
                status:true,
                message
            })
        } catch(ex) {
            await this.getError(res,ex);
        }
    })

    /* Edit the comment on post */
    app.put('/post/update/comment/:id',isAuthenticate,async(req,res)=>{
        try{
            const commentID = req.params.id;
            const AuthUser = req.user._id;
            const {comment} = req.body;

            if(!comment){
                throw(`Comment can't be empty field.`);
            }

            await postService.updatePostComment(commentID,AuthUser,comment);
            res.status(200).send({
                status:true,
                message:"Comment editted successfully."
            });
        } catch(ex) {
            await this.getError(res,ex);
        }
    })

    /* Fetch All comments of a posts */
    app.get('/post/comments/:id',async(req,res)=>{
        try{
            const postID = req.params.id;
            const comments =  await postService.fetchAllPostComments(postID);
            res.status(200).send({
                status:true,
                comments
            });
        } catch(ex) {
            await this.getError(res,ex);
        }
    })

    /* get specific comment by id */
    app.get('/post/comment/:id',async(req,res)=>{
        try{
            const commentID = req.params.id;
            const comment =  await postService.getComment(commentID);
            res.status(200).send({
                status:true,
                comment
            });
        } catch(ex) {
            await this.getError(res,ex);
        }
    })
   

    
}