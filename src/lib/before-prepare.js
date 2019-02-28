var converter = require('./converter');

module.exports = function ($logger, $projectData, $usbLiveSyncService) {
	var liveSync = $usbLiveSyncService.isInitialized;
	var bundle = $projectData.$options.bundle;
	if (liveSync || bundle) {
		$logger.trace("Hook skipped because either bundling or livesync is in progress.")
		return;
	}

	return converter.convert($logger, $projectData.projectDir, $projectData.appDirectoryPath, $projectData.appResourcesDirectoryPath);
}