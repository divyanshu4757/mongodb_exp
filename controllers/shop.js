const Product = require('../models/product');
const Order = require('../models/order');


exports.getProducts = (req, res, next) => {
  Product.find() // moongose method to get all data from table
    .then(products => {
      console.log(products)
      console.log('lemon')
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
    });
};



exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  //findbyid->mongoose method to find by id and no need to convert it into id object ,just pass id as string
  Product.findById(prodId)
    .then(product => {
      console.log(product);
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
     .then(user => {
          console.log(user.cart.items);
          const p = user.cart.items
          res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: p
          });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId).then(
    product=>{

      return req.user.addToCart(product);// we added this method in user model and now calling it on user object getting in the request
    }
  ).then(result=>{
    console.log(result)
    res.redirect('/cart');

  })


};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.removeFromCart(prodId)
    
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
     .then(user => {
          console.log(user.cart.items);
          const products = user.cart.items.map(i=>{
            return {quantity:i.quantity , product:{...i.productid._doc}}
          })

          const order  = new Order({
            user:{
              name:req.user.name,
              userId:req.user
            },
            products:products
          })

        return  order.save();
     })

    .then(result => {
     return  req.user.clearCart();
    })
    .then(()=>{
      res.redirect('/orders');

    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => console.log(err));
};
