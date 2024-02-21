const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    minlength: [3, 'Panjang nama minimal 3 karakter.'],
    required: [true, 'Nama makanan harus diisi.']
  },
  description: {
    type: String,
    maxlength: [1000, 'Panjang deskripsi maksimal 1000 karakter.']
  },
  price: {
    type: Number,
    default: 0
  },
  image_url: {
    type: String,
    default: null
  }
}, { timestamps: true });

module.exports = model('Product', productSchema);