exports.compile = compile;

var fs = require("fs");
var path = require('path');
var spawn = require("child_process").spawn;
var LogProvider = require('./log-provider');

var currentSassProcess = null;

function compile(data) {
	if (currentSassProcess) {
		return Promise.resolve();
	}

	return new Promise((res, rej) => {
		var projectDir = data.projectDir,
			appDir = data.appDir;

		var logger = new LogProvider(data.logger);

		var sassPath = require.resolve('node-sass/bin/node-sass');
		if (fs.existsSync(sassPath)) {
			logger.trace("Found peer node-sass");
		} else {
			isResolved = true;
			rej(new Error('node-sass installation local to project was not found. Install by executing `npm install node-sass`.'));
		}

		var isResolved = false;
		var resolve = () => {
			if (isResolved) {
				return;
			}

			isResolved = true;
			res(currentSassProcess);
		}
		var reject = err => {
			if (isResolved) {
				return;
			}

			isResolved = true;

			err.errorAsWarning = true;
			err.stopExecution = false;

			rej(err);
		}

		// Node SASS Command Line Args (https://github.com/sass/node-sass#command-line-interface)
		// --ouput : Output directory
		// --output-style : CSS output style (nested | expanded | compact | compresed)
		// -q : Supress log output except on error
		// --follow : Follow symlinked directories
		// -r : Recursively watch directories or files
		// --watch : Watch a directory or file
		var nodeArgs = [sassPath, appDir, '--output', appDir, '--output-style', 'compressed', '-q', '--follow', '--importer', path.join(__dirname, "importer.js")];
		logger.trace(process.execPath, nodeArgs.join(' '));

		var env = Object.create(process.env);
		env.PROJECT_DIR = projectDir;
		env.APP_DIR = appDir;

		currentSassProcess = spawn(process.execPath, nodeArgs, { env: env });

		currentSassProcess.stdout.on('data', data => {
			var stringData = data.toString();
			logger.info(stringData);
		});

		currentSassProcess.stderr.on('data', error => {
			var message = '';
			var stringData = error.toString();

			try {
				var parsed = JSON.parse(stringData);
				message = parsed.formatted || parsed.message || stringData;
			} catch (e) {
				message = error.toString();
			}

			logger.info(message);
		});

		currentSassProcess.on('error', error => {
			logger.info(err.message);
			reject(error);
		});

		currentSassProcess.on('exit', (code, signal) => {
			if (code === 0) {
				resolve();
			} else {
				reject(new Error(`SASS compiler failed with exit code ${code}`));
			}

			currentSassProcess = null;
		});
	});
}