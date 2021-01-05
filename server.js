const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLNonNull } = require('graphql');
const { books, arthurs } = require('./data');
const app = express();

const BookType = new GraphQLObjectType({
  name: 'Book',
  description: 'This represent a book written by an arthur',
  fields: () =>({
    id: { type: GraphQLNonNull(GraphQLInt)},
    name: { type: GraphQLNonNull(GraphQLString) },
    authurId: { type: GraphQLNonNull(GraphQLInt)}
  })
})

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    books: {
      type: new GraphQLList(BookType),
      description: 'A List of Books',
      resolve: () => books
    }
  })
})


const schema = new GraphQLSchema({
  query: RootQueryType
})

app.use(
  '/graphql',
  graphqlHTTP({
    graphiql: true,
    schema: schema
  })
);
app.listen(5000, () => console.log('Server Running'));
