module.exports = (sequelize_config, sequelize) => {
    const _student = require("./student.model");
    const payment = sequelize_config.define("payment",
        {
            payment_id: { 
                type: sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true 
            },
            student_id: {
                type: sequelize.INTEGER,
                allowNull: false,
                reference: {
                    model: _student,
                    key: 'student_id'
                }
            },
            amount_paid: {
                type: sequelize.INTEGER,
                allowNull: false,
            },
        }
    );

    return payment;
}