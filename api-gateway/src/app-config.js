const Dotenv = require('dotenv');
const express = require('express');
const proxy = require('express-http-proxy');

Dotenv.config({path:"./config.env"});

module.exports = async(app) =>{
    try{

        /* It is used for json body-parser */
        app.use(express.json());

        /* Channelizing the requests to there respect Microservice Port */
        app.get('/',async(req,res)=>{
            res.status(200).send({
                status:true,
                message:`API Gateway is live at port :: ${process.env.PORT}` + ` CI-CD Implemented Successfully.`
            });
        })
        
        app.use('/user-srvc',proxy('http://localhost:8001'));
        app.use('/post-srvc',proxy('http://localhost:8002'));
        app.use('/chat-srvc',proxy('http://localhost:8003'));
        app.use('/connection-srvc',proxy('http://localhost:8004'));


        /* Invalid API Call error response */
        app.use('*',(req,res,next)=>{
            res.status(404).send({
                status:'Failure',
                message:'Error 404 Microservice Route not found.'
            })
        })


        app.listen(process.env.PORT,()=>{
            console.log('Application is listening to the port ::',process.env.PORT);
        });

    } catch (ex) {
        console.log('Application execution failed due to :: ',ex);
    }
}
