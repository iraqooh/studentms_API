module.exports = (sequelize_config, sequelize) => {
    const book = sequelize_config.define('book', {
        book_id: {
            type: sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: sequelize.STRING,
            allowNull: false
        },
        author: {
            type: sequelize.TEXT,
            allowNull: false
        },
        category: {
            type: sequelize.STRING,
            allowNull: true
        }
    });

    return book;
}