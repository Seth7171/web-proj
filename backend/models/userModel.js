const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true,
    validate: {
      validator: (value) => {
        return validator.isInt(String(value), { min: 1, max: 120 });
      },
      message: 'Age must be a number between 1 and 120'
    }
  }
});

// static signup method
userSchema.statics.signup = async function (email, password, fullName, age) {
  if (!email || !password || !fullName || !age) { // Check if all fields are filled
    throw Error("All fields must be filled");
  }

  if (!validator.isEmail(email)) {
    throw Error('Email is not valid');
  }
  if (!validator.isStrongPassword(password)) {
    throw Error('Password is not strong enough');
  }

  // checking if we have this email in the db
  const exists = await this.findOne({ email });
  if (exists) {
    throw Error('Email already in use');
  }

  // let the password be safe!
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash, fullName, age });

  return user;
}

// static login method
userSchema.statics.login = async function(email, password) {

  // validation
  if (!email || !password) {
    throw Error('All fields must be filled');
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw Error('Incorrect email');
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error('Incorrect password');
  }

  return user;
}

module.exports = mongoose.model('User', userSchema);
