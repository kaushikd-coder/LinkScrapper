const mongoose=require('mongoose');
const uri="mongodb+srv://kaushik:Kaushikd123@cluster0.8y3pulg.mongodb.net/?retryWrites=true&w=majority";

// 'mongodb+srv://crypto:crypto@cluster0.qiviuld.mongodb.net/linkscraper?retryWrites=true&w=majority'
const connecttomongo=()=>
{
    mongoose.connect(uri).then((data)=>{
        console.log('Connected to databse successfully '+ data.Connection.name)
    }).catch((err)=>{
        console.log(err);
    })
};
module.exports=connecttomongo;
