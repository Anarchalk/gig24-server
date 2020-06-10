const express = require("express");
const xss = require("xss");

const UsersService = require("./users-service");
const usersRouter = express.Router();
const jsonParser = express.json();

//serialize users in case of xss attack
const serializeUser = (user) => ({
  id: user.id,
  fullname: xss(user.fullname),
  username: user.username,
  password: user.password,
  employer: user.employer
});


usersRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    UsersService.getAllUsers(knexInstance)
      .then((users) => {
        res.json(users.map(serializeUser));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get("db");
    const { fullname, username, password, employer } = req.body;

    const newUser = {fullname, username, password, employer };
    console.log(newUser);

    for (const [key, value] of Object.entries(newUser)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }

    UsersService.insertUser(knexInstance, newUser)
      .then((user) => {
        res
          .status(201)
          .location(req.originalUrl + `/${user.id}`)
          .json(serializeUser(user));
      })
      .catch(next);
  });

//get, update, or delete specific event
usersRouter
  .route("/:id")
  .all((req, res, next) => {
    const knexInstance = req.app.get("db");
    const userId = req.params.id;

    UsersService.getUserById(knexInstance, userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            error: { message: `User doesn't exist` },
          });
        }
        res.user = user;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeUser(res.user));
  })
  .delete((req, res, next) => {
    const knexInstance = req.app.get("db");
    const deleteUserId = req.params.id;
    console.log(deleteUserId)
    UsersService.deleteUser(knexInstance, deleteUserId)
      .then(() => res.status(204).end())
      .catch(next);
  })

  .patch(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get('db');
    const updateUserId = req.params.id;
    const { fullname, username, password,employer } = req.body;
    const updatedUser = { fullname, username, password, employer};
 console.log(updatedUser)
    //check that at least one field is getting updated in order to patch
    const numberOfValues = Object.values(updatedUser).filter(Boolean).length
    if(numberOfValues === 0){
        return res.status(400).json({
            error: { message: `Request body must contain either fullname, username or password'`}
        });
    }

console.log(updateUserId, updatedUser)
    UsersService.updateUser(knexInstance, updateUserId, updatedUser)
     .then(() => res.status(204).end())
     .catch(next);
  });

module.exports = usersRouter;