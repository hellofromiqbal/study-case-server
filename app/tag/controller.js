const Tag = require('./model');

const store = async (req, res, next) => {
  try {
    const payload = req.body;
    const newTag = new Tag(payload);
    await newTag.save();
    return res.json({
      message: 'Tag added!',
      data: newTag
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
    const tags = await Tag.find().skip(parseInt(skip)).limit(parseInt(limit));
    return res.json({
      message: 'Tags fetched!',
      data: tags
    });
  } catch (error) {
    next(error);
  };
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const tag = await Tag.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    return res.json({
      message: 'tag updated!',
      data: tag
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
    const tag = await Tag.findByIdAndDelete(id);
    
    return res.json({
      message: 'Tag deleted successfully!',
      data: tag
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