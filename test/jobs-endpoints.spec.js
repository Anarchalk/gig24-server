require("dotenv").config();
const { TEST_DATABASE_URL } = require("../src/config");
const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const { makeJobsArray } = require("./jobs.fixtures");

describe("Jobs Endpoints", function () {
  let db;
  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("create users table", () =>
    db.raw(
      `
        DROP TABLE IF EXISTS jobs, users, emp_profile;
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
        );`
    )
  );

  before("clean the table", () => db("jobs").truncate());
  afterEach("cleanup", () => db("jobs").truncate());

  describe(`GET/ jobs`, () => {
    context(`Given no jobs`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app).get("/api/jobs").expect(200, []);
      });
    });
    context("Given there are jobs in the database", () => {
      const testJobs = makeJobsArray();
      beforeEach("insert jobs", () => {
        return db.into("jobs").insert(testJobs);
      });
      it("responds with 200 and all of the jobs", () => {
        return supertest(app).get("/api/jobs").expect(200, testJobs);
        // TODO: add more assertions about the body
      });
    });
  });

  describe(`GET /jobs/:job_id`, () => {
    context(`Given no jobs`, () => {
      context(`Given an XSS attack article`, () => {
        const maliciousJob = {
          id: 911,
          position: "Key Grip",
          title:
            'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
          description: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
          type: "union",
          requirements: "Must drive",
          member: true,
          location: "1234 Atlantic Street",
          pay: "50",
          duration: "5",
          unit: "weeks",
          user_id: 1,
        };
        beforeEach("insert malicious job", () => {
          return db.into("jobs").insert([maliciousJob]);
        });

        it("removes XSS attack content", () => {
          return supertest(app)
            .get(`/api/jobs/${maliciousJob.id}`)
            .expect(200)
            .expect((res) => {
              expect(res.body.title).to.eql(
                'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;'
              );
              expect(res.body.description).to.eql(
                `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
              );
            });
        });
      });
      it(`responds with 404`, () => {
        const jobId = 1234;
        return supertest(app)
          .get(`/api/jobs/${jobId}`)
          .expect(404, { error: { message: `Job doesn't exist` } });
      });
    });
    context("Given there are jobs in the database", () => {
      const testJobs = makeJobsArray();

      beforeEach("insert jobs", () => {
        return db.into("jobs").insert(testJobs);
      });
      it("It responds with 200 and the specified event", () => {
        const jobId = 2;
        const expectedJob = testJobs[jobId - 1];
        return supertest(app)
          .get(`/api/jobs/${jobId}`)
          .expect(200, expectedJob);
      });
    });
  });
  
  describe(`POST /jobs`, () => {
    it(`It creates an job, responding with 201 and the new job`, function () {
      this.retries(3);
      const newJob = {
        position: "Key Grip",
        title:
          'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
        description: `Lorem ipsum dolor sit amet consectetur adipisius veniam consectetur tempora, corporis obcaectenetur, uamListicle`,
        type: "union",
        requirements: "Must drive",
        member: true,
        location: "1234 Atlantic Street",
        pay: "50",
        duration: "5",
        unit: "weeks",
        user_id: 1,
      };
      return supertest(app)
        .post("/api/jobs")
        .send(newJob)
        .expect(201)
        .expect((res) => {
          expect(res.body.postion).to.eql(newJob.postion);
          expect(res.body.title).to.eql(newJob.title);
          expect(res.body.description).to.eql(newJob.description);
          expect(res.body.type).to.eql(newJob.type);
          expect(res.body.requirements).to.eql(newJob.requirements);
          expect(res.body.member).to.eql(newJob.member);
          expect(res.body.location).to.eql(newJob.location);
          expect(res.body.pay).to.eql(newJob.pay);
          expect(res.body.duration).to.eql(newJob.duration);
          expect(res.body.unit).to.eql(newJob.unit);
          expect(res.body.user_id).to.eql(newJob.user_id);
          expect(res.body).to.have.property("id");
          expect(res.headers.location).to.eql(`/api/jobs/${res.body.id}`);
        })
        .then((jobRes) =>
          supertest(app).get(`/api/jobs/${jobRes.body.id}`).expect(jobRes.body)
        );
    });
    const requiredFields = [
      "position",
      "title",
      "description",
      "requirements",
      "type",
      "location",
      "pay",
      "duration",
      "unit",
      "user_id",
    ];
    requiredFields.forEach((field) => {
      const newJob = {
        position: "Key Grip",
        title:
          'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
        description: `Lorem ipsum dolor sit amet consectetur adipisius veniam consectetur tempora, corporis obcaectenetur, uamListicle`,
        type: "union",
        requirements: "Must drive",
        member: true,
        location: "1234 Atlantic Street",
        pay: "50",
        duration: "5",
        unit: "weeks",
        user_id: 1,
      };
      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newJob[field];

        return supertest(app)
          .post("/api/jobs")
          .send(newJob)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` },
          });
      });
    });
  });

  describe(`DELETE /api/jobs/:job_id`, () => {
    context(`Given no jobs`, () => {
      it(`responds with 404`, () => {
        const jobId = 1234;
        return supertest(app)
          .delete(`/api/jobs/${jobId}`)
          .expect(404, { error: { message: `Job doesn't exist` } });
      });
    });
    context("Given there are jobs in the database", () => {
      const testJobs = makeJobsArray();

      beforeEach("insert jobs", () => {
        return db.into("jobs").insert(testJobs);
      });

      it("responds with 204 and removes the job", () => {
        const idToRemove = 2;
        const expectedJobs = testJobs.filter((job) => job.id !== idToRemove);
        return supertest(app)
          .delete(`/api/jobs/${idToRemove}`)
          .expect(204)
          .then((res) => supertest(app).get(`/api/jobs`).expect(expectedJobs));
      });
    });
  });
});
