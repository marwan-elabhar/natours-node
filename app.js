const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean')
const hpp = require('hpp');


const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();
/// set security https headers

app.set('view engine', 'pug')
// app.set('views', express.static(path.join(__dirname, 'views')));
app.use(express.static(`${__dirname}/public`));

// app.use(helmet());


// MIDDLEWARES
if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100, // requests
  windowMs: 60 * 60 * 1000, // time
  message: 'Too many requests. Please try in an hour'
})

app.use('/api', limiter)

// body parser, reading data from body into req.body
app.use(express.json({limit: '10mb'}));

// data sanitization against NoSQL query injection
// app.use(mongoSanitize())


// data sanitization against XSS
// app.use(xss())
//
// // Prevent parameter pollution
// app.use(hpp({
//   whitelist: ['duration']
// }))


app.use((req, res, next) => {
  console.log("middleware")
  next()
})

app.use((req,res,next) => {
  req.requestTime = new Date().toISOString();
  next()
})

// ROUTES
app.get('/', (req, res) => {
  res.status(200).render('base', {
    tour: 'The Forest Hiker',
    user: 'Marwan'
  })
})

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRouter)

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 400));
});

app.use(globalErrorHandler)


module.exports = app;

