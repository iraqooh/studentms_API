module.exports = (sequelize, Sequelize) => {
    const instructor = sequelize.define('instructor', {
        instructor_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        instructor_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        title: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        department: {
            type: Sequelize.ENUM,
            values: ['SCIENCES', 'ARTS'],
            allowNull: false
        }
    });
      
    return instructor;
}