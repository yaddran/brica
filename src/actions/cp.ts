import { Tools, FileMatcher } from './tools';

export class Cp {

    public static execute(action: any, done: any): void {
        if (typeof done !== 'function') done = Tools.noop.bind(this);
        if (!action) return done();
        if (!action.target) return done();

        const abst: string = Tools.resolvePath(action.target);
        const abstd: string = action.join ? Tools.parentD(abst) : abst;

        if (!abstd) return done();

        Tools.mkdir(abstd);

        const abss: string = Tools.resolvePath(action.source);
        const self: boolean = Tools.self(action.source);
        const abssd: string = self ?  Tools.parentD(abss) : abss;

        if (!Tools.isD(abss)) {
            Tools.copyFile(abss, abstd);
            return done();
        }

        const exc: FileMatcher = Tools.fileMatcher(action.exclude);
        const inc: FileMatcher = Tools.fileMatcher(action.include);

        Tools.walkDir(abss, self, true, (f: string, d: boolean) => {
            if (!f) return done();
            if (Tools.matches(f, d, exc)) return;
            if (inc && !Tools.matches(f, d, inc)) return;
            if (action.join) {
                if (d) return;
                return Tools.appendFile(f, abst);
            }
            const sd: string = Tools.pathAfter(abssd, f);
            if (d) return Tools.mkdir(abstd, sd);
            Tools.copyFileToFolderFile(f, abstd, sd);
        });
    }
}
