const fs = require('fs');
const bufferData = fs.readFileSync("csvjson(5).json");
const realData = bufferData.toString();
const obj = JSON.parse(realData);
const {Client} = require('elasticsearch');






  // let newObj = [];
  //   for(let [id, val] of Object.entries(obj)){
  //     let tempOBJ = {};
  //       for(let i in val){
     
  //         let key = i
  //         let value = val[i];
  //         // console.log(key);
  //         if(i == "__1"){
  //           var slice_1 = value.split("\n");
  //           var sl1 = slice_1[0];
  //           var slice_2 = slice_1[1];
  //           tempOBJ['name']  =  sl1;
  //         }
         
  //         else if(i == "__2"){
  //           tempOBJ['address'] = value;
  //         }
  //         else if(i == "__3"){
  //           tempOBJ['phone1'] = value;
  //         }
  //         else if(i=="__4"){
  //           tempOBJ['phone2'] = value;
  //         }
  //         else if(i=="__5"){
  //           tempOBJ['mobile'] = value;
  //         }
  //         else if(i=="__6"){
  //           tempOBJ['email'] = value;
  //         }
      

          
  //       }
       
  //       newObj.push(tempOBJ);
     
    
  //   }

    
    const client = new Client({
      node: 'https://api-fastdb.ajx.me',
      auth: {
        username: 'api-fastdb',
        password: 'ZFCx5CkM6JDDVA'
      }
    })


    console.log(client);
    
    



