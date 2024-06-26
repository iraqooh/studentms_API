module.exports = (sequelize, Sequelize) => {
    const db = require("./index");
    const finance = sequelize.define("finance",
        {
            finance_id: { 
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
            school_fees: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        },
        {
            defaultScope: {
                attributes: {
                    exclude: ['finance_id', 'createdAt','updatedAt', 'student_id' ]
                }
            }
        }
    );

    return finance;
}