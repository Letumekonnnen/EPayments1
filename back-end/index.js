// Import necessary packages and modules
const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');
const app = express();

var corOptions = {
  origin: 'https://localhost:3001'
}

//middleware
app.use(cors())
app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({extended : true}))

//
const db = require('./models/index.js')
db.sequelize.sync();

db.sequelize.sync({force: false })
.then(() => {

  console.log('it is working');
}); 

// Import controllers
const billController = require('./controller/billController.js')
const serviceController = require('./controller/serviceProviderController.js')
const paymentController = require('./controller/PaymentController.js');
const userController = require('./controller/UserController.js');
const AgentController = require('./controller/agentController.js');
const AdminLoginController = require('./controller/AdminLoginController.js')

// Import routes

const billsRouter = require('./routes/billRoutes.js')
const serviceProvidersRouter = require('./routes/serviceProviderRoute.js');
const paymentRouter = require('./routes/paymentRoutes.js');
const usersRouter = require('./routes/userRoute.js');
const AgentsRouter = require('./routes/agentRoutes.js');
const AdminRouter = require('./routes/AdminRoutes.js')

// Mount routes
app.use('/bills', billsRouter);
app.use('/serviceproviders', serviceProvidersRouter);
app.use('/payment', paymentRouter);


app.use('/Users', usersRouter);
app.use('/agents', AgentsRouter);
app.use('/api/admin', AdminRouter);
app.use ('/Images',express.static('./Images'));



//testing api
app.get('/',(req,res)=>{
  res.json({message: 'Welcome to epayment'})
})

//Port

const PORT = process.env.PORT || 3000


// start server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});


// app.use('/agents', agentController);
// app.use('/bills', billController);
// app.use('/payments', paymentController);
// app.use('/services', serviceController);
// app.use('/users', userController);
// app.use('/agentHistory', agentHistoryController);
// app.use('/serviceHistory', serviceHistoryController);
// app.use('/userHistory', userHistoryController);

// start server
// app.listen(PORT, () => {

//   console.log(Server started on port ${PORT});


//   connection.connect(function(err){
//     if (err) throw err;
//     console.log('database connected');

//   })
// });