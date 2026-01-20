const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require("../utils/appError");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach(key => {
    if (allowedFields.includes(key)) {
      newObj[key] = obj[key];
    }
  })
  return newObj
}

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find()


  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  })
});

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

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: "Internal Server Error"
  })
}

exports.addUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: "Internal Server Error"
  })
}

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: "Internal Server Error"
  })
}

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: "Internal Server Error"
  })
}
