import { NextApiResponse } from 'next';

type Data = {
    name: string;
};

export default (_: never, res: NextApiResponse<Data>): void => {
    res.status(200).json({ name: 'John Doe' });
};
