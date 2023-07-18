module.exports = {
    HOST: 'localhost',
    USER: 'root',
    PASSWORD: 'Lety@18_09',
    DB: 'payment',
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };