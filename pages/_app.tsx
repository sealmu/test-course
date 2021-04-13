import '../styles/globals.css'
import type { AppProps } from 'next/app';
import { ApolloClient, createHttpLink, InMemoryCache, ApolloProvider } from '@apollo/client';

export const link = createHttpLink({
    uri: '/api/graphql',
});

export const client = new ApolloClient({
    cache: new InMemoryCache(),
    link,
});

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    return (
        <ApolloProvider client={client}>
            <Component {...pageProps} />
        </ApolloProvider>
    );
}

export default MyApp;
