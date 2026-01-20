const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

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

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log("middleware")
  next()
})

app.use((req,res,next) => {
  req.requestTime = new Date().toISOString();
  next()
})

// ROUTES

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 400));
});

app.use(globalErrorHandler)


module.exports = app;

