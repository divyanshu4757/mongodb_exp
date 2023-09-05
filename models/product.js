const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const productSchema = new Schema({
   
  title: {
    type: String,
    required: true
  }
,price: {
  type: Number,
  required: true
},
description: {
  type: String,
  required: true
},
imageUrl: {
  type: String,
  required: true
},
userId:{
  type:Schema.Types.ObjectId,
  ref:'User'//name of model which you want to relate with it
  ,
  required: true
}
});








module.exports = mongoose.model('Product',productSchema);// mongoose will create 'products' table(collection here) for this 