exports.convert = convert;

var spawn = require('child_process').spawn;
var fs = require('fs');
var path = require('path');


function convert(logger, projectDir, options) {
    return new Promise(function (resolve, reject) {
        options = options || {};

        var peerSassPath = path.join(__dirname, '../../node-sass');
        var sassPath = path.join(peerSassPath, 'bin/node-sass');
        var appDir = path.join(projectDir, "app");
        
        if (fs.existsSync(sassPath)) {
            try {
                logger.info('Found peer node-sass');
            } catch (err) { }
        } else {
            throw Error('node-sass installation local to project was not found. Install by executing `npm install node-sass`.');
        }

        var nodeArgs = [sassPath, appDir, '--output', appDir, '--output-style', 'compressed'];
        if (options.watch) {
            nodeArgs.push('-r', '--watch');
        }

        logger.trace(process.execPath, nodeArgs.join(' '));
        var sass = spawn(process.execPath, nodeArgs);

        var isResolved = false;
        var watchResolveTimeout;
        sass.stdout.on('data', function (data) {
            var stringData = data.toString();
            logger.info(stringData);
        });

        sass.stderr.on('data', function (err) {
            var message = '';
            var stringData = err.toString();
            try {
                var parsed = JSON.parse(stringData);
                message = parsed.formatted || parsed.message || stringData;
            } catch (e) {
                message = err.toString();
            }
            logger.info(message);
        });

        sass.on('error', function (err) {
            logger.info(err.message);
            if (!isResolved) {
                isResolved = true;
                reject(err);
            }
        });

        // TODO: Consider using close event instead of exit
        sass.on('exit', function (code, signal) {
            if (!isResolved) {
                isResolved = true;
                if (code === 0) {
                    resolve();
                } else {
                    reject(Error('SASS compiler failed with exit code ' + code));
                }
            }
        });

        // SASS does not recompile on watch, so directly resolve.        
        if (options.watch && !isResolved) {
            isResolved = true;
            resolve();
        }
    });
}
