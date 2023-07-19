const bcrypt = require('bcrypt');
const { Agents, Payment, Bill } = require('.');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      UserID: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      FirstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      LastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Gender: {
        type: DataTypes.ENUM('male', 'female'),
        allowNull: false,
      },
      UserName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      Password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      PhoneNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Role: {
        type: DataTypes.ENUM('Admin', 'User'),
        defaultValue: 'User',
      },
      ProfilePicture: {
        type: DataTypes.STRING, 
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  );

  User.associate = (models) => {
    User.belongsToMany(models.ServiceProviders, {
      through: models.UserServiceProvider,
      foreignKey: 'UserId',
      as: 'Users',
    });
    User.belongsToMany(models.Agents, {
      through: models.userAgent,
      foreignKey: 'UserId',
      as: 'Agents',
    });
    User.hasMany(models.Payment, {
      foreignKey: 'UserId',
      as: 'payments',
    });
    User.hasMany(models.Bill, {
      foreignKey: 'UserId',
      as: 'Bills',
    });
};

  return User;
};



// [
//   {
//       "id": 1,
//       "UserID": "ID123",
//       "FirstName": "John",
//       "LastName": "Doe",
//       "Gender": "male",
//       "UserName": "johndoe",
//       "Password": "$2b$10$4/YRFTDl5eAyI2CLqccr6OEDBA77PVAu.GRF5HfcJkA0bc6UMNSnO",
//       "Email": "johndoe@gmail.com",
//       "PhoneNumber": 1234567890,
//       "Address": "123 Main St",
//       "Role": "User",
//       "ProfilePicture": "Images\\1692722005642.png",
//       "createdAt": "2023-08-22T11:42:23.000Z",
//       "updatedAt": "2023-08-22T22:56:24.000Z",
//       "payments": [],
//       "Bills": [],
//       "Agents": []
//   },
//   {
//       "id": 2,
//       "UserID": "ID002",
//       "FirstName": "Jane",
//       "LastName": "Smith",
//       "Gender": "female",
//       "UserName": "janesmith",
//       "Password": "$2b$10$fw5wYWg8PxSr6fPlkYEA2.GHc7Kfi.KuX/KcCVhBjC3DMRa10Rjb6",
//       "Email": "janesmith@gmail.com",
//       "PhoneNumber": 98765432,
//       "Address": "456 Elm St",
//       "Role": "Admin",
//       "ProfilePicture": "Images\\1692706758547.jpg",
//       "createdAt": "2023-08-22T12:19:18.000Z",
//       "updatedAt": "2023-08-22T12:19:18.000Z",
//       "payments": [],
//       "Bills": [],
//       "Agents": []
//   },
//   {
//       "id": 3,
//       "UserID": "ID003",
//       "FirstName": "David",
//       "LastName": "Johnson",
//       "Gender": "male",
//       "UserName": "davidjohnson",
//       "Password": "$2b$10$d.7p6Wzs5z.kmUdIhmI1DuGtSoKmqMzjvQFTMnVN7Ut6g6Jn/Kime",
//       "Email": "davidjohnson@example.com",
//       "PhoneNumber": 55555555,
//       "Address": "789 Oak St",
//       "Role": "User",
//       "ProfilePicture": null,
//       "createdAt": "2023-08-22T12:36:26.000Z",
//       "updatedAt": "2023-08-23T01:10:35.000Z",
//       "payments": [],
//       "Bills": [
//           {
//               "id": 6,
//               "billNumber": "B005",
//               "dateIssued": "2023-08-05T00:00:00.000Z",
//               "dueDate": "2023-08-20T00:00:00.000Z",
//               "amountDue": 1345,
//               "customerName": "davidjohnson",
//               "serviceDescription": "Electricity Service",
//               "servicePeriod": "sept",
//               "serviceCharges": 50,
//               "additionalCharges": 10,
//               "billStatus": "Unpaid",
//               "TotalAmount": 1405,
//               "createdAt": "2023-08-23T00:36:01.000Z",
//               "updatedAt": "2023-08-23T01:08:23.000Z",
//               "ServiceProviderServiceProviderBIN": null,
//               "paymentId": null,
//               "UserId": 3
//           },
//           {
//               "id": 3,
//               "billNumber": "B003",
//               "dateIssued": "2023-08-10T00:00:00.000Z",
//               "dueDate": "2023-08-25T00:00:00.000Z",
//               "amountDue": 200,
//               "customerName": "Sarah Johnson",
//               "serviceDescription": "Phone Service",
//               "servicePeriod": null,
//               "serviceCharges": 100,
//               "additionalCharges": 25,
//               "billStatus": "Unpaid",
//               "TotalAmount": 325,
//               "createdAt": "2023-08-22T23:36:05.000Z",
//               "updatedAt": "2023-08-23T01:08:23.000Z",
//               "ServiceProviderServiceProviderBIN": null,
//               "paymentId": null,
//               "UserId": 3
//           }
//       ],
//       "Agents": [
//           {
//               "agentBIN": "789123456",
//               "agentName": "Financial Bank",
//               "agentEmail": "financialbank@example.com",
//               "servicesOffered": "Business Banking, Personal Loans, Retirement Planning",
//               "phoneNumber": "7891234560",
//               "agentAuthorizationLetter": "Images\\1692786446847.jpg",
//               "createdAt": "2023-08-23T07:53:37.000Z",
//               "updatedAt": "2023-08-23T10:27:26.000Z",
//               "userAgent": {
//                   "createdAt": "2023-08-23T10:27:26.000Z",
//                   "updatedAt": "2023-08-23T10:27:26.000Z",
//                   "UserID": 3,
//                   "AgentBIN": "789123456"
//               }
//           }
//       ]
//   },
//   {
//       "id": 4,
//       "UserID": "ID001",
//       "FirstName": "John",
//       "LastName": "Doe",
//       "Gender": "male",
//       "UserName": "johndoe123",
//       "Password": "$2b$10$Am.IbMJubo.bjAOq661TBOkfskCskBbm4xEVwlJeObAoIoMCm05WG",
//       "Email": "john@gmail.com",
//       "PhoneNumber": 1234567,
//       "Address": "123 Main St",
//       "Role": "User",
//       "ProfilePicture": null,
//       "createdAt": "2023-08-22T23:03:03.000Z",
//       "updatedAt": "2023-08-23T01:24:58.000Z",
//       "payments": [],
//       "Bills": [],
//       "Agents": []
//   },
//   {
//       "id": 7,
//       "UserID": "ID004",
//       "FirstName": "John",
//       "LastName": "Doe",
//       "Gender": "male",
//       "UserName": "john",
//       "Password": "$2b$10$3ZKHZteO9X0xJcPqQTKFtOEZ2firPbSi8DK.PUiFyr0PViNenD6Ua",
//       "Email": "john123@gmail.com",
//       "PhoneNumber": 123456,
//       "Address": "123 Main St",
//       "Role": "User",
//       "ProfilePicture": null,
//       "createdAt": "2023-08-22T23:05:51.000Z",
//       "updatedAt": "2023-08-22T23:05:51.000Z",
//       "payments": [],
//       "Bills": [],
//       "Agents": []
//   },
//   {
//       "id": 8,
//       "UserID": "ID008",
//       "FirstName": "John",
//       "LastName": "Doe",
//       "Gender": "male",
//       "UserName": "john123",
//       "Password": "$2b$10$cd/WpeOpHFugm7EeJnzsIOy.GBT2vPMKoGhWKcGm30ucacNWW5zne",
//       "Email": "john1234@gmail.com",
//       "PhoneNumber": 12345865,
//       "Address": "123 Main St",
//       "Role": "User",
//       "ProfilePicture": null,
//       "createdAt": "2023-08-22T23:17:55.000Z",
//       "updatedAt": "2023-08-22T23:17:55.000Z",
//       "payments": [],
//       "Bills": [],
//       "Agents": []
//   },
//   {
//       "id": 9,
//       "UserID": "ID009",
//       "FirstName": "Eden",
//       "LastName": "zewdu",
//       "Gender": "female",
//       "UserName": "eden123",
//       "Password": "$2b$10$LYbMS9M0Dic9jAEozP3zDeAaQeHEQcbV/mFTaGobZ8B7dzvS9Jw.O",
//       "Email": "eden1234@gmail.com",
//       "PhoneNumber": 1234586,
//       "Address": "123 Main St",
//       "Role": "User",
//       "ProfilePicture": null,
//       "createdAt": "2023-08-22T23:21:05.000Z",
//       "updatedAt": "2023-08-22T23:21:05.000Z",
//       "payments": [],
//       "Bills": [
//           {
//               "id": 1,
//               "billNumber": "B001",
//               "dateIssued": "2023-08-01T00:00:00.000Z",
//               "dueDate": "2023-08-15T00:00:00.000Z",
//               "amountDue": 1350.5,
//               "customerName": "Eden zewdu",
//               "serviceDescription": "Internet Service",
//               "servicePeriod": null,
//               "serviceCharges": 50,
//               "additionalCharges": 0,
//               "billStatus": "Unpaid",
//               "TotalAmount": 1400.5,
//               "createdAt": "2023-08-22T22:43:11.000Z",
//               "updatedAt": "2023-08-23T06:13:55.000Z",
//               "ServiceProviderServiceProviderBIN": null,
//               "paymentId": null,
//               "UserId": 9
//           }
//       ],
//       "Agents": []
//   },
//   {
//       "id": 11,
//       "UserID": "ID010",
//       "FirstName": "eftu",
//       "LastName": "tesfaye",
//       "Gender": "female",
//       "UserName": "eftu123",
//       "Password": "$2b$10$/lUnGYvPP74EKcHWTrniUeMOsYh5dYvhtLWJ0Lne.kIh6U1qByVAa",
//       "Email": "eftu1234@gmail.com",
//       "PhoneNumber": 1239876,
//       "Address": "123 Main St",
//       "Role": "User",
//       "ProfilePicture": null,
//       "createdAt": "2023-08-22T23:26:46.000Z",
//       "updatedAt": "2023-08-22T23:53:58.000Z",
//       "payments": [],
//       "Bills": [],
//       "Agents": []
//   }
// ]