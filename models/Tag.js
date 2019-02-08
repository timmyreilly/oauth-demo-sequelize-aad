'use strict';

module.exports = (sequelize, DataTypes) => {
    var Tag = sequelize.define('Tag', {
        Name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    Tag.associate = function (models) {
        models.Tag.belongsToMany(models.Request, {
            as: 'ListOfTag',
            through: 'Tags_Request', 
        });
    };

    return Tag;
}; 