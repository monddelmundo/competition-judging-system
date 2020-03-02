const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

//const { ApolloServer, gql } = require('apollo-server-express');
//require('./indexTest');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: "http://localhost:3000"
}));
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})


const usersRouter = require('./routes/users');
const eventRouter = require('./routes/events');
const competitionRouter = require('./routes/competitions');
const judgeRouter = require('./routes/judges');
const churchRouter = require('./routes/churches');
const apiRouter = require('./routes/api');

app.use('/users', usersRouter);
app.use('/events', eventRouter);
app.use('/competitions', competitionRouter);
app.use('/judges', judgeRouter);
app.use('/churches', churchRouter);
app.use('/api', apiRouter);

app.listen(
    port, 
    () => console.log(`Server is running on port: ${port}`)
)

