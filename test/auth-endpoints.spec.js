require("dotenv").config();
const { TEST_DATABASE_URL } = require("../src/config");
const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const { makeAuthArray } = require("./auth.fixtures");

describe("Auth Endpoints", function () {
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

});
