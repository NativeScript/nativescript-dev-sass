var converter = require('./converter');

module.exports = function ($logger, $projectData, $usbLiveSyncService) {
	var liveSync = $usbLiveSyncService.isInitialized;
	var bundle = $projectData.$options.bundle;
	if (liveSync || bundle) {
		return;
	}
	
	return converter.convert($logger, $projectData.projectDir);
}
