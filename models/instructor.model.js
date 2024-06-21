module.exports = (sequelize_config, sequelize) => {
    const instructor = sequelize_config.define('instructor', {
        instructor_id: {
            type: sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        instructor_name: {
            type: sequelize.STRING,
            allowNull: false
        },
        title: {
            type: sequelize.TEXT,
            allowNull: true
        },
        department: {
            type: sequelize.ENUM,
            values: ['SCIENCES', 'ARTS'],
            allowNull: false
        }
    });
      
    return instructor;
}