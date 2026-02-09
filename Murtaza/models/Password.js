import mongoose from "mongoose";

const passwordSchem = new mongoose.Schema({
    userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID requis'],
    index: true
  },
  titre: {
    type: String,
    required: true,
    max: 30
  },
  site: {
    type: String,
    required,
    max: 255
  },
  encryptedPassword: {
    type: String,
    required: true
  },
  email: {
    type: String,
    max: 45,
  },
  userName: {
    type: String,
    max: 30
  },
    category: {
    type: String,
    enum: {
      values: ['social', 'banking', 'email', 'shopping', 'work', 'other'],
      message: 'Catégorie invalide'
    },
    default: 'other'
  }

})

const Password = mongoose.model('Password', passwordSchem);
export default Password;
// add password model