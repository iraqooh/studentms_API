// create and export a function that takes sequelize instance and
// sequelize library as arguments and returns a definition of a
// student model
module.exports = (sequelize, sequelize_config) => {
    // define a new model named 'student', will become 'students' in the database
    const Student = sequelize_config.define('student', {
        student_id: {
            type: sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        first_name: {
            type: sequelize.STRING,
            allowNull: false
        },
        last_name: {
            type: sequelize.STRING,
            allowNull: false
        },
        gender: {
            type: sequelize.ENUM,
            values: ['Female', 'Male'],
            default: 'Female'
        },
        registered: {
            type: sequelize.ENUM,
            values: ['false', 'true'],
            default: 'false'
        }, 
        program: {
            type: sequelize.STRING,
            allowNull: false,
        },
        class: {
            type: sequelize.STRING
        }
    });

    // const payment = require('./student_payment.model')(sequelize, sequelize_config)
    // Student.hasMany(payment)

    // return the defined Student model. 
    // This makes the model available for use when the function is invoked from index.js
    return Student;
}