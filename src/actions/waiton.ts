import { Tools } from './tools';

export class WaitOn {

    public static execute(action: any, done: any): void {
        if (typeof done !== 'function') done = Tools.noop.bind(this);
        if (!action) return done();
        if (!action.target) return done();

        const abst: string = Tools.resolvePath(action.target);

        if (Tools.exists(abst)) return done();

        const toi = setInterval(() => {
            if (!Tools.exists(abst)) return;
            clearInterval(toi);
            done();
        }, 1000);
    }

}
