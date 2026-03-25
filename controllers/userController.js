const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require("../utils/appError");
const factory = require('./handleFactory')

const filterObj = (obj, ...allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach(key => {
    if (allowedFields.includes(key)) {
      newObj[key] = obj[key];
    }
  })
  return newObj
}

exports.updateMe = catchAsync(async(req, res, next) => {
  // Create error is user POSTs password data
  if(req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This API is not for password updates', 400));
  }

  const filteredBody = filterObj(req.body, 'name', 'email')
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {new: true, runValidators: true})


  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  })
  // update user
})

exports.getUser = factory.getOne(User);

exports.addUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: "Internal Server Error"
  })
}

exports.updateUser = factory.updateOne(User)
exports.getAllUsers = factory.getAll(User)
exports.deleteUser = factory.deleteOne(User)
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id
  next()
}

exports.deleteMe = catchAsync(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { active: false})
  res.status(204).json({
    status: 'success',
    data: null
  })
})
