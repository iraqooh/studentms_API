module.exports = {
    HOST: "localhost", // database server's host
    USER: "root",
    PASSWORD: "",
    DB: "studentms",
    dialect: "mysql", // type of database (e.g., 'mysql', 'postgres')
    pool: { // connection pool settings
        // upper limit of simultaneous connections
        max: 5,
        // minimum number of connections in the pool
        min: 0,
        acquire: 30000, // timeout
        idle: 10000, // idle time before a connection is released
    }
}