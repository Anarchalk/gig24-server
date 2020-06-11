// require("dotenv").config();
// const { TEST_DATABASE_URL } = require("../src/config");
// const { expect } = require("chai");
// const knex = require("knex");
// const app = require("../src/app");
// const { makeEmpProfileArray } = require("./emp-profile.fixtures");


// describe("Employer Profile Endpoints", function () {
//   let db;
//   before("make knex instance", () => {
//     db = knex({
//       client: "pg",
//       connection: process.env.TEST_DATABASE_URL,
//     });
//     app.set("db", db);
//   });

//   after("disconnect from db", () => db.destroy());

//     before("create user table", () =>
//     db.raw(
//       `
//         DROP TABLE IF EXISTS emp_profile, users, jobs, applied;
//         CREATE TABLE IF NOT EXISTS users (
//            id SERIAL PRIMARY KEY,
//            fullname TEXT NOT NULL,
//            username TEXT NOT NULL,
//            password VARCHAR NOT NULL,
//            employer BOOLEAN DEFAULT FALSE
//          );
         
//          INSERT INTO users (username, fullname, password, employer)
//            VALUES
//            ('dunder', 'Dunder Mifflin', 'password', FALSE),
//            ('jason', 'Jason Bourne', 'jason', FALSE),
//            ('jasmine', 'Jasmin Guy', 'jasmine', FALSE),
//            ('sam', 'Sam Smith', 'sam', TRUE),
//            ('chris', 'Christopher Nolan', 'chris', TRUE),
//            ('steve', 'Steven Spielberg', 'steve', TRUE);
//          `
//     )
//   );

//   before("create emp_profile table", () =>
//     db.raw(
//       `DROP TABLE IF EXISTS emp_profile;
//        CREATE TABLE emp_profile (
//        id SERIAL PRIMARY KEY,
//        company_name TEXT NOT NULL,
//        phone TEXT NOT NULL,
//        location TEXT NOT NULL,
//        about_us TEXT NOT NULL,
//        email TEXT NOT NULL,
//        fax TEXT,
//        website TEXT NOT NULL,
//        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
//       ); `
//     )
//   );

//   before("clean the table", () => db("emp_profile").truncate());
//   afterEach("cleanup", () => db("emp_profile").truncate());

//   describe(`GET/ empprofile`, () => {
//     context(`Given no employer profile`, () => {
//       it(`responds with 200 and an empty list`, () => {
//         return supertest(app).get("/api/empprofile").expect(200, []);
//       });
//     });
//     context("Given there are employer profiles in the database", () => {
//       const testEmpProfiles = makeEmpProfileArray();
//       beforeEach("insert emp_profile", () => {
//         return db.into("emp_profile").insert(testEmpProfiles);
//       });
//       it("responds with 200 and all of the emp_profiles", () => {
//         return supertest(app)
//           .get("/api/empprofile")
//           .expect(200, testEmpProfiles);
//         // TODO: add more assertions about the body
//       });
//     });
//   });

//   describe(`GET /empprofile/:id`, () => {
//     context(`Given no emp_profile`, () => {
//       context(`Given an XSS attack emp_profile`, () => {
//         const maliciousEmpPro = {
//           id: 666,
//           company_name:
//             'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
//           phone: "333-333-3333",
//           location: "Chicago, IL",
//           about_us: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
//           email: "info@paramount.com",
//           fax: "666-666-6666",
//           website: "http://www.paramount.com",
//           user_id: 1,
//         };
//         beforeEach("insert malicious emp_profile", () => {
//           return db.into("emp_profile").insert([maliciousEmpPro]);
//         });

//         it("removes XSS attack content", () => {
//           return supertest(app)
//             .get(`/api/empprofile/${maliciousEmpPro.id}`)
//             .expect(200)
//             .expect((res) => {
//               expect(res.body.company_name).to.eql(
//                 'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;'
//               );
//               expect(res.body.about_us).to.eql(
//                 `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
//               );
//             });
//         });
//       });
//       it(`responds with 404`, () => {
//         const profileId = 1234;
//         return supertest(app)
//           .get(`/api/empprofile/${profileId}`)
//           .expect(404, {
//             error: { message: `Profile doesn't exist` },
//           });
//       });
//     });
//     context("Given there are emp_profiles in the database", () => {
//       const testEmpPros = makeEmpProfileArray();

//       beforeEach("insert emp_profile", () => {
//         return db.into("emp_profile").insert(testEmpPros);
//       });
//       it("It responds with 200 and the specified event", () => {
//         const profileId = 2;
//         const expectedEmpPro = testEmpPros[profileId - 1];
//         return supertest(app)
//           .get(`/api/empprofile/${profileId}`)
//           .expect(200, expectedEmpPro);
//       });
//     });
//   });

//   describe(`POST /empprofile`, () => {
//     it(`It creates an emp_profile, responding with 201 and the new emp_profile`, function () {
//       this.retries(3);
//       const newEmpPro = {
//         company_name:
//           'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
//         phone: "333-333-3333",
//         location: "Chicago, IL",
//         about_us: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
//         email: "info@paramount.com",
//         fax: "666-666-6666",
//         website: "http://www.paramount.com",
//         user_id: 1,
//       };
//       return supertest(app)
//         .post("/api/empprofile")
//         .send(newEmpPro)
//         .expect(201)
//         .expect((res) => {
//           expect(res.body.company_name).to.eql(newEmpPro.company_name);
//           expect(res.body.phone).to.eql(newEmpPro.phone);
//           expect(res.body.location).to.eql(newEmpPro.location);
//           expect(res.body.about_us).to.eql(newEmpPro.about_us);
//           expect(res.body.email).to.eql(newEmpPro.email);
//           expect(res.body.fax).to.eql(newEmpPro.fax);
//           expect(res.body.website).to.eql(newEmpPro.website);
//           expect(res.body.user_id).to.eql(newEmpPro.user_id);
//           expect(res.body).to.have.property("id");
//           expect(res.headers.location).to.eql(`/api/empprofile/${res.body.id}`);
//         })
//         .then((empProRes) =>
//           supertest(app)
//             .get(`/api/empprofile/${empProRes.body.id}`)
//             .expect(empProRes.body)
//         );
//     });
//     const requiredFields = [
//       'company_name',
//       'about_us',
//       'email',
//       'phone',
//       'location',
//       'fax',
//       'website',
//       'user_id',
//     ];
//     requiredFields.forEach((field) => {
//       const newEmpPro = {
//         company_name:
//           'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
//         about_us: `Lorem ipsum dolor sit amet consectetur adipisius veniam consectetur tempora, corporis obcaectenetur, uamListicle`,
//         email: "info@paramount.com",
//         phone: "333-333-3333",
//         location: "Chicago, IL",
//         fax:'666-666-6666',
//         website: "http://www.paramount.com",
//         user_id: 1,
//       };
//       it(`responds with 400 and an error message when the '${field}' is missing`, () => {
//         delete newEmpPro[field];

//         return supertest(app)
//           .post("/api/empprofile")
//           .send(newEmpPro)
//           .expect(400, {
//             error: { message: `Missing '${field}' in request body` },
//           });
//       });
//     });
//   });

//     describe(`DELETE /api/empprofile/:id`, () => {
//       context(`Given no emp_profile`, () => {
//         it(`responds with 404`, () => {
//           const profileId = 1234;
//           return supertest(app)
//             .delete(`/api/empprofile/${profileId}`)
//             .expect(404, { error: { message: `Profile doesn't exist` } });
//         });
//       });
//       context("Given there are employer profiles in the database", () => {
//         const testEmpPro = makeEmpProfileArray();

//         beforeEach("insert emp_profile", () => {
//           return db.into("emp_profile").insert(testEmpPro);
//         });

//         it("responds with 204 and removes the emp_profile", () => {
//           const idToRemove = 2;
//           const expectedEmpPro = testEmpPro.filter((emppro) => emppro.id !== idToRemove);
//           return supertest(app)
//             .delete(`/api/empprofile/${idToRemove}`)
//             .expect(204)
//             .then((res) => supertest(app).get(`/api/empprofile`).expect(expectedEmpPro));
//         });
//       });
//     });
// });
