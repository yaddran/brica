import { Tools } from './tools';

export class Chmod {

    public static execute(action: any, done: any): void {
        if (typeof done !== 'function') done = Tools.noop.bind(this);
        if (!action) return done();
        if (!action.target) return done();
        if (action.mode === undefined) return done();

        const abst: string = Tools.resolvePath(action.target);

        Tools.chmod(abst, action.mode);

        done();
    }
}
