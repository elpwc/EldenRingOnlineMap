export enum MapPointType {
    Empty = '',
    Boss = 'boss',
    LittleBoss = 'littboss',
    NPC = 'npc',
    GoldenSeed = 'goldseed',
    Magic = 'magic',
    Weapon = 'weapon',
}

export type MapPoint = {
    id: number;
    type: MapPointType;
    name: string,
    desc: string,
    lng: number;
    lat: number;
    like: number;
    dislike: number;
    ip: string;
    is_deleted: boolean;
    create_date: string;
    update_date: string;

}

export type Apothegm = {
    id: number;
    content: string;
    tags: string;
    gesture: number;
    like: number;
    dislike: number;
    ip: string;
    is_deleted: boolean;
    create_date: string;
    update_date: string;
}