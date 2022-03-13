import { rest } from 'msw';
import type { MapPoint } from '../utils/typings';
import type { MapPointType } from '../utils/enum';
import mapdateJson from './mapdata.js';

let mapdata: MapPoint[] = mapdateJson;
mapdata = mapdata.sort((a, b) => {
    return a.id - b.id;
})
let next_id = mapdata.at(mapdata.length - 1).id;

export default [
    rest.get('/api/map.php', (req, res, ctx) => {
        const id_para = req.url.searchParams.get('id');
        const ip_para = req.url.searchParams.get('ip');
        const count_para = req.url.searchParams.get('count');
        const type_para = req.url.searchParams.get('type');
        const under_para = req.url.searchParams.get('under');
        const kword_para = req.url.searchParams.get('kword');

        const id = Number(id_para);
        const ip = ip_para?.trim();
        const count = Number(count_para);
        const types = type_para?.split('|');
        const kword = kword_para?.trim();
        const under = Number(under_para) == 1 ? true : false;

        let selected_data: MapPoint[];

        if (id_para && id >= 0) {
            selected_data = mapdata.filter(e => {
                return e.id == id;
            });
        } else {
            selected_data = mapdata.filter(e => {
                return (!ip_para || e.ip == ip) && (!under_para || e.is_underground == under) && e.is_deleted == false
                    && (!kword_para || e.name.match(kword) || e.desc.match(kword))
                    && (!type_para || types.includes(e.type));
            }).sort((a, b) => {
                return a.like - b.like;
            });
            if (count && selected_data.length > count) {
                selected_data = selected_data.slice(0, count - 1);
            }
        }
        return res(
            ctx.json(selected_data),
            ctx.status(200),
        )
    }),
    rest.post('/api/map.php', (req, res, ctx) => {
        let date = new Date().toDateString();

        mapdata.push(({
            id: next_id++,
            type: (req.body['type'] as string)?.trim() as MapPointType,
            name: (req.body['name'] as string)?.trim(),
            desc: (req.body['desc'] as string)?.trim(),
            lng: req.body['lng'],
            lat: req.body['lat'],
            like: req.body['like'],
            dislike: req.body['dislike'],
            ip: (req.body['ip'] as string)?.trim(),
            is_underground: req.body['is_underground'] == 1,
            is_deleted: false,
            is_lock: false,
            create_date: date,
            update_date: date,
        }));
        return res(
            ctx.json(true),
            ctx.status(200),
        )
    }),
    rest.delete('/api/map.php', (req, res, ctx) => {
        const id = req.body['id'] as number;
        let result = false;
        for (let e of mapdata) {
            if (e.id == id && !e.is_deleted) {
                e.is_deleted = true;
                e.update_date = new Date().toDateString();
                result = true;
            }
        }
        return res(
            ctx.json(result),
            ctx.status(200),
        )
    }),
    rest.patch('/api/map.php', (req, res, ctx) => {
        const id_para: string = req.body['id'];
        const type_para: string = req.body['type'];
        const name_para: string = req.body['name'];
        const desc_para: string = req.body['desc'];
        const lng_para: number = req.body['lng'];
        const lat_para: number = req.body['lat'];
        const like_para: number = req.body['like'];
        const dislike_para: number = req.body['dislike'];
        const ip_para: string = req.body['ip'];
        const is_underground_para: boolean = req.body['is_underground'];
        const is_deleted_para: boolean = req.body['is_deleted'];
        const is_lock_para: boolean = req.body['is_lock'];

        const id = Number(id_para);

        let result = false;
        mapdata.every((e, i, array) => {
            if (e.id == id) {
                array[i].type = type_para ? type_para.trim() as MapPointType : e.type;
                array[i].name = name_para ? name_para.trim() : e.name;
                array[i].desc = desc_para ? desc_para.trim() : e.desc;
                array[i].lng = lng_para ? lng_para : e.lng;
                array[i].lat = lat_para ? lat_para : e.lat;
                array[i].like = like_para ? like_para : e.like;
                array[i].dislike = dislike_para ? dislike_para : e.dislike;
                array[i].ip = ip_para ? ip_para.trim() : e.ip;
                array[i].is_deleted = is_deleted_para ? is_deleted_para : e.is_deleted;
                array[i].is_lock = is_lock_para ? is_lock_para : e.is_lock;
                array[i].is_underground = is_underground_para ? is_underground_para : e.is_underground;
                array[i].update_date = new Date().toDateString();
                result = true;
                return false;
            }
            return true;
        })
        return res(
            ctx.json(result),
            ctx.status(200),
        )
    }),
]
