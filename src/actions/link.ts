import { Tools } from './tools';

export class Link {

    public static execute(action: any, done: any): void {
        if (typeof done !== 'function') done = Tools.noop.bind(this);
        if (!action) return done();
        if (!action.target) return done();
        if (!action.source) return done();

        const abst: string = Tools.resolvePath(action.target);
        const abss: string = Tools.resolvePath(action.source);

        Tools.rm(abst, false);
        Tools.rm(abst, true);
        Tools.link(abss, abst);

        done();
    }
}
