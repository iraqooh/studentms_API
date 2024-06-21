const instructor = require('./instructor.model')

module.exports = (sequelize_config, sequelize) => {
    const course = sequelize_config.define('course', {
        course_id: {
            type: sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        instructor_id: {
            type: sequelize.INTEGER,
            allowNull: false,
            reference: {
                model: instructor,
                key: 'instructor_id'
            }
        },
        department: {
            type: sequelize.ENUM,
            values: ['SCIENCES', 'ARTS'],
            allowNull: false
        },
        course_name: {
            type: sequelize.STRING,
            allowNull: false
        },
        description: {
            type: sequelize.TEXT
        },
        credits: {
            type: sequelize.INTEGER,
            min: 3,
            allowNull: false
        }
      });

    return course;
}