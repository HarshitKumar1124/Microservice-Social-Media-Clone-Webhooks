const express = require('express');
const Dotenv = require("dotenv");
const cookieParser = require('cookie-parser');
const {post} = require('./api');
const {appEvents} = require('./api/middleware')


const { connectDatabase } = require('./repository');

/* To use environment variables from .env file */
Dotenv.config({ path: "./config.env" });


module.exports = async (app) => {
 
  /* Enable JSON Body Parsing */
  app.use(express.json());

  /* Enable Cookie Parser */
  app.use(cookieParser());

  /* Connect MongoDB Atlas Database */
  await connectDatabase();

  /* Listening to App-Events by Other Services */
  appEvents(app);

  /* Integrating Post Routes */
  post(app);

  /* Invalid API Call error response */
  app.use('*',(req,res,next)=>{
    res.status(404).send({
        status:'Failure',
        message:'Error 404 Route not found.'
    })
  })

  app.listen(process.env.PORT, () => {
    console.log(
      "Application post-service is running on port number ::",
      process.env.PORT
    );
  });
};
