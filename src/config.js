module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DB_URL: process.env.DB_URL || "postgresql://postgres@localhost/dreamlog",
  JWT_KEY: process.env.JWT_KEY || "Newyork",
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || "76Jy8.9Ioo"
};
