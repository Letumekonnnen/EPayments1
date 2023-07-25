const { Agents, Bill, Payment } = require(".");

module.exports = (sequelize, DataTypes) => {
    const ServiceProviders = sequelize.define("ServiceProviders", {
        serviceProviderBIN: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            unique: true,
          },
        serviceProviderName:{
            type: DataTypes.STRING,
            allowNUll:false
        },
        servicesOffered:{
            type: DataTypes.STRING,
            allowNUll:false
        },
        BankName:{
            type: DataTypes.STRING,
            allowNUll:false
        },

        BankAccountNumber:{
            type: DataTypes.STRING,
            allowNUll:false
        },
        phoneNumber:{
            type: DataTypes.STRING,
            allowNUll:false
        },

        serviceProviderAuthorizationLetter: {
            type: DataTypes.STRING,
            allowNull: false
        },
    
    })    
    ServiceProviders.associate = (models) => {
        ServiceProviders.belongsToMany(models.User, {
          through: models.UserServiceProvider,
          foreignKey: 'serviceProviderBIN',
          as: 'Users',
        });
        ServiceProviders.belongsToMany(models.Agents, {
          through: models.AgentServiceProvider,
          foreignKey: 'serviceProviderBIN',
          as: 'Agents',
        });
        ServiceProviders.hasMany(models.Bill, {
          foreignKey: 'serviceProviderBIN',
          as: 'Bills',
        });
        ServiceProviders.hasMany(models.Payment, {
          foreignKey: 'serviceProviderBIN',
          as: 'payments',
        });
      };
      
      return ServiceProviders;
    };
      
    // [
    //     {
    //         "serviceProviderBIN": "123456",
    //         "serviceProviderName": "ServiceProvider1",
    //         "servicesOffered": "Service 1",
    //         "BankName": "Bank 1",
    //         "BankAccountNumber": "1234567890",
    //         "phoneNumber": "1234567890",
    //         "serviceProviderAuthorizationLetter": "Images\\1692795183509.jpg",
    //         "createdAt": "2023-08-23T12:53:03.000Z",
    //         "updatedAt": "2023-08-23T12:53:03.000Z",
    //         "Agents": [],
    //         "Bills": []
    //     },
    //     {
    //         "serviceProviderBIN": "654321",
    //         "serviceProviderName": "ServiceProvider2",
    //         "servicesOffered": "Service 2",
    //         "BankName": "Bank 2",
    //         "BankAccountNumber": "0987654321",
    //         "phoneNumber": "9876543210",
    //         "serviceProviderAuthorizationLetter": "Images\\1692795397888.jpg",
    //         "createdAt": "2023-08-23T12:56:37.000Z",
    //         "updatedAt": "2023-08-23T12:56:37.000Z",
    //         "Agents": [],
    //         "Bills": []
    //     },
    //     {
    //         "serviceProviderBIN": "789012",
    //         "serviceProviderName": "ServiceProvider3",
    //         "servicesOffered": "Service 3",
    //         "BankName": "Bank 3",
    //         "BankAccountNumber": "5678901234",
    //         "phoneNumber": "5678901234",
    //         "serviceProviderAuthorizationLetter": "Images\\1692796169359.jpg",
    //         "createdAt": "2023-08-23T13:09:29.000Z",
    //         "updatedAt": "2023-08-23T13:09:29.000Z",
    //         "Agents": [],
    //         "Bills": []
    //     },
    //     {
    //         "serviceProviderBIN": "901234",
    //         "serviceProviderName": "ServiceProvider4",
    //         "servicesOffered": "Service 4",
    //         "BankName": "Bank 4",
    //         "BankAccountNumber": "8901234567",
    //         "phoneNumber": "8901234567",
    //         "serviceProviderAuthorizationLetter": "Images\\1692797132992.jpg",
    //         "createdAt": "2023-08-23T13:14:44.000Z",
    //         "updatedAt": "2023-08-23T13:25:33.000Z",
    //         "Agents": [],
    //         "Bills": []
    //     },
    //     {
    //         "serviceProviderBIN": "BIN001",
    //         "serviceProviderName": "ServiceProvider5",
    //         "servicesOffered": "Service 5",
    //         "BankName": "Bank 5",
    //         "BankAccountNumber": "1000345678",
    //         "phoneNumber": "123456",
    //         "serviceProviderAuthorizationLetter": "Images\\1692797646954.jpg",
    //         "createdAt": "2023-08-23T13:29:10.000Z",
    //         "updatedAt": "2023-08-23T13:34:06.000Z",
    //         "Agents": [
    //             {
    //                 "agentBIN": "789123456",
    //                 "agentName": "Financial Bank",
    //                 "agentEmail": "financialbank@example.com",
    //                 "servicesOffered": "Business Banking, Personal Loans, Retirement Planning",
    //                 "phoneNumber": "7891234560",
    //                 "agentAuthorizationLetter": "Images\\1692786446847.jpg",
    //                 "createdAt": "2023-08-23T07:53:37.000Z",
    //                 "updatedAt": "2023-08-23T10:27:26.000Z",
    //                 "agentServiceProvider": {
    //                     "createdAt": "2023-08-23T13:29:10.000Z",
    //                     "updatedAt": "2023-08-23T13:29:10.000Z",
    //                     "AgentBIN": "789123456",
    //                     "serviceProviderBIN": "BIN001"
    //                 }
    //             }
    //         ],
    //         "Bills": []
    //     }
    // ]