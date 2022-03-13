import { rest } from 'msw';

export default [
    rest.post('/api/isRequest.php', (req, res, ctx) => {
        return res(
            ctx.json({
                ip: 'localhost',
            }),
            ctx.status(200),
        )
    }),
]