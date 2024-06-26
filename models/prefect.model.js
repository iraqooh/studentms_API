module.exports = (sequelize, Sequelize) => {
    const db = require('./index')
    const prefect = sequelize.define('prefect', {
        prefect_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        position: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.STRING,
            allowNull: true
        },
        student_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: db.students,
                key: 'student_id'
            }
        },
        term_start: {
            type: Sequelize.DATE,
            allowNull: true
        },
        term_end: {
            type: Sequelize.DATE,
            allowNull: true
        }
    })

    return prefect;
}