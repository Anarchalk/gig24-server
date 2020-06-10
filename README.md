# GIG 24 App

 The GIG 24 is the one stop shop for PA and film production jobs. Search for gigs and submit your resume today! 


* * *

## LINK TO LIVE APP

https://parent-connect-app.now.sh/


***

## TECHNOLOGIES USED

* Node
* Express Framework
* Bcrypt
* Jwt Security
* Chai
* Mocha
* Knex

***

## FUNCTIONALITY

The app uses GET requests to pull the events from the database. 
The app uses POST requests get sent to the database for:
  - Adding users 
  - Creating a new event 
  - Logging a user in 
  - Creating a new user
  - Joining event
The app uses DELETE requests when user unjoin from the event. 
The app uses PATCH requests when updating details of the event.

***

USERS
Allows users to create accounts

  fullname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },


EVENTS
Allows users to create event with title, description, date and time, address and type of event.

  title: { type: String, required: true },
  description: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  type: { type: String, required: true },
  time_of_event: { type: String, required: true }

***

## API Overview

Events
GET
<blockquote>
@route   GET api/events/
@desc    Gets all events 
@access  Public

route.get('/', EventsService.getAllEvent);
</blockquote>
GET 

@route   GET api/events/:id/
@desc    Gets event by id
@access  Private

route.get('/:id', EventsService.getEventById);

PATCH

@route   PATCH api/events/:id/
@desc    Allows users to update event details
@access  Private

router.patch('/:id, EventsService.updateEvent')

Attend
DELETE

@route   Delete api/attend/
@desc    Allows users to unjoin from event
@access  Private

route.get('/:id', AttendService.deleteAttend);
POST

@route   POST api/attend/
@desc    Allows users to join events
@access  Private

route.get

Users
POST

@route   GET /api/users/signup
@desc    Allows users to create account
@access  Public


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
