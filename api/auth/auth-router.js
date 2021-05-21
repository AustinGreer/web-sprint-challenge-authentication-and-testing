const bcrypt = require('bcryptjs');
const tokenBuilder = require('./generateToken')
const secrets = require('../config');
const {checkPayload, checkUniqueName} = require('../middleware/auth-middleware');
const User = require('./auth-model')
const router = require('express').Router();

// post - register a new user
router.post('/register', checkPayload, checkUniqueName, (req, res, next) => {
    const { password } = req.body

    const hash = bcrypt.hashSync(password, 8)

    req.body.password = hash

    User.add(req.body)
      .then(user => {
        res.status(201).json(user)
      })
      .catch(err => {
        next(err)
      })
});

// post - login as an existing user
router.post('/login', checkPayload, (req, res, next) => {
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */

    const { username, password } = req.body 

    User.findBy({username})
      .then(([existing]) => {
        if (existing && bcrypt.compareSync(password, existing.password)) {
          const token = tokenBuilder(existing)
          res.status(200).json({
            message: `Welcome, ${existing.username}`,
            token: token
          })
        } else {
          next({
            status: 401,
            message: 'invalid credentials'
          })
        }
      })
      .catch(err => {
        next(err)
      }) 
});

module.exports = router;
