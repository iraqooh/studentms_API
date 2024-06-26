module.exports = (sequelize, Sequelize) => {
    const db = require("./index");
    const payment = sequelize.define("payment",
        {
            payment_id: { 
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true 
            },
            student_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: db.students,
                    key: 'student_id'
                }
            },
            amount_paid: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        }
    );

    return payment;
}