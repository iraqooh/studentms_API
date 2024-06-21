module.exports = (sequelize_config, Sequelize) => {
    const student = sequelize_config.define('student',
    {
        student_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        first_name: { type: Sequelize.STRING, allowNull: false },
        last_name: { type: Sequelize.STRING, allowNull: false },
        gender: {
            type: Sequelize.ENUM,
            values: ['F', 'M']
        },
        age: {
            type: Sequelize.INTEGER,
            min: 10,
            allowNull: false
        },
        parent_phone_number: {
            type: Sequelize.STRING,
            allowNull: false
        },
        physical_address: {
            type: Sequelize.STRING,
            defaultValue: 'Kampala'
        },
        category: {
            type: Sequelize.ENUM,
            values: ['DAY', 'BOARDING']
        },
        class: { type: Sequelize.STRING },
        status: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    }, {
        defaultScope: {
            exclude: ['student_id']
        }
    });

    return student;
}