module.exports = (sequelize_config, Sequelize) => {
    const _Student = require('./student.model')
    const StudentFinance = sequelize_config.define('student_finance', {
        finance_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        student_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            reference: {
                model: _Student,
                key: 'student_id',
                onDelete: 'RESTRICT',
                onUpdate: 'RESTRICT'
            }
        },
        school_fees_amount: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });

    return StudentFinance;
}