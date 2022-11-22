const elasticS = require('elasticsearch');

const client = new elasticS.Client({
    node: 'https://api-fastdb.ajx.me',
    auth: {
      username: 'api-fastdb',
      password: 'ZFCx5CkM6JDDVA'
    },
   

})


client.ping({}, async function(err){
    
    if(err){
        console.log("err", err)
    }
    else{
        console.log("connected");
    }
})