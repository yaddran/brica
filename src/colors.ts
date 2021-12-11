export class Colors {
    public static reset = '\x1b[0m';
    public static bright = '\x1b[1m';
    public static dim = '\x1b[2m';
    public static underscore = '\x1b[4m';
    public static blink = '\x1b[5m';
    public static reverse = '\x1b[7m';
    public static hidden = '\x1b[8m';

    public static fg = {
        black: '\x1b[30m',
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        magenta: '\x1b[35m',
        cyan: '\x1b[36m',
        white: '\x1b[37m',
        crimson: '\x1b[38m',
    };
    public static bg = {
        black: '\x1b[40m',
        red: '\x1b[41m',
        green: '\x1b[42m',
        yellow: '\x1b[43m',
        blue: '\x1b[44m',
        magenta: '\x1b[45m',
        cyan: '\x1b[46m',
        white: '\x1b[47m',
        crimson: '\x1b[48m'
    };
}
