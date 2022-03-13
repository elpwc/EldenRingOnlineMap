import { rest } from 'msw';
import { ADMINPASSWORD } from '../data/admin';

export default [
    rest.post('/api/checkAdmin.php', (req, res, ctx) => {
        return res(
            ctx.json({
                validate: req.body['p'] == ADMINPASSWORD,
            }),
            ctx.status(200),
        )
    }),
]