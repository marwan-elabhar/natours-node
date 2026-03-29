const mongoose = require('mongoose');


const reviewSchema = new mongoose.Schema({
        review: {
            type: String,
            required: [true, 'Review is required'],
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
        createdAt: {type: Date, default: Date.now(), select: false},
        tour: {type: mongoose.Schema.ObjectId, ref: 'Tour', required: [true, 'Review must belong to a tour.']},
        user: {type: mongoose.Schema.ObjectId, ref: 'User', required: [true, 'Review is required']},

    },
    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    })

reviewSchema.pre(/^find/, function ( next) {
    // this.populate({ path: 'tour', select: 'name'}).populate({ path: 'user', select: 'name photo'})

    this.populate({ path: 'user', select: 'name photo'})

    next()
})

reviewSchema.statics.calcAverageRatings = async function (tourId) {
   const stats = await this.aggregate([
        {
            $match: {tour: tourId}
        },
        {
            $group: {
                _id: '$tourId',
                nRating: {$sum: 1},
                avgRating: {$avg: '$rating'}
            }
        }
    ])
    console.log(stats)
    if(stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {ratingsQuantity: stats[0].nRating, ratingsAverage: stats[0].avgRating})

    }
}

reviewSchema.index({ tour: 1, user: 1}, {unique: true})

reviewSchema.post('save', function () {
    this.constructor.calcAverageRatings(this.tour)
})

reviewSchema.pre(/findOneAnd/, async function(next) {
    const r = await this.findOne(next)
    next()
})

reviewSchema.post(/findOneAnd/, async function () {
  await  this.r.constructor.calcAverageRatings(this.r.tour)
})


const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
