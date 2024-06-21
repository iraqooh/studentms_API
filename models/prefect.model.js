module.exports = (sequelize_config, sequelize) => {
    const student = require('./student.model')
    const prefect = sequelize_config.define('prefect', {
        prefect_id: {
            type: sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        position: {
            type: sequelize.STRING,
            allowNull: false
        },
        description: {
            type: sequelize.STRING,
            allowNull: true
        },
        student_id: {
            type: sequelize.INTEGER,
            allowNull: true,
            reference: {
                model: student,
                key: 'student_id'
            }
        },
        term_start: {
            type: sequelize.DATE,
            allowNull: true
        },
        term_end: {
            type: sequelize.DATE,
            allowNull: true
        }
    })

    return prefect;
}