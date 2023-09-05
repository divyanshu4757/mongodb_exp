const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');

const User = require('./models/user');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
   User.findById('64f75ffa310ccdd7c875caed')
   .then(user=>{
  //  console.log(user)
    req.user = user;
    next();
   })
})


 app.use('/admin', adminRoutes);
 app.use(shopRoutes);

app.use(errorController.get404);



mongoose.connect('mongodb+srv://divyanshu:ak475767@cluster0.dyvy47l.mongodb.net/shop?retryWrites=true&w=majority')
.then(()=>{
  console.log('connected to database')
  User.findOne().then(user=>{
    if(!user){
      const user = new User({
        name:'max',
        email:'max@test.com',
        cart:{
          items:[]
        }
      })
      user.save();
    }
  })
  
  app.listen(3000);
})
.catch(err => {
  console.log(err);
})