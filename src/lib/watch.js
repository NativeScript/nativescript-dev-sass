var converter = require('./converter');

module.exports = function (logger, projectData, usbLiveSyncService, hookArgs) {
	if (hookArgs.config) {
		const appFilesUpdaterOptions = hookArgs.config.appFilesUpdaterOptions;
		if (appFilesUpdaterOptions.bundle) {
			logger.trace("Hook skipped because bundling is in progress.")
			return;
		}
	}

	return converter.convert(logger, projectData.projectDir, projectData.appDirectoryPath, projectData.appResourcesDirectoryPath, { watch: true });
}