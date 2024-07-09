import express from 'express'
import {ApolloServer} from 'apollo-server-express'
import path from 'path'
import {typeDefs, resolvers} from "./schemas"
import db from './config/connection'
import {authMiddleware} from './utils/auth';

const app = express();
const PORT = process.env.PORT || 3000;

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware
});

server.applyMiddleware({app});

app.use(express.urlencoded({extended: true}));
app.use(express.json());

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
})

db.once('open', () => {
    app.listen(PORT, () => console.log(`App is now listening to localhost: ${PORT}`));
    console.log(`GraphQL server ready! Visit http://localhost: ${PORT}${server.graphqlPath}`);
});