# GIG 24 App

 The GIG 24 is the one stop shop for Production Assistant and film production jobs. Search for gigs and submit your resume today! 


* * *

## LINK TO LIVE APP

https://gig24-app.now.sh/


***

## TECHNOLOGIES USED

* Node
* React
* Express Framework
* Bcrypt
* Jwt Security
* Chai
* Mocha
* Knex

***

## FUNCTIONALITY

The app uses GET requests to pull the jobs, applied jobs, users, user profiles, employer profiles from the database. 
The app uses POST requests get sent to the database for:

  - Adding users 
  - Creating a new jobs 
  - Logging a user in 
  - Creating a new profiles
  - Applying for new jobs
 
The app uses DELETE requests when employer deletes their own job posts. 
The app uses PATCH requests when updating details of the user and employer profiles.

***

USERS
Allows users to create accounts

  fullname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },


USER PROFILE
Allows user- job seekers to create profile with name, about me, education, phone, IMDB credit, email, skillset, location.

  name: { type: String, required: true },
  about me: { type: String, required: true },
  education: { type: String, required: true },
  location: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  IMDB credit: { type: String, required: false }
  skillset: { type: String, required: true }

***

EMPLOYER PROFILE
Allows user-employers to create profile with company name, about us, phone, fax, email, website, location.

  company name: { type: String, required: true },
  about us: { type: String, required: true },
  fax: { type: String, required: true },
  location: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  website: { type: String, required: false }

***

EMPLOYER CREATE JOB POST
Allows user-employers to create job post with position, title, type, requirements, description, member, location, pay, duration, unit.

  position: { type: String, required: true },
  title: { type: String, required: true },
  type: { type: String, required: true },
  location: { type: String, required: true },
  requirements: { type: String, required: true },
  description: { type: String, required: true },
  pay: { type: String, required: true },
  duration: { type: String, required: true },
  unit: { type: String, required: false },
  member: { type: String, required: false }

***

## API Overview

Jobs
GET
<blockquote>
@route   GET api/jobs/
@desc    Gets all jobs 
@access  Private

route.get('/', JobsService.getAllJobs);
</blockquote>

GET 

@route   GET api/gigs/:id/
@desc    Gets job by id
@access  Private

route.get('/:id', JobsService.getGigs);

PATCH

@route   PATCH /api/userprofile/:id/
@desc    Allows users to update user profile
@access  Private

router.patch('/:id, UserProfileService.updateProfile')

Jobs
DELETE

@route   Delete api/jobs/
@desc    Allows employer to delete jobs that they posted
@access  Private

route.get('/:id',  JobsService.deleteJob);

POST

@route   POST api/login/
@desc    Allows users to login
@access  Public

route.get ('/login', AuthService.getUserWithUserName)

POST

@route   POST api/signup
@desc    Allows users to signup
@access  Public

route.get ('/signup', UsersService.insertUser)

Users
POST

@route   GET /api/applied
@desc    Allows users to apply for jobs
@access  Private

route.get ('/applied', AppliedService.insertApplication)

***

## SCREENSHOT

### 1. Landing Page

![logo](https://raw.githubusercontent.com/Anarchalk/gig24-client/master/screenshots/landing.JPG "Landing Page")

### 2.POST A GIG Page

![logo](https://raw.githubusercontent.com/Anarchalk/gig24-client/master/screenshots/postgig.JPG "Post a gig Page")

### 3.JOB SEEKER HOME Page
![logo](https://raw.githubusercontent.com/Anarchalk/gig24-client/master/screenshots/jshome.JPG "Job Seeker home view")

### 4. EMPLOYER DASHBOARD Page

![logo](https://raw.githubusercontent.com/Anarchalk/gig24-client/master/screenshots/employer-dash.JPG "Employer Dashboard")

***

## DOCUMENTATION
You can find detailed development documentation from the link below:
https://gist.github.com/Anarchalk/450fdadd3d1daa9a4fa7b28672425824
