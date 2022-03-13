import { rest } from 'msw'
import mapHandlers from './mapHandlers';

export const handlers = [
    ...mapHandlers,
    rest.post('/api/checkAdmin.php', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                validate: true,
            }),
        )
    }),
]
