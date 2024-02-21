const Category = require('./model');

const store = async (req, res, next) => {
  try {
    const payload = req.body;
    const newCategory = new Category(payload);
    await newCategory.save();
    return res.json({
      message: 'Category added!',
      data: newCategory
    });
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
    const categories = await Category.find().skip(parseInt(skip)).limit(parseInt(limit));
    return res.json({
      message: 'Categories fetched!',
      data: categories
    });
  } catch (error) {
    next(error);
  };
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const category = await Category.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    return res.json({
      message: 'Category updated!',
      data: category
    })
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
    const category = await Category.findByIdAndDelete(id);
    
    return res.json({
      message: 'Category deleted successfully!',
      data: category
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