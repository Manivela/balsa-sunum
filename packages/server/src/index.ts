import "reflect-metadata";
import { createConnection } from "typeorm";
import { User } from "./entity/User";
const { ApolloServer, gql } = require("apollo-server");
import { getManager } from "typeorm";

createConnection()
  .then(async (connection) => {
    // A schema is a collection of type definitions (hence "typeDefs")
    // that together define the "shape" of queries that are executed against
    // your data.
    const typeDefs = gql`
      # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

      # This "Book" type defines the queryable fields for every book in our data source.
      type User {
        id: Int
        firstName: String
        lastName: String
        age: Int
      }

      # The "Query" type is special: it lists all of the available queries that
      # clients can execute, along with the return type for each. In this
      # case, the "books" query returns an array of zero or more Books (defined above).
      type Query {
        users: [User]
        user(id: Int, name: String): User
      }
      type Mutation {
        createUser(firstName: String!, lastName: String): User
      }
    `;
    // Resolvers define the technique for fetching the types defined in the
    // schema. This resolver retrieves books from the "books" array above.
    const resolvers = {
      Query: {
        users: async () => {
          const users = await connection.manager.find(User);
          console.log("Loaded users: ", users);
          return users;
        },
        user: async (_, { id, name }, __) => {
          const entityManager = getManager(); // you can also get it via getConnection().manager

          const users = await entityManager.find(User, {
            where: [{ id: id }, { firstName: name }],
          });
          return users;
        },
      },
      Mutation: {
        createUser: async (_, { firstName, lastName }, __) => {
          console.log("Inserting a new user into the database...");
          const user = new User();
          user.firstName = firstName;
          user.lastName = lastName;
          user.age = 25;
          console.log("Saved a new user with id: " + user.id);
          await connection.manager.save(user);
          return user;
        },
      },
    };
    // The ApolloServer constructor requires two parameters: your schema
    // definition and your set of resolvers.
    const server = new ApolloServer({ typeDefs, resolvers });
    // The `listen` method launches a web server.
    server.listen().then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
    });
    console.log("Here you can setup and run express/koa/any other framework.");
  })
  .catch((error) => console.log(error));
