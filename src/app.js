require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require('./config')
const errorHandler = require('./error-handler')


const appliedRouter = require('./applied/applied-router')
const jobsRouter = require('./jobs/jobs-router')
const usersRouter = require('./users/users-router')
const authRouter = require('./auth/auth-router')
const userProfileRouter = require('./userprofile/user-profile-router');
const empProfileRouter = require('./empprofile/emp-profile-router');


const app = express();
const morganOption = (NODE_ENV === 'production') ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());

app.use('/api/jobs', jobsRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/applied', appliedRouter);
app.use('/api/userprofile', userProfileRouter);
app.use('/api/empprofile', empProfileRouter);


app.get("/", (req, res) => {
  res.send("Hello, world!");
});



app.use(errorHandler)

module.exports = app;
