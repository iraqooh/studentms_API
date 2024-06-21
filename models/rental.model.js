module.exports = (sequelize_config, sequelize) => {
    const student = require('./student.model')
    const book = require('./book.model')

    const rental = sequelize_config.define('rental', {
        rent_id: {
            type: sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        book_id: {
            type: sequelize.INTEGER,
            allowNull: false,
            references: {
                model: book,
                key: 'book_id'
            }
        },
        student_id: {
            type: sequelize.INTEGER,
            allowNull: false,
            references: {
                model: student,
                key: 'student_id'
            }        
        },
        return_date: {
            type: sequelize.DATE,
            allowNull: true
        }
    });

    return rental;
}