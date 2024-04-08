const User = require('../models/userModel');
const asyncErrorHandler = require('../utils/asyncErrorHandler');
const CustomError = require('../utils/CustomError');
const ApiFeatures = require('../utils/ApiFeatures');


exports.getAllUsers = asyncErrorHandler(async (req, res, next) => {
    const features = new ApiFeatures(User.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const users = await features.query;

    res.status(200).json({
        status: 'success',
        length: users.length,
        data: {
            users
        }
    });
});

exports.getUserById = asyncErrorHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        const error = new CustomError('User with that ID is not found', 404);
        // next sends the error to the global error handling middleware (GEHM)
        // return so that the rest of the code below 'next(error)' does not run after calling the GEHM
        return next(error);
    }
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    })
});

exports.createUser = asyncErrorHandler(async (req, res, next) => {
    const newUser = await User.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            newUser
        }
    });
});

exports.updateUser = asyncErrorHandler(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!updatedUser) {
        const error = new CustomError('User with that ID is not found', 404);
        return next(error);
    }
    res.status(200).json({
        status: 'success',
        data: {
            updatedUser
        }
    });
});

exports.deleteUser = async (req, res, next) => {
    // will return a deleted user object if successfully deleted. If ID is not found, will return null.
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
        const error = new CustomError('User with that ID is not found', 404);
        return next(error);
    }
    res.status(204).json({
        status: 'success',
        data: null
    });
}
