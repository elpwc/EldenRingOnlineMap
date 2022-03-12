import { rest } from 'msw'
import type { MapPoint } from '../utils/typings';
import mapdateJson from './mapdata.js';

let mapdata: MapPoint[] = mapdateJson;

export const handlers = [
    rest.get('/api/map.php', (req, res, ctx) => {
        return res(
            ctx.json(mapdata),
            ctx.status(200),
        )
    }),
    rest.post('/api/map.php', (req, res, ctx) => {
        return res(
            ctx.json(mapdata),
            ctx.status(200),
        )
    }),
    rest.delete('/api/map.php', (req, res, ctx) => {
        return res(
            ctx.json(""),
            ctx.status(200),
        )
    }),
    rest.patch('/api/map.php', (req, res, ctx) => {
        return res(
            ctx.json(""),
            ctx.status(200),
        )
    }),
    rest.post('/api/checkAdmin.php', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                validate: true,
            }),
        )
    }),
]
