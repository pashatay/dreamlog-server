const xss = require("xss");
const DataService = {
  serializeUser(user) {
    return {
      id: xss(user.id),
      name: xss(user.name),
      email: xss(user.email),
      password: xss(user.password),
      verified: xss(user.verified),
      verification_code: xss(user.verification_code)
    };
  },
  doesUserExist(knex, id) {
    return knex
      .from("users")
      .select("*")
      .where("id", id)
      .first();
  },
  insertUser(knex, newUser) {
    return knex
      .insert(newUser)
      .into("users")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  findUserPassword(knex, email) {
    return knex
      .from("users")
      .select("*")
      .where("email", email)
      .first();
  }
};

module.exports = DataService;
