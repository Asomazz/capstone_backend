exports.clicksTracker = async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.productId);
  
    if(req.body.type == "buy"){
      product.buyNowClicks++
      product.save()
    }else if(eq.body.type == "cart"){
      product.addToCartClicks++
      product.save()
    }else{
      res.status(404).json({message:"type is not there"})
    }
  
      return res.json(product);
    } catch (error) {
      return next(error);
    }
  };