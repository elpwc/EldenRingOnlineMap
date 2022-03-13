import { rest } from 'msw';
import apothegmData from '../data/apothegm';
import type { Apothegm, Reply } from '../../utils/typings';
import type { ApothegmType } from '../../utils/enum';

/**
 * mix apothegm and apo_reply
 */
let apothegm: Apothegm[] = apothegmData;
apothegm = apothegm.sort((a, b) => {
    return a.id - b.id;
})
let next_apothegm_id = apothegm.at(apothegm.length - 1).id;

let reply: Reply[] = [];
apothegm.forEach((e) => {
    reply.push(...e.replies);
})
reply.sort((a, b) => {
    return a.id - b.id;
})
let next_reply_id = reply.at(reply.length - 1).id;

export default [
    rest.get('./api/apothegm.php', (req, res, ctx) => {
        const id_para = req.url.searchParams.get('id');
        const ip_para = req.url.searchParams.get('ip');
        const count_para = req.url.searchParams.get('count');
        const kword_para = req.url.searchParams.get('kword');
        const type_para = req.url.searchParams.get('type');

        const id = Number(id_para);
        const ip = ip_para?.trim();
        const count = Number(count_para);
        const kword = kword_para?.trim();
        const type = type_para?.trim();

        let selected_data: Apothegm[];

        if (id_para && id >= 0) {
            selected_data = apothegm.filter(e => {
                return e.id == id;
            });
        } else {
            selected_data = apothegm.filter(e => {
                return (!ip_para || e.ip == ip) && e.is_deleted == false
                    && (!kword_para || e.title.match(kword) || e.content.match(kword))
                    && (!type_para || type == e.type);
            }).sort((a, b) => {
                return a.reply_date.localeCompare(b.reply_date);
            });
            if (count && selected_data.length > count) {
                selected_data = selected_data.slice(0, count - 1);
            }
        }
        // append reply
        selected_data.forEach((e) => {
            e.replies = reply.filter((r) => { return r.pid == e.id; });
        })
        return res(
            ctx.json(selected_data),
            ctx.status(200),
        )
    }),
    rest.post('./api/apothegm.php', (req, res, ctx) => {
        let date = new Date().toDateString();

        apothegm.push(({
            id: next_apothegm_id++,
            title: (req.body['title'] as string)?.trim(),
            content: (req.body['content'] as string)?.trim(),
            type: (req.body['desc'] as string)?.trim() as ApothegmType,
            like: req.body['like'],
            dislike: req.body['dislike'],
            ip: (req.body['ip'] as string)?.trim(),
            gesture: 0,
            is_top: false,
            replies: [],
            reply_date: date,
            is_deleted: false,
            create_date: date,
            update_date: date,
        }));
        return res(
            ctx.json(true),
            ctx.status(200),
        )
    }),
    rest.delete('./api/apothegm.php', (req, res, ctx) => {
        const id = req.body['id'] as number;
        let result = false;
        for (let e of apothegm) {
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
    rest.patch('./api/apothegm.php', (req, res, ctx) => {
        const id_para: string = req.body['id'];
        const title_para: string = req.body['title'];
        const content_para: string = req.url.searchParams.get('content');
        const type_para: string = req.body['type'];
        const gesture: number = req.body['gesture'];
        const like_para: number = req.body['like'];
        const dislike_para: number = req.body['dislike'];
        const ip_para: string = req.body['ip'];
        const is_deleted_para: boolean = req.body['is_deleted'];
        const reply_date_para: string = req.body['reply_date'];

        const id = Number(id_para);

        let result = false;
        apothegm.every((e) => {
            if (e.id == id) {
                e.title = title_para ? title_para.trim() : e.title;
                e.content = content_para ? content_para.trim() : e.content;
                e.type = type_para ? type_para.trim() as ApothegmType : e.type;
                e.gesture = gesture ? gesture : e.gesture;
                e.like = like_para ? like_para : e.like;
                e.dislike = dislike_para ? dislike_para : e.dislike;
                e.ip = ip_para ? ip_para.trim() : e.ip;
                e.is_deleted = is_deleted_para ? is_deleted_para : e.is_deleted;
                e.reply_date = reply_date_para ? e.reply_date : new Date().toDateString();
                e.update_date = new Date().toDateString();
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
    // rest.get('./api/reply.php', (req, res, ctx) => {
    //     return res(
    //         ctx.json(''),
    //         ctx.status(200),
    //     )
    // }),
    rest.post('./api/reply.php', (req, res, ctx) => {
        let date = new Date().toDateString();

        reply.push(({
            id: next_reply_id++,
            pid: req.body['pid'],
            content: (req.body['content'] as string)?.trim(),
            like: req.body['like'],
            dislike: req.body['dislike'],
            ip: (req.body['ip'] as string)?.trim(),
            is_deleted: false,
            create_date: date,
            update_date: date,
        }));
        return res(
            ctx.json(true),
            ctx.status(200),
        )
    }),
    rest.delete('./api/reply.php', (req, res, ctx) => {
        const id = req.body['id'] as number;
        let result = false;
        for (let e of reply) {
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
    rest.patch('./api/reply.php', (req, res, ctx) => {
        const id_para: string = req.body['id'];
        const pid_para: number = req.body['pid'];
        const content_para: string = req.url.searchParams.get('content');
        const like_para: number = req.body['like'];
        const dislike_para: number = req.body['dislike'];
        const ip_para: string = req.body['ip'];
        const is_deleted_para: boolean = req.body['is_deleted'];

        const id = Number(id_para);

        let result = false;
        reply.every((e) => {
            if (e.id == id) {
                e.pid = pid_para ? pid_para : e.pid;
                e.content = content_para ? content_para.trim() : e.content;
                e.like = like_para ? like_para : e.like;
                e.dislike = dislike_para ? dislike_para : e.dislike;
                e.ip = ip_para ? ip_para.trim() : e.ip;
                e.is_deleted = is_deleted_para ? is_deleted_para : e.is_deleted;
                e.update_date = new Date().toDateString();
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