
const {postRepository}  = require('../repository');

class PostService {

    constructor(){
        this.repository = new postRepository();
    }

    async createPost(body) {
        try{
            const {content} = body;
            const { image, text} = content;

            if(!image && !text){
                throw (`Content field is Mandatory.`);
            }

            if(image && text){
                throw (`Content can be either text based or other Graphical based media.`)
            }

            return await this.repository.createPost(body);
        } catch(ex) {
            throw ex;
        }
    }

    async deletePost(postID,author) {
        try{
            const post = await this.repository.findPost({_id:postID,author});

            if(post.length == 0){
                throw (`Can't get post with post-id ${postID} and author-id ${author}`);
            }
            await this.repository.deletePost({_id:postID});

            // delete all comments related to this posts
            await this.repository.deleteCommentsOfPost(postID);
            console.log(`Comments of post-id ${postID} are erased`);
        } catch(ex) {
            throw ex;
        }
    }

    // get all posts of specific user
    async fetchAllUserPosts(author){

    }

    // delete all posts of specific user
    async deleteAllUserPosts(author){
        try{
            await this.repository.deleteAllPosts({author});
            await this.repository.deleteComment({author});
        } catch(ex) {
            throw ex;
        }
    }

    async fetchAllPosts() {
        try{
            const response = await this.repository.findPost({});
            console.log('Fetched all posts successfully.');
            return response;
        } catch(ex) {
            throw ex;
        }
    }

    async getPost(postID) {
        try{
            const post =  await this.repository.findPost({_id:postID});

            if(post.length==0){
                throw (`Cannot find the post with post-id :: ${postID}`);
            }

            console.log(`Post with post-id ${postID} fetched successfully.`);
            return post[0];
        } catch(ex) {
            throw ex;
        }
    }

    async updatePostCaption(postID,Authuser,caption) {
        try{
            const post = await this.repository.findPost({_id:postID});

            if(post.length == 0){
                throw(`Can't find the post with instance-id ${postID}`);
            }

            const {author} = post[0];

            if(Authuser !== author){
                throw (`Forbidden to edit other's post caption.`);
            }

            await this.repository.updatePost(postID,{
                caption
            });
            console.log(`Caption updated in the post with id ${postID}`);

        } catch(ex) {
            throw ex;
        }
    }

    async togglePostLike(postID,userID,action){
        try{
            const post = await this.repository.findPost({_id:postID});

            if(post.length == 0) {
                throw( `Can't get the post with id ${postID}`);
            }

            const {likes} = post[0];

            if(action=='like'){

                // Check if user already exist in likes field
                if(likes.has(userID))
                    return (`${userID} already likes the post with id ${postID}`)

            } else {

                // Check if user do exist in likes field
                if(!likes.has(userID))
                    return `${userID} didn't liked the post with id ${userID} before.`
            }

            if(action=='like'){
                await this.repository.updatePost(postID,{ 
                    $set: { [`likes.${userID}`]: "true" }
                });
                console.log(`Post-id ${postID} is liked by user - ${userID}`);
            } else {
                await this.repository.updatePost(postID,{ 
                    $unset: { [`likes.${userID}`]: "" }
                });
                console.log(`Post-id ${postID} is unliked by user - ${userID}`);
            }

        } catch(ex) {
            throw ex;
        }
    }

    async postComment(postID,author,comment) {
        try{
            const post = await this.repository.findPost({_id:postID});

            if(post.length == 0) {
                throw( `Can't get the post with id ${postID}`);
            }

            // creating instance of comment entity
            const instance_id = await this.repository.postComment({
                author,
                postID,
                comment
            });

            // updating Posts instance
            await this.repository.updatePost(postID,{
                $inc:{[`comments.${author}`]:1}
            });
            console.log(`Comments updated in the post with id ${postID}`);

        } catch(ex) {
            throw ex;
        }
    }

    async postUncomment(commentID,AuthUser) {
        try{
            // get Comment instance
            const comment = await this.repository.findComment({_id:commentID});

            if(comment.length == 0){
                throw (`Cannot find the comment instance with id - ${commentID} `)
            }

            const instance = comment[0];
            const {author,postID } = instance;

            if(AuthUser !== author){
                throw (`Forbidden to delete other user's comment.`);
            }

            // Delete the instance of this comment.
            await this.repository.deleteComment({_id:commentID});

            // Update the Post's comment field.
            await this.repository.updatePost(postID,{
                $inc:{[`comments.${author}`]:-1}
            });
            console.log(`Comments updated in the post with id ${postID}`);

            // if count of comments of specific user is 0 then delete that user from Comments field in that post.
            const post = await this.repository.findPost(postID);

            if(post.length == 0) {
                throw( `Can't get the post with id ${postID}`);
            }

            const {comments} = post[0];

            const countOfAuthorComments = comments.get(author);
            
            if(countOfAuthorComments==0){
                // delete author from map of comments of this post
                await this.repository.updatePost(postID,{
                    $unset:{[`comments.${author}`]:""}
                });
                console.log(`Comments updated in the post with id ${postID}`);
            }

        } catch(ex) {
            throw ex;
        }
    }

    async updatePostComment(commentID,AuthUser,comment) {
        try{
            const comments = await this.repository.findComment({_id:commentID});

            if(comments.length == 0){
                throw (`Cannot find the comment instance with id - ${commentID} `)
            }

            const instance = comments[0];
            const {author,postID } = instance;

            if(AuthUser !== author){
                throw (`Forbidden to edit other user's comment.`);
            }

            await this.repository.updateComment(commentID,{
                comment
            });


        } catch(ex) {
            throw ex;
        }
    }

    async fetchAllPostComments(postID){
        try{
            const post = await this.repository.findPost({_id:postID});

            if(post.length==0){
                throw(`Cannot find the instance of post-id :: ${postID}`);
            }
            
            const comments = await this.repository.findComment({postID});
            console.log(`Fetched All comments of the post-id :: ${postID}`);
            return comments;

        } catch(ex) {
            throw ex;
        }
    }

    async getComment(commentID) {
        try{
            const comments = await this.repository.findComment({_id:commentID});

            if(comments.length == 0){
                throw (`Cannot find the comment with id :: ${commentID}`);
            }

            console.log(`Got comment of the comment-id :: ${commentID}`);
            return comments[0];

        } catch(ex) {
            throw ex;
        }
    }




    /* Subscribe-Receiver's End for Webhooks */
    async subscribeEvents(payload) {

        const { event , data } = payload;
        
        switch(event){
            case 'TEST':
                return {
                    message:'Test Successfull - Receiving at Post-service'
                }
            case 'DELETE_USER_POSTS':
                return await this.deleteAllUserPosts(data.userID);
            default: 
                break;
        }
    }

   
}

module.exports = PostService;