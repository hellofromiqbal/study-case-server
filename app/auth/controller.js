const User = require('../user/model');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { getToken } = require('../../utils');

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

const localStrategy = async (email, password, done) => {
  try {
    const user = await User
      .findOne({ email })
      .select('-__v -createdAt -updatedAt -cart_items -token');
    if(!user) return done();
    if(bcrypt.compareSync(password, user.password)) {
      ( { password, ...userWithoutPassword } = user.toJSON() );
      return done(null, userWithoutPassword);
    }
  } catch (error) {
    done(err, null);
  };
  done();
};

const login = async (req, res, next) => {
  passport.authenticate('local', async function(err, user) {
    if(err) return next(err);
    if(!user) return res.json({
      error: 1,
      message: 'Invalid email/password.'
    });
    
    const signed = jwt.sign(user, config.secretKey);

    await User.findByIdAndUpdate(user._id, { $push: { token: signed } });

    return res.json({
      message: 'Login berhasil!',
      data: user,
      token: signed
    });
  })(req, res, next);
};

const logout = async (req, res, next) => {
  let token = getToken(req);

  let user = await User.findOneAndUpdate({ token: { $in: { token: [token] } } }, { $pull: { token: token } }, { useFindAndModify: false });

  if(!token || !user) {
    res.json({
      error: 1,
      message: 'User not found!'
    });
  };

  return res.json({
    error: 0,
    message: 'Logout berhasil!'
  });
};

module.exports = {
  register,
  login,
  localStrategy,
  logout
};