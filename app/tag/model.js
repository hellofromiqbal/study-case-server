const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const tagSchema = new Schema({
  name: {
    type: String,
    minlength: [3, 'Nama tag minimal 3 karakter.'],
    maxlength: [20, 'Nama tag maksimal 20 karakter.'],
    required: [true, 'Nama tag harus diisi.']
  }
});

module.exports = model('Tag', tagSchema);