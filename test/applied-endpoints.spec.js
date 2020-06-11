require("dotenv").config();
const { TEST_DATABASE_URL } = require("../src/config");
const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const { makeAppliedArray } = require("./applied.fixtures");

describe("Applied Endpoints", function () {
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
        DROP TABLE IF EXISTS emp_profile, users, jobs, applied, user_profile;
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

  before("create jobs table", () =>
    db.raw(
      `DROP TABLE IF EXISTS jobs;
        CREATE TABLE jobs (
          id SERIAL PRIMARY KEY,
          position TEXT NOT NULL,
          title TEXT NOT NULL,
          type TEXT NOT NULL,
          requirements TEXT NOT NULL,
          description TEXT NOT NULL,
          member BOOLEAN,
          location TEXT NOT NULL,
          pay TEXT NOT NULL,
          duration TEXT NOT NULL,
          unit TEXT,
          user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
        );
        INSERT INTO jobs ( position, title, type, requirements, description, member, location, pay, duration, unit, user_id)
        VALUES
          ('Key grip', '10 Days Around the States', 'Travel Show','Experienced','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', TRUE, 'East Coast', 'low-budget', '6','Days', 4 ),
          ('Editor','How To Not Become Like Your Dad', 'Independent film','Good Communication skills',' Quis lectus nulla at volutpat diam. Ornare arcu dui vivamus arcu felis bibendum ut tristique. Molestie at elementum eu facilisis. Sem integer ', FALSE ,'New York', 'Full-time', '2' ,'week', 5),
          ('Actor',' Finding Daniel Russo','Documentary','Ullamcorper velit sed ullamcorper morbi tincidunt ornare massa eget ', 'Purus non enim praesent elementum facilisis leo vel fringilla est. ' , TRUE, 'Atlanta, GA' ,'part-time', '12', 'months', 6);
        
        `
    )
  );

  before("create applied table", () =>
    db.raw(
      `DROP TABLE IF EXISTS applied;
       CREATE TABLE applied (
        id SERIAL PRIMARY KEY,
        completed BOOLEAN DEFAULT FALSE,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        job_id INTEGER REFERENCES jobs(id) ON DELETE SET NULL,
        UNIQUE(user_id, job_id)
      ); `
    )
  );

  before("clean the table", () => db("applied").truncate());
  afterEach("cleanup", () => db("applied").truncate());

  describe(`GET/ applied`, () => {
    context(`Given no applied user`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app).get("/api/applied").expect(200, []);
      });
    });
    context("Given there are applied users in the database", () => {
      const testAppliedUser = makeAppliedArray();
      beforeEach("insert applied", () => {
        return db.into("applied").insert(testAppliedUser);
      });
      it("responds with 200 and all of the applied", () => {
        return supertest(app).get("/api/applied").expect(200, testAppliedUser);
        // TODO: add more assertions about the body
      });
    });
  });

  describe(`GET /applied/:id`, () => {
    context(`Given no application`, () => {
      it(`responds with 404`, () => {
        const appliedId = 1234;
        return supertest(app)
          .get(`/api/applied/${appliedId}`)
          .expect(404, {
            error: { message: `Application doesn't exist` },
          });
      });
    });
    context("Given there are applied users in the database", () => {
      const testApplied = makeAppliedArray();

      beforeEach("insert applied", () => {
        return db.into("applied").insert(testApplied);
      });
      it("It responds with 200 and the specified applied", () => {
        const applieduserId = 2;
        const expectedApplied = testApplied[applieduserId - 1];
        return supertest(app)
          .get(`/api/applied/${applieduserId}`)
          .expect(200, expectedApplied);
      });
    });
  });

  describe(`POST /applied`, () => {
    it(`It creates an applied, responding with 201 and the new applied`, function () {
      const newApplied = {
         
          completed: false,
          job_id: 2,
          user_id: 1
      };
      return supertest(app)
        .post("/api/applied")
        .send(newApplied)
        .expect(201)
        .expect((res) => {
          expect(res.body.completed).to.eql(newApplied.completed);
          expect(res.body.job_id).to.eql(newApplied.job_id);
          expect(res.body.user_id).to.eql(newApplied.user_id);
          expect(res.body).to.have.property("id");
          expect(res.headers.location).to.eql(`/api/applied/${res.body.id}`);
        })
        .then((appliedRes) =>
          supertest(app)
            .get(`/api/applied/${appliedRes.body.id}`)
            .expect(appliedRes.body)
        );
    });
    const requiredFields = ["job_id", "user_id", "completed"];
    requiredFields.forEach((field) => {
      const newApplied = {
         
          completed: false,
          user_id: 2,
          job_id: 2
      };
      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newApplied[field];

        return supertest(app)
          .post("/api/applied")
          .send(newApplied)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` },
          });
      });
    });
  });

  //I will add more feature in the future
});
