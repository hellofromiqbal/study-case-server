const { Schema, model } = require('mongoose');

const deliveryAddressSchema = Schema({
  alamat: {
    type: String,
    required: [true, 'Alamat harus diisi.'],
    maxlength: [255, 'Alamat maksimal 255 karakter.']
  },
  kelurahan: {
    type: String,
    required: [true, 'Kelurahan harus diisi'],
    maxlength: [255, 'Kelurahan maksimal 255 karakter.']
  },
  kecamatan: {
    type: String,
    required: [true, 'Kecamatan harus diisi'],
    maxlength: [255, 'Kecamatan maksimal 255 karakter.']
  },
  kabupaten: {
    type: String,
    required: [true, 'Kabupaten harus diisi'],
    maxlength: [255, 'Kabupaten maksimal 255 karakter.']
  },
  provinsi: {
    type: String,
    required: [true, 'Provinsi harus diisi'],
    maxlength: [255, 'Provinsi maksimal 255 karakter.']
  },
  detail: {
    type: String,
    required: [true, 'Detail alamat harus diisi'],
    maxlength: [255, 'Detail alamat maksimal 255 karakter.']
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
}, { timestamps: true });

module.exports = model('DeliveryAddress', deliveryAddressSchema);