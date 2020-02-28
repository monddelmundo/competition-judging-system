const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { ApolloServer, gql } = require('apollo-server-express');
//require('./indexTest');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
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

app.use('/users', usersRouter);
app.use('/events', eventRouter);
app.use('/competitions', competitionRouter);
app.use('/judges', judgeRouter);
app.use('/churches', churchRouter);

app.listen(
    port, 
    () => console.log(`Server is running on port: ${port}`)
)

