module.exports = (sequelize, Sequelize) => {
    const db = require("./index")

    const rental = sequelize.define('rental', {
        rent_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        book_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: db.books,
                key: 'book_id'
            }
        },
        student_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: db.students,
                key: 'student_id'
            }        
        },
        return_date: {
            type: Sequelize.DATE,
            allowNull: true
        }
    });

    return rental;
}