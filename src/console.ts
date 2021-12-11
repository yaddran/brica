import { Colors } from './colors';

export class Console {
    private static TITLE: string = 'brica';

    public static e(text: string): any {
        /* eslint-disable */
        console.log(
            Colors.bg.black + Colors.bright + this.TITLE + Colors.reset +
            Colors.bg.black + Colors.fg.red + ' ERR! ' + Colors.reset +
            text
        );
        /* eslint-enable */
        return Console;
    }

    public static w(text: string): any {
        /* eslint-disable */
        console.log(
            Colors.bg.black + Colors.bright + this.TITLE + Colors.reset +
            Colors.bg.black + Colors.fg.yellow + ' WRN! ' + Colors.reset +
            text
        );
        /* eslint-enable */
        return Console;
    }

    public static i(text: string): any {
        /* eslint-disable */
        console.log(Colors.fg.green + this.TITLE + ': ' + text, Colors.reset);
        /* eslint-enable */
        return Console;
    }

    public static l(text: string): any {
        /* eslint-disable */
        console.log(Colors.fg.green + Colors.dim + this.TITLE + ': ' + text, Colors.reset);
        /* eslint-enable */
        return Console;
    }

    public static d(text: string): any {
        /* eslint-disable */
        console.log(Colors.fg.white + Colors.dim + this.TITLE + ': ' + text, Colors.reset);
        /* eslint-enable */
        return Console;
    }
}
