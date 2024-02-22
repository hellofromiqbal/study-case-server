const User = require('../user/model');

const register = async (req, res, next) =>  {
  try {
    const payload = req.body;
    const user = new User(payload);
    await user.save();
    return res.json({
      message: 'New user created!',
      data: user
    });
  } catch (err) {
    if(err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors
      });
    };
    next(err);
  };
};

module.exports = {
  register
};