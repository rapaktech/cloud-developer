import express from 'express';

const auth = async function (req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {
    const token = String(req.headers.authorization).split('Bearer ')[1];

    if (!token || token !== 'asjkajcjhkabasbhbsac') return res.status(401).json({ message: "Invalid or missing token!" });

    next();
};

export default auth;
