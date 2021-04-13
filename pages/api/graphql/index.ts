
// import { mergeTypeDefs } from '@graphql-tools/merge';

// import { makeExecutableSchema, mergeSchemas } from 'graphql-tools';


//import firebase from '../../../utils/firebase';

import Cors from 'micro-cors';
import { ApolloServer, gql }  from 'apollo-server-micro'; // 


import { NextApiRequest, NextApiResponse } from 'next';


import todoResolvers from '../../../schema/resolvers/todo.resolvers';
import todoTypes from '../../../schema/types/todo.types.graphql';

// type Todo = {
//     id: number;
//     description: string;
//     done: boolean;
// };

// const todos: Todo[] = [
//     {
//         id: 1,
//         description: 'todo - 1',
//         done: false,
//     },
// ];

// const todoResolvers = {
//     Query: {
//         todos: (): Todo[] => {
//             return todos;
//         },
//         todo: (_parent: never, { id }: { id: string | number }): Todo => {
//             return todos.find((t) => t.id == id);
//         },
//     },

//     Mutation: {
//         createTodo: async (
//             _: never,
//             { description, done }: { description: string; done: boolean }
//         ):
//         Promise<Todo> => {
//             const todo: Todo = {
//                 id: new Date().getTime(),
//                 description,
//                 done,
//             };

//             todos.push(todo);
//             return todo;
//         },
//         completeTodo: async (_: never, { id }: { id: string | number }): Promise<Todo> => {
//             const todo = todos.find((t) => t.id == id);

//             if (todo) {
//                 todo.done = true;
//             }

//             return todo;
//         },
//     },
// };

// const todoTypes = gql`
//     type Todo {
//         id: ID!
//         description: String!
//         done: Boolean!
//     }

//     type Query {
//         todos: [Todo]!
//         todo(id: ID!): Todo
//     }

//     type Mutation {
//         createTodo(description: String!, done: Boolean): Todo
//         completeTodo(id: ID!): Todo
//     }
// `;


// firebase();



const cors = Cors({
    // allowMethods: ['POST', 'OPTIONS'],
    origin: "*",
    credentials: true,
});


// type CustomSocket = Exclude<NextApiResponse<any>['socket'], null> & {
//     server: Parameters<ApolloServer['installSubscriptionHandlers']>[0] & {
//         apolloServer?: ApolloServer;
//         apolloServerHandler?: any;
//     };
// };

// type CustomNextApiResponse<T = any> = NextApiResponse<T> & {
//     socket: CustomSocket;
// };

const getApolloServerHandler = async ({ res }: { res?: NextApiResponse }): Promise<any> => {
    //if (globalThis.schema) return globalThis.schema;

    if (res) {
        console.log('res init');
    }

    // const typeDefs = mergeTypeDefs([todoTypes]);
    // const resolvers = [todoResolvers];
    // const schema = makeExecutableSchema({ typeDefs, resolvers });

    // const schemas = mergeSchemas({ schemas: [schema].filter(Boolean) });


    const apolloServer = new ApolloServer({
        // schema: schemas,
        typeDefs: [todoTypes],
	    resolvers: [todoResolvers],
        introspection: true,
        // playground: {
        //     settings: {
        //         'request.credentials': 'same-origin',
        //         //"schema.polling.enable": false
        //     },
        // },
        playground: true,
        // {
        //     subscriptionEndpoint: '/api/graphiql',

        //     // settings: {
        //     //     'request.credentials': 'same-origin',
        //     // },
        // },
        // formatError: formatError,
        context: ({ req, res }) => {
            if (!req || !res) console.log('no');
            return { };
        },
    });

    const handler = apolloServer.createHandler({ path: '/api/graphql' }); // path: '/api/graphql'

    //const corsHandler = cors(handler);
    const corsHandler = cors((req, res) =>
        req.method === "OPTIONS" ? res.end() : handler(req, res)
    );

    //globalThis.schema = corsHandler;
    return corsHandler;
};

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const apolloServerHandler = globalThis.apolloServerHandler || await getApolloServerHandler({ res: null });
    globalThis.apolloServerHandler = apolloServerHandler;
    return apolloServerHandler(req, res);
};
