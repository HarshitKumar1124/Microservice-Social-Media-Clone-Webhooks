const PostService = require('../../services/post-service');

module.exports = (app) => {
    
    const postService =  new PostService();

    app.use('/app-events',async(req,res,next)=>{

        console.log(' -- Posts Service Received Event');
        
        const {payload} = req.body;

        postService.subscribeEvents(payload);
        return res.status(200).json(payload);
    })
}