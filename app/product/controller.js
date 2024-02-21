const fs = require('fs');
const path = require('path');
const config = require('../config');
const Product = require('./model');
const Category = require('../category/model');
const Tag = require('../tag/model');

const store = async (req, res, next) => {
  try {
    let payload = req.body;

    if(payload.category) {
      const category = await Category.findOne({ name: { $regex: payload.category, $options: 'i' } });
      if(category) {
        payload = { ...payload, category: category._id }
      } else {
        delete payload.category;
      };
    };

    if(payload.tags && payload.tags.length > 0) {
      const tags = await Tag.find({ name: { $in: payload.tags } });
      if(tags.length > 0) {
        payload = { ...payload, tags: tags.map((tag) => tag._id) };
      } else {
        delete payload.tags;
      }
    };

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
    const { skip = 0, limit = 10, q = '', category = '', tags = [] } = req.query;

    let criteria = {};

    if(q.length) {
      criteria = {
        ...criteria,
        name: { $regex: `${q}`, $options: 'i' }
      };
    };

    if(category.length) {
      const categoryResult = await Category.findOne({ name: { $regex: `${category}`, $options: 'i' } });

      if(categoryResult) {
        criteria = { ...criteria, category: categoryResult._id }
      };
    };

    if(tags.length) {
      const tagsResult = await Tag.find({ name: { $in: tags } });

      if(tagsResult.length > 0) {
        criteria = { ...criteria, tags: { $in: tagsResult.map((tag) => tag._id) } }
      };
    };

    const count = await Product.find(criteria).countDocuments();

    const products = await Product
      .find(criteria)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate('category')
      .populate('tags');
    
    return res.json({
      count,
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

    if(payload.category) {
      const category = await Category.findOne({ name: { $regex: payload.category, $options: 'i' } });
      if(category) {
        payload = { ...payload, category: category._id }
      } else {
        delete payload.category;
      };
    };

    if(payload.tags && payload.tags.length > 0) {
      const tags = await Tag.find({ name: { $in: payload.tags } });
      if(tags.length > 0) {
        payload = { ...payload, tags: tags.map((tag) => tag._id) };
      } else {
        delete payload.tags;
      }
    };

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
          const product = await Product.findById(id);
          const currentProductImage = `${config.rootPath}/public/images/products/${product.image_url}`;
          if(fs.existsSync(currentProductImage)) {
            fs.unlinkSync(currentProductImage);
          };
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

const destroy = async (req,res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    const productImage = `${config.rootPath}/public/images/products/${product.image_url}`;
    if(fs.existsSync(productImage)) {
      fs.unlinkSync(productImage);
    };
    return res.json({
      message: 'Product deleted successfully!',
      data: product
    });
  } catch (error) {
    next(error);
  };
};

module.exports = {
  store,
  index,
  update,
  destroy
};