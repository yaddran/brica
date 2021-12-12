import { Console } from './console';

import { MkDir } from './actions/mkdir';
import { Rm } from './actions/rm';
import { Cp } from './actions/cp';
import { Sed } from './actions/sed';
import { Rename } from './actions/rename';
import { Unlink } from './actions/unlink';
import { Link } from './actions/link';
import { Chmod } from './actions/chmod';

export class Target {

    private static ACTIONS = {
        mkdir: MkDir,
        rm: Rm,
        cp: Cp,
        sed: Sed,
        rename: Rename,
        unlink: Unlink,
        link: Link,
        chmod: Chmod
    };

    private static _target: any = null;
    private static _actions: Array<any> = null;

    private static _f(flag: string, flags: Array<string> = null): boolean {
        if (!flag) return false;
        if (!flags) flags = this._target.flags;
        if (!Array.isArray(flags)) return false;
        return flags.indexOf(flag) >= 0;
    }

    private static _info(): void {
        Console.i('');
        if (this._f('title') && this._target.title) Console.i(this._target.title);
        if (this._f('description') && this._target.description) Console.l(this._target.description);
    }

    private static _execute_next_action(): void {
        const action: any = this._actions.shift();
        if (!action) return;
        if (this._f('title', action.flags) && action.title) Console.i(action.title);
        if (!this.ACTIONS[action.action]) {
            Console.e('Action ' + action.action + ' does not exist');
            return this._execute_next_action();
        }
        this.ACTIONS[action.action].execute(action, () => {
            this._execute_next_action();
        });
    }

    public static execute(target: any): void {
        if (!target) return;

        this._target = target;

        this._info();

        if (!Array.isArray(this._target.actions) || !this._target.actions.length)
            return Console.w('Target has not actions');

        this._actions = this._target.actions;
        this._execute_next_action();
    }

}
