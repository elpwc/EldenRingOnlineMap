import { rest } from 'msw';

export default [
    rest.post('/api/searchUpload.php', (req, res, ctx) => {
        return res(
            ctx.json(true),
            ctx.status(200),
        )
    }),
]