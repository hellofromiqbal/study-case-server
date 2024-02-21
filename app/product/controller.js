const fs = require('fs');
const path = require('path');
const config = require('../config');
const Product = require('./model');

const store = async (req, res, next) => {
  try {
    let payload = req.body;
    if(req.file) {
      let tmp_path = req.file.path;
      let originalExt = req.file.originalname.split('.').pop();
      let filename = req.file.filename + '.' + originalExt;
      let target_path = path.resolve(config.rootPath, `public/images/products/${filename}`);

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on('end', async () => {
        try {
          let product = new Product({...payload, image_url: filename});
          await product.save();
          return res.json({
            message: 'New product added!',
            data: product
          });
        } catch (err) {
          fs.unlinkSync(target_path);
          if(err && err.name === 'ValidationError') {
            return res.json({
              error: 1,
              message: err.message,
              fields: err.errors
            });
          };
          next(err);
        };
      });

      src.on('error', async (err) => {
        next(err);
      });
    } else {
      let product = new Product(payload);
      await product.save();
      return res.json({
        message: 'New product added!',
        data: product
      });
    };
  } catch (err) {
    if(err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors
      });
    }
    next(err);
  };
};

const index = async (req, res, next) => {
  try {
    const { skip = 0, limit = 10 } = req.query;
    const products = await Product.find().skip(parseInt(skip)).limit(parseInt(limit));
    return res.json({
      message: 'Products fetched!',
      data: products
    });
  } catch (error) {
    next(error);
  };
};

const update = async (req, res, next) => {
  try {
    let { id } = req.params;
    let payload = req.body;

    if(req.file) {
      let tmp_path = req.file.path;
      let originalExt = req.file.originalname.split('.').pop();
      let filename = req.file.filename + '.' + originalExt;
      let target_path = path.resolve(config.rootPath, `public/images/products/${filename}`);

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on('end', async () => {
        try {
          let newProduct = await Product.findByIdAndUpdate(
            id,
            { ...payload, image_url: filename },
            { new: true, runValidators: true }
          );
          return res.json({
            message: 'New product added!',
            data: newProduct
          });
        } catch (err) {
          fs.unlinkSync(target_path);
          if(err && err.name === 'ValidationError') {
            return res.json({
              error: 1,
              message: err.message,
              fields: err.errors
            });
          };
          next(err);
        };
      });

      src.on('error', async (err) => {
        next(err);
      });
    } else {
      let newProduct = await Product.findByIdAndUpdate(
        id,
        payload,
        { new: true, runValidators: true }
      );
      return res.json({
        message: 'New product added!',
        data: newProduct
      });
    };
  } catch (err) {
    if(err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors
      });
    }
    next(err);
  };
};

module.exports = {
  store,
  index,
  update
};