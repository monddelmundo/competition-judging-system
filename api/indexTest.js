const express               = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const User = require('./models/user.model');

const typeDefs = gql`
    type User {
        id: ID!
        username: String
        password: String
        role: String
    }
    type Query {
        getUsers: [User]
    }
    type Mutation {
        addUser(username: String!, password: String!, role: String!): User
    }
`;

const resolvers = {
    Query: {
        getUsers: async () => await User.find({}).exec()
    },
    Mutation: {
        addUser: async (_, args) => {
            try {
                let response = await User.create(args);
                return response;
            } catch(e) {
                return e.message;
            }
        }
    }
};

const server = new ApolloServer({ typeDefs, resolvers });
const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);