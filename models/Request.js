'use strict';

module.exports = (sequelize, DataTypes) => {
    var Request = sequelize.define('Request', {
        employeeNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        requesterClosed: {
            type: DataTypes.BOOLEAN
        },
        fulfillerClosed: {
            type: DataTypes.BOOLEAN
        },
        totallyClosed : {
            type: DataTypes.BOOLEAN
        },
        fulfillerNumber: {
            type: DataTypes.STRING
        },
        fulfillerGivenName: {
            type: DataTypes.STRING
        },
        employeeGivenName: {
            type: DataTypes.STRING
        },
        employeeDescription: {
            type: DataTypes.TEXT,
            len: [0, 250]
        },
        fulfillerDescription: {
            type: DataTypes.TEXT,
            len: [0, 250]
        },
        requestDate: {
            type: DataTypes.DATE
        },
        closedDate: {
            type: DataTypes.DATE
        }
    });

    Request.associate = function (models) {
        models.Request.belongsToMany(models.Tag, {
            as: 'ListOfTag',
            through: 'Tags_Request'
        });
    };

    return Request;
}; 