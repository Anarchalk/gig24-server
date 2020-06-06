const express = require("express");
const xss = require("xss");

const EmpProfileService = require("./emp-profile-service");
const { requireAuth } = require('../middleware/jwt-auth')
const empProfileRouter = express.Router();
const jsonParser = express.json();

//serialize profile in case of xss attack
const serializeProfile = (profile) => ({
    id: profile.id,
    company_name: profile.company_name,
    about_us: xss(profile.about_us),
    website: profile.website,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    fax: profile.fax,
    logo: profile.logo,
    user_id: profile.user_id
  });
  
empProfileRouter
.route("/")
.get((req, res, next) => {
  const knexInstance = req.app.get("db");
  EmpProfileService.getAllProfiles(knexInstance)
    .then((profiles) => {
      res.json(profiles.map(serializeProfile));
    })
    .catch(next);
})

.post(jsonParser, (req, res, next) => {
  const knexInstance = req.app.get("db");
  const {
    company_name,
    about_us,
    //logo,
    email,
    phone,
    location,
    fax,
    website,
    user_id
  } = req.body
  const newProfile = {
    company_name,
    about_us,
    //logo,
    email,
    phone,
    location,
    fax,
    website,
    user_id
  };

  //each value in new profile is required, verify that they were sent
  for (const [key, value] of Object.entries(newProfile)) {
    if (value == null) {
      return res.status(400).json({
        error: { message: `Missing '${key}' in request body` }
      })
    }
  }

  EmpProfileService.insertProfile(knexInstance, newProfile)
    .then((profile) => {
      res
        .status(201)
        .location(req.originalUrl + `/${profile.id}`)
        .json(serializeProfile(profile));
    })
    .catch(next);
});

empProfileRouter
.route('/emp/:id')
.get((req, res) => {
  const knexInstance = req.app.get("db");
  const user_id = req.params.id;
  EmpProfileService.getProfileByUser(knexInstance, user_id)
  .then((profile) => {
    if (!profile) {
      return res.status(404).json({
        error: { message: `Profile doesn't exist` },
      });
    }
    res.json(profile)

  })
  .catch((error)=> console.log(error));
})

//get, update, or delete specific profile
empProfileRouter
.route("/:id")
.all((req, res, next) => {
  const knexInstance = req.app.get("db");
  const profileId = req.params.id;

  EmpProfileService.getProfileById(knexInstance, profileId)
    .then((profile) => {
      if (!profile) {
        return res.status(404).json({
          error: { message: `Profile doesn't exist` },
        });
      }
      res.profile = profile
      next();
    })
    .catch(next);
})
.get((req, res, next) => {
  res.json(serializeProfile(res.profile));
})
.delete((req, res, next) => {
  const knexInstance = req.app.get("db");
  const deleteProfileId = req.params.id;
  // console.log(deleteProfileId)
  EmpProfileService.deleteProfile(knexInstance, deleteProfileId)
    .then(() => res.status(204).end())
    .catch(next);
})

.patch(jsonParser, (req, res, next) => {
    // res.json('Patch')
  const knexInstance = req.app.get('db');
  const deleteProfileId = req.params.id;
  const { company_name, about_us, logo, email, phone, location, fax, website, user_id } = req.body;
  const updatedProfile = { company_name, about_us, logo, email, phone, location, fax, website, user_id };
// console.log(updatedProfile)
  //check that at least one field is getting updated in order to patch
  const numberOfValues = Object.values(updatedProfile).filter(Boolean).length
  if(numberOfValues === 0){
      return res.status(400).json({
          error: { message: `Request body must contain either name, about_me, photo, education, duration, location, imdb, skillset'`}
      });
  }

  // updatedEvent.time_of_event = new Date();
  // console.log(updateEventId, updatedEvent)
  EmpProfileService.updateProfile(knexInstance, deleteProfileId, updatedProfile)
   .then((profile) => res.json(profile))
   .catch(next);
});

module.exports = empProfileRouter;