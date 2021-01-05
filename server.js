const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLNonNull } = require('graphql');
const { books, authors } = require('./data');
const app = express();

const BookType = new GraphQLObjectType({
  name: 'Book',
  description: 'This represent a book written by an arthur',
  fields: () =>({
    id: { type: GraphQLNonNull(GraphQLInt)},
    name: { type: GraphQLNonNull(GraphQLString) },
    authurId: { type: GraphQLNonNull(GraphQLInt)},
    author: { 
      type: AuthorType,
      resolve: (book) => {
        return authors.find(author => author.id === book.authorId)
      }
    }
  })
})

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: 'This represent an author of a book',
  fields: () =>({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    books: { 
      type: new GraphQLList(BookType),
      resolve: (author) => {
        return books.filter(book => book.authorId === author.id);
      }
    }
  })
})

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    book: {
      type: BookType,
      description: 'A single Book',
      args: {
        id: { type: GraphQLInt}
      },
      resolve: (parent, args) => books.find((book) => book.id === args.id)
    },
    books: {
      type: new GraphQLList(BookType),
      description: 'A List of Books',
      resolve: () => books
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: 'A List of Authors',
      resolve: () => authors
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
