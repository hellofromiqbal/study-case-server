const DeliveryAddress = require('./model');

const store = async (req, res, next) => {
  try {
    const payload = req.body;
    const user = req.user;

    const address = new DeliveryAddress({ ...payload, user: user._id });
    await address.save();
    return res.json({
      message: 'Delivery address added!',
      data: address
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

const index = async (req, res, next) => {
  try {
    const addresses = await DeliveryAddress.find();
    return res.json({
      message: 'Delivery addresses fetched!',
      data: addresses
    });
  } catch (error) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const deliveryAddress = await DeliveryAddress.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    return res.json({
      message: 'Delivery address updated!',
      data: deliveryAddress
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
    const deliveryAddress = await DeliveryAddress.findByIdAndDelete(id);
    
    return res.json({
      message: 'Delivery address deleted successfully!',
      data: deliveryAddress
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