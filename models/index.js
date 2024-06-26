// import db config
const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        port: dbConfig.PORT,
        dialect: dbConfig.dialect,
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
);

sequelize.authenticate().then(
    console.log('Connection has been establised successfully.')
).catch((error) => {
    console.error('Unable to connect to the database: ', error)
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.students = require("./student.model.js")(sequelize, Sequelize);
db.finances = require("./finance.model.js")(sequelize, Sequelize);
db.payments = require("./payment.model.js")(sequelize, Sequelize);
// ----------------------------------------------------------------
db.instructors = require("./instructor.model.js")(sequelize, Sequelize);
db.courses = require("./course.model.js")(sequelize, Sequelize);
// ----------------------------------------------------------------
db.books = require("./book.model.js")(sequelize, Sequelize);
db.rentals = require("./rental.model.js")(sequelize, Sequelize);

// ----------------------------------------------------------------

db.prefects = require("./prefect.model.js")(sequelize, Sequelize);

db.students.hasOne(db.finances, {
    foreignKey: `student_id`,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
});

db.finances.belongsTo(db.students, {
    foreignKey: `student_id`
});

db.students.hasMany(db.payments, {
    foreignKey: `student_id`,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
});

db.payments.belongsTo(db.students, {
    foreignKey: `student_id`
});

db.instructors.hasMany(db.courses, {
    foreignKey: `instructor_id`,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})

db.courses.belongsTo(db.instructors, {
    foreignKey: `instructor_id`
});

db.rentals.belongsTo(db.books, { foreignKey: 'book_id' });
db.rentals.belongsTo(db.students, { foreignKey: 'student_id' });

db.prefects.belongsTo(db.students, {
    foreignKey: 'student_id',
    as: 'student'
})

db.finances.hasMany(db.payments, {
    foreignKey: 'student_id'
})

db.payments.belongsTo(db.finances, { foreignKey: 'student_id' });

module.exports = db;