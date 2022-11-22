const express = require('express');
const router = express.Router();
const elasticsearch = require('@elastic/elasticsearch');

const esclient = new elasticsearch.Client({  
    node: 'https://api-fastdb.ajx.me',
   
    auth: {
        username: 'api-fastdb',
        password: 'ZFCx5CkM6JDDVA'
    }                
});

 /* This operation health of es */
router.get('/health',(req,res) => {
    console.log("I am here");
    esclient.cluster.health({},(err,resp,status) => {  
      if(err)
      {  console.log("-- Client Health ERROR--",err);
      }else{
         console.log("-- Client Health --",resp.body);
         //res.send({resp});
      } 
    });
 }); 


module.exports = {esclient, router}