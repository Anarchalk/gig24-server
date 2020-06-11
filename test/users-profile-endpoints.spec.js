require("dotenv").config();
const { TEST_DATABASE_URL } = require("../src/config");
const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const { makeUsersProfileArray } = require("./users-profile.fixtures");

describe("Users Profile Endpoints", function () {
  let db;
  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("create user table", () =>
    db.raw(
      `
          DROP TABLE IF EXISTS user_profile, users, jobs, applied, emp_profile;
          CREATE TABLE IF NOT EXISTS users (
             id SERIAL PRIMARY KEY,
             fullname TEXT NOT NULL,
             username TEXT NOT NULL,
             password VARCHAR NOT NULL,
             employer BOOLEAN DEFAULT FALSE
           );
           
           INSERT INTO users (username, fullname, password, employer)
             VALUES
             ('dunder', 'Dunder Mifflin', 'password', FALSE),
             ('jason', 'Jason Bourne', 'jason', FALSE),
             ('jasmine', 'Jasmin Guy', 'jasmine', FALSE),
             ('sam', 'Sam Smith', 'sam', TRUE),
             ('chris', 'Christopher Nolan', 'chris', TRUE),
             ('steve', 'Steven Spielberg', 'steve', TRUE);
           `
    )
  );

  before("create user_profile table", () =>
    db.raw(
      `DROP TABLE IF EXISTS user_profile;
         CREATE TABLE user_profile (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          position TEXT NOT NULL,
          location TEXT NOT NULL,
          photo TEXT,
          about_me TEXT NOT NULL,
          education TEXT,
          phone TEXT,
          email TEXT NOT NULL,
          imdb TEXT ,
          skillset TEXT,
          user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
        ); `
    )
  );

  before("clean the table", () => db("user_profile").truncate());
  afterEach("cleanup", () => db("user_profile").truncate());

  describe(`GET/ userprofile`, () => {
    context(`Given no users profile`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app).get("/api/userprofile").expect(200, []);
      });
    });
    context("Given there are user profiles in the database", () => {
      const testUsersProfile = makeUsersProfileArray();
      beforeEach("insert user_profile", () => {
        return db.into("user_profile").insert(testUsersProfile);
      });
      it("responds with 200 and all of the user_profiles", () => {
        return supertest(app)
          .get("/api/userprofile")
          .expect(200, testUsersProfile);
        // TODO: add more assertions about the body
      });
    });
  });

  describe(`GET /userprofile/:id`, () => {
    context(`Given no user_profile`, () => {
      context(`Given an XSS attack user_profile`, () => {
        const maliciousUserPro = {
          id: 666,
          name: "Helen",
          about_me: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
          position:
            'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
          education: "some school",
          email: "info@paramount.com",
          phone: "333-333-3333",
          photo: null,
          location: "Chicago, IL",
          imdb: "N/A",
          skillset: "cinematography",
          user_id: 1,
        };
        beforeEach("insert malicious user_profile", () => {
          return db.into("user_profile").insert([maliciousUserPro]);
        });

        it("removes XSS attack content", () => {
          return supertest(app)
            .get(`/api/userprofile/${maliciousUserPro.id}`)
            .expect(200)
            .expect((res) => {
              expect(res.body.position).to.eql(
                'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;'
              );
              expect(res.body.about_me).to.eql(
                `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
              );
            });
        });
      });

      it(`responds with 404`, () => {
        const userProfileId = 1234;
        return supertest(app)
          .get(`/api/userprofile/${userProfileId}`)
          .expect(404, {
            error: { message: `Profile doesn't exist` },
          });
      });
    });
    context("Given there are user_profiles in the database", () => {
      const testUserPros = makeUsersProfileArray();

      beforeEach("insert user_profile", () => {
        return db.into("user_profile").insert(testUserPros);
      });
      it("It responds with 200 and the specified user", () => {
        const UserProfileId = 2;
        const expectedUserPro = testUserPros[UserProfileId - 1];
        return supertest(app)
          .get(`/api/userprofile/${UserProfileId}`)
          .expect(200, expectedUserPro);
      });
    });
  });

  describe(`POST /userprofile`, () => {
    it(`It creates an user_profile, responding with 201 and the new user_profile`, function () {
      this.retries(3);
      const newUserPro = {
        name: "Helen",
        about_me: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
        position:
          'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
        education: "some school",
        email: "info@paramount.com",
        phone: "333-333-3333",
        photo: null,
        location: "Chicago, IL",
        imdb: "N/A",
        skillset: "cinematography",
        user_id: 1,
      };
      return supertest(app)
        .post("/api/userprofile")
        .send(newUserPro)
        .expect(201)
        .expect((res) => {
          expect(res.body.name).to.eql(newUserPro.name);
          expect(res.body.about_me).to.eql(newUserPro.about_me);
          expect(res.body.position).to.eql(newUserPro.position);
          expect(res.body.education).to.eql(newUserPro.education);
          expect(res.body.email).to.eql(newUserPro.email);
          expect(res.body.phone).to.eql(newUserPro.phone);
          expect(res.body.location).to.eql(newUserPro.location);
          expect(res.body.imdb).to.eql(newUserPro.imdb);
          expect(res.body.skillset).to.eql(newUserPro.skillset);
          expect(res.body.user_id).to.eql(newUserPro.user_id);
          expect(res.body).to.have.property("id");
          expect(res.headers.location).to.eql(
            `/api/userprofile/${res.body.id}`
          );
        })
        .then((userProRes) =>
          supertest(app)
            .get(`/api/userprofile/${userProRes.body.id}`)
            .expect(userProRes.body)
        );
    });
    const requiredFields = [ 
          'name',
          'about_me',
          'position',
          // photo,
          'education',
          'email',
          'phone',
          'location',
          'imdb',
          'skillset',
          'user_id',
    ];
    requiredFields.forEach((field) => {
      const newUserPro = {
        name: "Helen",
        about_me: 'I am San Francisco based filmmaker',
        position: 'Director & Writer',
        education: "some school",
        email: "info@paramount.com",
        phone: "333-333-3333",
        photo: null,
        location: "Chicago, IL",
        imdb: "N/A",
        skillset: "cinematography",
        user_id: 1,
      };
      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newUserPro[field];

        return supertest(app)
          .post("/api/userprofile")
          .send(newUserPro)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` },
          });
      });
    });
  });

    describe(`DELETE /api/userprofile/:id`, () => {
      context(`Given no user_profile`, () => {
        it(`responds with 404`, () => {
          const userProfileId = 1234;
          return supertest(app)
            .delete(`/api/userprofile/${userProfileId}`)
            .expect(404, { error: { message: `Profile doesn't exist` } });
        });
      });
      context("Given there are user profiles in the database", () => {
        const testUserPro = makeUsersProfileArray();

        beforeEach("insert user_profile", () => {
          return db.into("user_profile").insert(testUserPro);
        });

        it("responds with 204 and removes the user_profile", () => {
          const idToRemove = 2;
          const expectedUserPro = testUserPro.filter((userpro) => userpro.id !== idToRemove);
          return supertest(app)
            .delete(`/api/userprofile/${idToRemove}`)
            .expect(204)
            .then((res) => supertest(app).get(`/api/userprofile`).expect(expectedUserPro));
        });
      });
    });
});
