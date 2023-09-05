const mongodb = require('mongodb');


const getDb = require("../util/database").getDb;

const objectId = mongodb.ObjectId;


class User {
  constructor(username, email ,cart , id) {
    this.name = username;
    this.email = email;
    this.cart = cart; // {items:[]}
    this._id = id
  }
  
  save() {
    const db = getDb();
  return  db.collection('users').insertOne(this)
  }

  static findById(userId) {

    const db = getDb();
    return db.collection('users').findOne({_id:new objectId(userId)})
  }



  addToCart(product){
     
    
    const cartProductIndex = this.cart.items.findIndex(cp=>{
      return cp.productId == product._id
    })
   
    let newQuantity =1;
   const updatedCartitems = [...this.cart.items];


   if(cartProductIndex>=0){
    
    newQuantity = this.cart.items[cartProductIndex].quantity+1;

    updatedCartitems[cartProductIndex].quantity = newQuantity;

   }


   else{
    updatedCartitems.push({productId:new ObjectId(product._id) , quantity:newQuantity})
   }
    

    const updatedCart = {items:updatedCartitems};
    const db = getDb();
   return db.collection('users').updateOne({_id:new objectId(this._id)},
     
    {set:{cart:updatedCart}}
    
    )

  }








}

module.exports = User;