module.exports = (sequelize, Sequelize) => {
    const db = require("./index")
    const course = sequelize.define('course', {
        course_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        instructor_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: db.instructors,
                key: 'instructor_id'
            }
        },
        department: {
            type: Sequelize.ENUM,
            values: ['SCIENCES', 'ARTS'],
            allowNull: false
        },
        course_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT
        },
        credits: {
            type: Sequelize.INTEGER,
            min: 3,
            allowNull: false
        }
      });

    return course;
}