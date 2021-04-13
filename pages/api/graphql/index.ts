import Cors from 'micro-cors';
import { ApolloServer, gql } from 'apollo-server-micro'; // from 'apollo-server-cloud-functions'; // 


import { NextApiRequest, NextApiResponse } from 'next';

type Todo = {
    id: number;
    description: string;
    done: boolean;
};

const todos: Todo[] = [
    {
        id: 1,
        description: 'todo - 1',
        done: false,
    },
];

const todoResolvers = {
    Query: {
        todos: (): Todo[] => {
            return todos;
        },
        todo: (_parent: never, { id }: { id: string | number }): Todo => {
            return todos.find((t) => t.id == id);
        },
    },

    Mutation: {
        createTodo: async (
            _: never,
            { description, done }: { description: string; done: boolean }
        ):
        Promise<Todo> => {
            const todo: Todo = {
                id: new Date().getTime(),
                description,
                done,
            };

            todos.push(todo);
            return todo;
        },
        completeTodo: async (_: never, { id }: { id: string | number }): Promise<Todo> => {
            const todo = todos.find((t) => t.id == id);

            if (todo) {
                todo.done = true;
            }

            return todo;
        },
    },
};

const todoTypes = gql`
    type Todo {
        id: ID!
        description: String!
        done: Boolean!
    }

    type Query {
        todos: [Todo]!
        todo(id: ID!): Todo
    }

    type Mutation {
        createTodo(description: String!, done: Boolean): Todo
        completeTodo(id: ID!): Todo
    }
`;




const cors = Cors({
    origin: "*",
    credentials: true,
});

const getApolloServerHandler = async ({ res }: { res?: NextApiResponse }): Promise<any> => {

    if (res) {
        console.log('res init');
    }

    const apolloServer = new ApolloServer({
        typeDefs: [todoTypes],
	    resolvers: [todoResolvers],
        introspection: true,
        playground: true,
        context: ({ req, res }) => {
            if (!req || !res) console.log('no');
            return { };
        },
    });

    const handler = apolloServer.createHandler({  path: '/api/graphql' });
    const corsHandler = cors(handler);
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
