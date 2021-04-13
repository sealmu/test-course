import firebase from '../../utils/firebase';
const { db } = firebase();

type Todo = {
    id: string;
    description: string;
    done: boolean;
};

const resolvers = {
    Query: {
        todos: async (): Promise<Todo[]> => {
            const entries = await db.collection('todos').get();
            const todos: Todo[] = entries.docs.map((entry) => entry.data() as Todo);
            return todos;
        },
        todo: async (_parent: never, { id }: { id: string }): Promise<Todo> => {
            const doc = await db.doc(id).get();
            const todo: Todo = doc.data() as Todo;
            return todo;
        },
    },

    Mutation: {
        createTodo: async (
            _: never,
            { description, done }: { description: string; done: boolean }
        ):
        Promise<Todo> => {
            const todo: Todo = {
                id: new Date().getTime().toString(),
                description,
                done,
            };

            await db.collection('todos').doc(todo.id).set(todo);
            return todo;
        },
        completeTodo: async (_: never, { id }: { id: string }): Promise<Todo> => {
            await db.doc(`todos/${id}`).update({done: true});
            const newDoc: Todo = (await db.doc(`todos/${id}`).get()).data() as Todo;
            return newDoc;
        },
    },
};

export default resolvers;
