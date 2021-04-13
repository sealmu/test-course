import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

type IProps = {
    ssrWorking: boolean;
};

const HomePage: React.FC<IProps> = (props) => {
    const router = useRouter();
    console.log(router.pathname, router.query);

    return <div>home page{props.ssrWorking ? '(with ssr)' : ''}</div>;
};

export const getServerSideProps: GetServerSideProps = async () => {
    return { props: { ssrWorking: true } };
};

export default HomePage;
