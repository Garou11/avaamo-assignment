const express = require('express');
const multer = require('multer');
const path = require('path');
const fileRouter = require('./router/fileRouter');
const app = express();

app.use(express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.use('/file', fileRouter);


app.get('/health', (req,res)=> {
  res.status(200).send('Success')
})


app.listen(4000, () => {
  console.log('Server is running on port 4000');
});