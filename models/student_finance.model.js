module.exports = (sequelize, sequelize_config) => {
    const StudentPayment = sequelize_config.define('student_finance', {
        finance_id: {
            type: sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        student_id: {
            type: sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'students',
                key: 'student_id'
            }
        },
        amount: {
            type: sequelize.DECIMAL(10, 2),
            allowNull: false,
        }
    });

    const student = require('./student.model')(sequelize, sequelize_config)
    StudentPayment.belongsTo(student, {
        as: 'students',
        foreignKey: 'student_id'
    })

    return StudentPayment
}