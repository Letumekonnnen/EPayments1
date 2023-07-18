const { ServiceProviders, User, Payment } = require(".");

// agentModel.js
module.exports = (sequelize, DataTypes) => {
    const Agents = sequelize.define("Agents", {
      agentBIN: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      agentName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      agentEmail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      servicesOffered: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      agentAuthorizationLetter: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    });
    Agents.associate = (models) => {
      Agents.belongsToMany(models.ServiceProviders, {
        through: models.agentServiceProvider,
        foreignKey: 'agentBIN',
        as: 'ServiceProviders',
      });
      Agents.belongsToMany(models.User, {
        through: models.userAgent,
        foreignKey: 'agentBIN',
        as: 'Agents',
      });
      Agents.hasMany(models.Payment, {
        foreignKey: 'agentBIN',
        as: 'Payments',
      });
    
};
    return Agents;
  };
  
  
//   [
//     {
//         "agentBIN": "789123456",
//         "agentName": "Financial Bank",
//         "agentEmail": "financialbank@example.com",
//         "servicesOffered": "Business Banking, Personal Loans, Retirement Planning",
//         "phoneNumber": "7891234560",
//         "agentAuthorizationLetter": "Images\\1692786446847.jpg",
//         "createdAt": "2023-08-23T07:53:37.000Z",
//         "updatedAt": "2023-08-23T10:27:26.000Z",
//         "ServiceProviders": [
//             {
//                 "serviceProviderBIN": "BIN001",
//                 "serviceProviderName": "ServiceProvider5",
//                 "servicesOffered": "Service 5",
//                 "BankName": "Bank 5",
//                 "BankAccountNumber": "1000345678",
//                 "phoneNumber": "123456",
//                 "serviceProviderAuthorizationLetter": "Images\\1692797646954.jpg",
//                 "createdAt": "2023-08-23T13:29:10.000Z",
//                 "updatedAt": "2023-08-23T13:34:06.000Z",
//                 "agentServiceProvider": {
//                     "createdAt": "2023-08-23T13:29:10.000Z",
//                     "updatedAt": "2023-08-23T13:29:10.000Z",
//                     "AgentBIN": "789123456",
//                     "serviceProviderBIN": "BIN001"
//                 }
//             }
//         ],
//         "User": [
//             {
//                 "id": 3,
//                 "UserID": "ID003",
//                 "FirstName": "David",
//                 "LastName": "Johnson",
//                 "Gender": "male",
//                 "UserName": "davidjohnson",
//                 "Password": "$2b$10$d.7p6Wzs5z.kmUdIhmI1DuGtSoKmqMzjvQFTMnVN7Ut6g6Jn/Kime",
//                 "Email": "davidjohnson@example.com",
//                 "PhoneNumber": 55555555,
//                 "Address": "789 Oak St",
//                 "Role": "User",
//                 "ProfilePicture": null,
//                 "createdAt": "2023-08-22T12:36:26.000Z",
//                 "updatedAt": "2023-08-23T01:10:35.000Z",
//                 "userAgent": {
//                     "createdAt": "2023-08-23T10:27:26.000Z",
//                     "updatedAt": "2023-08-23T10:27:26.000Z",
//                     "UserID": 3,
//                     "AgentBIN": "789123456"
//                 }
//             }
//         ],
//         "payments": []
//     },
//     {
//         "agentBIN": "BIN001",
//         "agentName": "Bank of Example",
//         "agentEmail": "bank@example.com",
//         "servicesOffered": "Account Management, Loans, Investments",
//         "phoneNumber": "1234567",
//         "agentAuthorizationLetter": "Images\\1692776871377.jpg",
//         "createdAt": "2023-08-23T07:47:51.000Z",
//         "updatedAt": "2023-08-23T07:47:51.000Z",
//         "ServiceProviders": [],
//         "User": [],
//         "payments": []
//     }
// ]