import { Tools } from './tools';

export class Sed {

    private static get_replace_value(r: any): any {
        if (!r) return '';
        if (r.json === undefined || r.property === undefined) return r.replace || '';
        if (!r.json) return '';
        if (!Array.isArray(r.property)) return '';
        if (!r.property.length) return '';
        const f = Tools.readFile(r.json);
        if (!f) return '';
        let v: any;
        try {
            v = JSON.parse(f);
        } catch (ignore) {
            v = '';
        }
        if (typeof v !== 'object') return '';
        r.property.forEach((p: string) => {
            if (!v) return;
            v = v[p];
        });
        if (typeof v === 'object') return JSON.stringify(v);
        return v;
    }

    public static execute(action: any, done: any): void {
        if (typeof done !== 'function') done = Tools.noop.bind(this);
        if (!action) return done();
        if (!action.target) return done();
        if (!Array.isArray(action.replace)) return done();
        if (action.replace.length === 0) return done();

        const abst: string = Tools.resolvePath(action.target);

        if (Tools.isD(abst)) return done();

        let data: string = Tools.readFile(abst);
        if (!data) return;

        let reg: RegExp;
        action.replace.forEach((r: any) => {
            if (!r) return;
            reg = new RegExp(r.find, r.flags);
            data = data.replace(reg, this.get_replace_value(r));
        });

        Tools.writeFile(abst, data);

        done();
    }
}
