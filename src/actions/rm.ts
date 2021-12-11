import { Tools, FileMatcher } from './tools';

export class Rm {

    public static execute(action: any, done: any): void {
        if (typeof done !== 'function') done = Tools.noop.bind(this);
        if (!action) return done();
        if (!action.target) return done();

        const abst: string = Tools.resolvePath(action.target);
        if (!Tools.isD(abst)) {
            Tools.rm(abst, false);
            return done();
        }

        const self: boolean = Tools.self(action.target);
        const exc: FileMatcher = Tools.fileMatcher(action.exclude);
        const inc: FileMatcher = Tools.fileMatcher(action.include);

        Tools.walkDir(abst, self, false, (f: string, d: boolean) => {
            if (!f) return done();
            if (Tools.matches(f, d, exc)) return;
            if (inc && !Tools.matches(f, d, inc)) return;
            Tools.rm(f, d);
        });
    }
}
