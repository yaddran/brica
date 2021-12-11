const go = () => {
    const path = require('path');
    const fs = require('fs');

    const currdir = process.cwd();
    process.chdir(path.join(currdir, 'node_modules'));

    fs.unlink('brica', () => {
        fs.symlink(path.join('..', 'dist'), 'brica', (e) => {
            if (e) console.log('Link for self node_modules error', e);
            process.chdir(path.join(currdir, 'node_modules', '.bin'));
            fs.unlink('brica', () => {
                fs.symlink(path.join('..', 'brica', 'bin.js'), 'brica', (e) => {
                    if (e) console.log('Link for self node_modules/.bin error', e);
                    fs.chmod('brica', 0o766, (e) => {
                        if (e) console.log('Link executable for self node_modules/.bin error', e);
                    });
                });
            });
        });
    });
};

go();
