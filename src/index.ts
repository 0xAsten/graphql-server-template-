import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

import { typeDefs } from './schema.js'
import db from './_db.js'

const resolvers = {
  Query: {
    reviews: () => db.reviews,
    games: () => db.games,
    authors: () => db.authors,
    review: (_: any, { id }) => db.reviews.find((review) => review.id === id),
    game: (_: any, { id }) => db.games.find((game) => game.id === id),
    author: (_: any, { id }) => db.authors.find((author) => author.id === id),
  },
  Game: {
    reviews: (parent: any) =>
      db.reviews.filter((review) => review.game_id === parent.id),
  },
  Author: {
    reviews: (parent: any) =>
      db.reviews.filter((review) => review.author_id === parent.id),
  },
  Review: {
    author: (parent: any) =>
      db.authors.find((author) => author.id === parent.author_id),
    game: (parent: any) => db.games.find((game) => game.id === parent.game_id),
  },
  Mutation: {
    addGame: (_: any, { game }) => {
      let gameObj = { ...game, id: String(db.games.length + 1) }
      db.games.push(gameObj)
      return db.games
    },
    deleteGame: (_: any, { id }) => {
      let deletedGame = db.games.find((game) => game.id === id)
      db.games = db.games.filter((game) => game.id !== id)
      return deletedGame
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
})

console.log(`🚀  Server ready at: ${url}`)
