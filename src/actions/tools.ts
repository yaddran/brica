import { resolve, join, dirname, basename, sep } from 'path';
import { Dirent, Stats, readdirSync, rmdirSync, statSync, unlinkSync, mkdirSync, copyFileSync, readFileSync, appendFileSync, writeFileSync, renameSync, symlinkSync, chmodSync } from 'fs';

export type FileMatcher = Array<any>;

export class Tools {

    private static ALL_SEP: Array<string> = ['/', '\\', sep];

    private static _cwd: string = process.cwd();

    public static noop(): void { return; }

    public static self(path: string): boolean {
        if (!path) return false;
        const last: string = path.substr(-1);
        return this.ALL_SEP.indexOf(last) < 0;
    }

    public static resolvePath(path: string): string {
        if (!path) return null;
        return resolve(this._cwd, path);
    }

    public static isD(path: string): boolean {
        if (!path) return false;
        try {
            const s: Stats = statSync(path);
            if (!s) return false;
            return s.isDirectory();
        } catch (ignore) {
            return false;
        }
    }

    public static fileMatcher(list: Array<any>): FileMatcher {
        const on: boolean = Array.isArray(list) && list.length > 0;
        if (!on) return null;
        const matcher: FileMatcher = [];
        let mone: any;
        list.forEach((m: any) => {
            if (!m) return;
            if (!m.name && m.dir === undefined) return;
            mone = {};
            if (m.name) mone.name = new RegExp(m.name, m.flags || '');
            if (m.dir !== undefined) mone.dir = !!m.dir;
            matcher.push(mone);
        });
        if (matcher.length === 0) return null;
        return matcher;
    }

    public static matches(path: string, d: boolean, matcher: FileMatcher): boolean {
        if (!path) return false;
        if (!Array.isArray(matcher)) return false;
        if (matcher.length === 0) return false;
        let match: boolean = false;
        matcher.forEach((m: any) => {
            if (match) return;
            if (!m) return;
            if (m.dir === undefined && !m.name) return;
            if (!m.name) {
                match = d === m.dir;
                return;
            }
            if (m.dir === undefined) {
                match = m.name.test(path);
                return;
            }
            match = d === m.dir && m.name.test(path);
        });
        return match;
    }

    public static walkDir(dir: string, self: boolean, folderFirst:boolean, each: any): void {
        if (typeof each !== 'function') return;

        const files: Array<Dirent> = readdirSync(dir, { withFileTypes: true });
        if (!Array.isArray(files)) {
            if (self) each(dir, true);
            return each(null);
        }

        if (self && folderFirst) each(dir, true);

        files.forEach((f: Dirent) => {
            if (!f) return;
            if (!f.isDirectory()) return;
            this.walkDir(join(dir, f.name), true, folderFirst, (fi: string, d: boolean) => {
                if (!fi) return;
                each(fi, d);
            });
        });

        files.forEach((f: Dirent) => {
            if (!f) return;
            if (f.isDirectory()) return;
            each(join(dir, f.name), false);
        });

        if (self && !folderFirst) each(dir, true);
        each(null);
    }

    public static rm(path: string, d: boolean): void {
        if (!path) return;
        if (d) return rmdirSync(path);
        try {
            unlinkSync(path);
        } catch (ignore) {
            return;
        }
    }

    public static mkdir(path: string, subpath: string = ''): void {
        if (!path) return;
        if (subpath) path = join(path, subpath);
        mkdirSync(path, { recursive: true });
    }

    public static parentD(path: string): string {
        if (!path) return null;
        return dirname(path);
    }

    public static fileName(path: string): string {
        if (!path) return null;
        return basename(path);
    }

    public static copyFile(file: string, folder: string): void {
        if (!file) return;
        if (!folder) return;
        const filename: string = this.fileName(file);
        if (!filename) return;
        copyFileSync(file, join(folder, filename));
    }

    public static copyFileToFolderFile(source: string, folder: string, file: string): void {
        if (!source) return;
        if (!folder) return;
        if (!file) return;
        copyFileSync(source, join(folder, file));
    }

    public static pathAfter(parent: string, path: string): string {
        if (!path) return null;
        if (!parent) return path;
        const ret: string = path.replace(parent, '');
        if (this.ALL_SEP.indexOf(ret.charAt(0)) === 0) return ret.substr(1);
        return ret;
    }

    public static appendFile(file: string, destination: string): Buffer {
        if (!file) return;
        if (!destination) return;
        appendFileSync(destination, readFileSync(file));
    }

    public static readFile(file: string): string {
        if (!file) return '';
        const data: Buffer = readFileSync(file);
        if (!data) return '';
        return data.toString();
    }

    public static writeFile(file: string, data: string): string {
        if (!file) return '';
        data = data || '';
        writeFileSync(file, data);
    }

    public static renameFile(source: string, target: string): void {
        if (!source) return;
        if (!target) return;
        renameSync(source, target);
    }

    public static link(source: string, target: string): void {
        if (!source) return;
        if (!target) return;
        symlinkSync(source, target);
    }

    public static chmod(target: string, mode: number): void {
        if (target) return;
        if (mode === undefined) return;
        chmodSync(target, mode);
    }
}
