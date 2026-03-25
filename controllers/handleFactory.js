const AppError = require("../utils/appError");
const catchAsync = require('../utils/catchAsync');


exports.deleteOne = Model => catchAsync(async (req, res, next) => {

    const doc =  await Model.findByIdAndDelete(req.params.id);

    if(!doc) {
        return next(new AppError('Document not found', 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'Document has been deleted successfully'
    });
});

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        status: 'success',
        data: {
            document
        }
    });
})

exports.createOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            doc
        }
    });
})

exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if(popOptions) query = query.populate(popOptions)
    const doc = await query

    if(!doc) {
        return next(new AppError('Document not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    })

})

