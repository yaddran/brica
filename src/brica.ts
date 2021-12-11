import { readFile } from 'fs';

import { Console } from './console';
import { Target } from './target';

/**
 * Main class for brica npm tools. The class does not need to be instantiated.
 * Use public static function execute to start any of the configured targets.
 *
 * @class
 * @public
 */
export class Executer {

    private static _config: any = null;
    private static _target: any = null;

    private static _load_config(config: string, done: any): void {
        this._config = null;
        if (!config) config = '.brica.json';
        readFile(config, (err: Error, data: Buffer) => {
            if (err || !data) {
                Console.e('Config file ' + config + ' could not be loaded');
                if (err) Console.e(err.message);
                process.exit(1);
            }
            try { this._config = JSON.parse(data.toString()); } catch (ignore) { this._config = null; }
            if (!this._config) {
                Console.e('Error parsing config file ' + config);
                process.exit(2);
            }
            done();
        });
    }

    private static _get_target(target: string): void {
        this._target = null;
        if (!this._config) return;
        if (!this._config[target]) return Console.e('Target ' + target + ' not found in config');
        this._target = this._config[target];
    }

    /**
     * Start target from the config file.
     *
     * @param target target name that you wish to start
     * @param config configuration file, if not specified .brica.json from the project root will be used
     * @return void
     *
     * @function
     * @static
     * @memberof Executer
     * @public
     */
    public static execute(target: string, config: string = ''): void {
        this._load_config(config, () => {
            this._get_target(target);
            Target.execute(this._target);
        });
    }
}
