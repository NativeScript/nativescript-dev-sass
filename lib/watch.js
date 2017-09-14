var converter = require('./converter');

module.exports = function (logger, projectData, usbLiveSyncService) {
	return converter.convert(logger, projectData.projectDir, { watch: true });
}
