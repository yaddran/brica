import { Tools } from './tools';

export class MkDir {

    public static execute(action: any, done: any): void {
        if (typeof done !== 'function') done = Tools.noop.bind(this);
        if (!action) return done();
        if (!action.target) return done();

        const abst: string = Tools.resolvePath(action.target);
        Tools.mkdir(abst);
        done();
    }
}
