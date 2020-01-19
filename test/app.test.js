const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const supertest = require("supertest");

describe("Endpoints", () => {
  let verification = "";
  let token = "Bearer ";
  let resetToken = "";
  const user = {
    name: "test",
    email: "test@icloud.com",
    password: "test"
  };
  const userLogin = {
    email: "test@icloud.com",
    password: "test"
  };
  const userDoesntExist = {
    email: "exist@icloud.com",
    password: "test"
  };
  const newTestDream = {
    title: "dream",
    dream_date: "01/31/20",
    dream_type: "Lucid",
    hours_slept: "8",
    info: "beautiful dream",
    is_private: "true"
  };
  const maliciousNewDream = {
    title: 'bad <script>alert("xss");</script>',
    dream_date: "01/31/20",
    dream_type: "Lucid",
    hours_slept: "8",
    info: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    is_private: "true"
  };

  let db;
  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL
    });
    app.set("db", db);
  });
  before("cleanup", () => {
    db.transaction(trx =>
      trx.raw(
        `TRUNCATE
        users,
        users_data`
      )
    );
  });
  after("disconnect from db", () => db.destroy());

  describe("Express App", () => {
    it("should return a message from GET /", () => {
      return supertest(app)
        .get("/")
        .expect(200, "Hello, world!");
    });
  });

  describe("/signup route", () => {
    it("should return an error if get request initiated from signup route", () => {
      return supertest(app)
        .get("/signup")
        .expect(400);
    });

    it("checks if signing up user already exist", () => {
      return supertest(app)
        .post("/signup")
        .send({ user })
        .set("accept", "application/json")
        .expect(400);
    });

    it("should create a new user", () => {
      return supertest(app)
        .post("/signup")
        .send(user)
        .set("accept", "application/json")
        .expect(201)
        .then(res => {
          verification = res.body.verification_code;
        });
    });

    describe("login", () => {
      it("error, must login first", () => {
        return supertest(app)
          .get("/login")
          .expect(400);
      });

      it("error, must verify account first", () => {
        return supertest(app)
          .post("/login")
          .send(userLogin)
          .set("accept", "application/json")
          .expect(403);
      });

      it("error, if login user doesnt exist", () => {
        return supertest(app)
          .post("/login")
          .send(userDoesntExist)
          .set("accept", "application/json")
          .expect(400);
      });

      it("should verify account", () => {
        return supertest(app)
          .get("/verification")
          .query({ code: verification })
          .expect(
            201,
            "<h2>Your email has been verified. You can <a href='https://dreamlog.now.sh/'>login</a> now.</h2>"
          );
      });

      it("Should login succesfully", () => {
        return supertest(app)
          .post("/login")
          .send(userLogin)
          .set("accept", "application/json")
          .expect(200)
          .then(res => {
            token += res.body.token;
          });
      });
    });
  });

  describe("add dreams", () => {
    it("should add a new dream", () => {
      return supertest(app)
        .post("/userpage")
        .set("Authorization", token)
        .send(newTestDream)
        .expect(201);
    });
  });

  describe("XSS attack", () => {
    beforeEach("insert malicious dream", () => {
      return supertest(app)
        .post("/userpage")
        .set("Authorization", token)
        .send(maliciousNewDream)
        .expect(201);
    });
    it("removes xss atack content", () => {
      return supertest(app)
        .get(`/userpage`)
        .set("Authorization", token)
        .expect(res => {
          expect(res.body[1].title).to.eql(
            'bad &lt;script&gt;alert("xss");&lt;/script&gt;'
          );
          expect(res.body[1].info).to.eql(
            `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
          );
        });
    });
  });
  describe("public dream blog", () => {
    it("returns err if blog doesnt't exist", () => {
      return supertest(app)
        .get(`/dreamblog/10`)
        .expect(400);
    });
  });
  describe("reset password", () => {
    it("sends a reset link", () => {
      return supertest(app)
        .post(`/resetpassword/:token`)
        .send({ email: userLogin.email })
        .set("accept", "application/json")
        .expect(201)
        .then(res => {
          resetToken += res.body.token;
        });
    });
    it("resets password", () => {
      return supertest(app)
        .patch(`/resetpassword/${resetToken}`)
        .send({ password: "test2" })
        .set("accept", "application/json")
        .expect(201);
    });
  });
  describe("update userpage", () => {
    it("returns err if email is already in use", () => {
      return supertest(app)
        .patch("/userpage")
        .set("Authorization", token)
        .send({ email: userLogin.email })
        .set("accept", "application/json")
        .expect(400);
    });
    it("changes user email", () => {
      return supertest(app)
        .patch("/userpage")
        .set("Authorization", token)
        .send({ email: "test2@icloud.com" })
        .set("accept", "application/json")
        .expect(201);
    });
    it("changes user password", () => {
      return supertest(app)
        .patch("/userpage")
        .set("Authorization", token)
        .send({ password: "updatepassword" })
        .set("accept", "application/json")
        .expect(201);
    });
  });

  describe("delete page", () => {
    it("deletes user page", () => {
      return supertest(app)
        .delete("/userpage")
        .set("Authorization", token)
        .expect(204);
    });
  });
});
