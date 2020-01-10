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
  serializeDream(dream) {
    return {
      id: xss(dream.id),
      title: xss(dream.title),
      dream_date: xss(dream.dream_date),
      dream_type: xss(dream.dream_type),
      hours_slept: xss(dream.hours_slept),
      info: xss(dream.info),
      is_private: dream.is_private
    };
  },
  doesUserExist(knex, email) {
    return knex
      .from("users")
      .select("*")
      .where("email", email)
      .first();
  },
  doesUserPageExist(knex, id) {
    return knex
      .from("users")
      .select("*")
      .where({ id })
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
  verifyUser(knex, code) {
    return knex
      .from("users")
      .where("verification_code", code)
      .update({ verified: "true", verification_code: "" });
  },
  changeUserEmail(knex, userId, email, verification_code) {
    return knex
      .from("users")
      .where("id", userId)
      .update({ email, verification_code, verified: "false" });
  },
  changeUserPassword(knex, userId, password) {
    return knex
      .from("users")
      .where("id", userId)
      .update({ password });
  },
  findUserPassword(knex, email) {
    return knex
      .from("users")
      .select("*")
      .where("email", email)
      .first();
  },
  insertDream(knex, newDream) {
    return knex
      .insert(newDream)
      .into("users_data")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  findUserDreams(knex, userid) {
    return knex
      .from("users_data")
      .select("*")
      .where({ userid });
  },
  findUserPublicDreams(knex, userid) {
    return knex
      .from("users_data")
      .select("*")
      .where({ userid, is_private: "false" });
  },
  findUserSpecificDream(knex, userid, dreamId) {
    return knex
      .from("users_data")
      .select("*")
      .where({ userid, id: dreamId });
  },
  changeDreamPrivacy(knex, userid, dreamId, is_private) {
    return knex
      .from("users_data")
      .where({ userid, id: dreamId })
      .update({ is_private });
  },
  deleteDream(knex, userid, dreamId) {
    return knex
      .from("users_data")
      .select("*")
      .where({ userid, id: dreamId })
      .delete();
  },
  deleteUser(knex, userID) {
    return knex
      .from("users")
      .select("*")
      .where("id", userID)
      .delete();
  }
};

module.exports = DataService;
