var converter = require('./converter');

module.exports = function ($logger) {
	var sass = converter.getSassProcess();
	if (sass) {
		$logger.info("Stopping sass watch");
		sass.kill("SIGINT")
	}
}
