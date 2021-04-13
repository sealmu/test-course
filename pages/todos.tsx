import { useQuery, useMutation, gql } from '@apollo/client';
import { useState } from 'react';

const TODO_FRAGMENT = gql`
    fragment todoParts on Todo {
        id
        description
        done
    }
`;

const GET_TODOS = gql`
    query todos {
        todos {
            ...todoParts
        }
    }
    ${TODO_FRAGMENT}
`;

const CREATE_TODO = gql`
    mutation CreateTodo($description: String!) {
        createTodo(description: $description, done: false) {
            id
            description
            done
        }
    }
`;

const COMPLETE_TODO = gql`
    mutation CompleteTodo($id: ID!) {
        completeTodo(id: $id) {
            id
        }
    }
`;

const AboutPage: React.FC = () => {
    const [todo, setTodo] = useState('');
    const { loading, error, data, refetch } = useQuery(GET_TODOS);
    const [createTodo] = useMutation(CREATE_TODO);
    const [completeTodo] = useMutation(COMPLETE_TODO);

    const saveTodo = async (e): Promise<void> => {
        e.preventDefault();
        await createTodo({ variables: { description: todo } });
        refetch();
        setTodo('');
    };

    const onComplete = async (id): Promise<void> => {
        await completeTodo({ variables: { id } });
        refetch();
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>ERROR :(</p>;

    return (
        <div>
            <div>graphql</div>
            <hr />
            {data.todos.map((todo) => (
                <div key={todo.id}>
                    {todo.description}
                    <button disabled={todo.done} onClick={() => onComplete(todo.id)}>
                        {todo.done ? 'Done' : 'Complete'}
                    </button>
                </div>
            ))}
            <hr />
            <form onSubmit={saveTodo}>
                <label>
                    New todo
                    <input onChange={(e) => setTodo(e.target.value)} value={todo} />
                </label>
                <button type="submit">Save</button>
            </form>
        </div>
    );
};


export async function getServerSideProps() {
  return { props: {  } }
}

export default AboutPage;
