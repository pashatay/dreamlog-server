module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL:
    process.env.DATABASE_URL || "postgresql://postgres@localhost/dreamlog",
  TEST_DATABASE_URL:
    process.env.TEST_DATABASE_URL ||
    "postgresql://postgres@localhost/dreamlog-test",
  JWT_KEY: process.env.JWT_KEY || "Newyork",
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || "76Jy8.9Ioo"
};
