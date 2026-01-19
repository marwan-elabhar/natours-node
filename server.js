const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({path: './config.env'});

const app = require('./app')

mongoose.connect(process.env.DB, {
})

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

process.on('unhandledRejection', error => {
  server.close(() => {
    process.exit(1);
  })

})

process.on('uncaughtException', error => {
  server.close(() => {
    process.exit(1);
  })
})
