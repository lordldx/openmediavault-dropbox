<?php
require_once("openmediavault/module.inc");
require_once("openmediavault/config.inc");
require_once("openmediavault/error.inc");
require_once("openmediavault/util.inc");
require_once("openmediavault/initscript.inc");
require_once("openmediavault/log.inc");

class DropboxModule extends OMVModuleAbstract implements OMVINotifyListener, OMVIModuleStatus {

	/**
	 * Get the module name.
	 */
	public static function getName()
	{
		return "dropbox";
	}

	/**
	 * Get the module status.
	 */
	public function getStatus()
	{
		global $xmlConfig;
		// Get the configuration object
		$xpath  = "//services/dropbox";
		$object = $xmlConfig->get($xpath);
		if (is_null($object))
		{
			throw new OMVException(OMVErrorMsg::E_CONFIG_GET_OBJECT_FAILED, $xpath);
		}
		$initd = new OMVSysVInitScript("dropbox");
		return array(
			"name"    => $this->getName(),
			"title"   => "Dropbox",
			"enabled" => boolval($object['enable']),
			"running" => ($initd->status() == 0)
		);
	}

	/**
	 * Checks to see if dropbox has been initialized yet (i.e. has this computer been bound to a dropbox account?)
	 */
	private function isInitialized()
	{

	}

	/**
	 * Initializes the component (i.e. links this computer to the provided dropbox account)
	 */
	private function initialize()
	{

	}

	/**
	 * Create the configuration file and update the service.
	 */
	public function updateService($conf, $oldconf, $rescan)
	{
		$initd = new OMVSysVInitScript("dropbox");

		if ($conf['enable'])
		{
			if ($oldconf['enable'])
			{
				$initd->restart();
			}
			else
			{
				if (!isInitialized())
					initialize();
				$initd->start();
			}

		}
		else if ($oldconf['enable'])
		{
			$initd->stop();
		}
	}

	/**
	 * Bind listeners.
	 */
	function bindListeners(OMVNotifyDispatcher $dispatcher)
	{

		// Update service if configuration has been modified
		$dispatcher->addListener(OMV_NOTIFY_MODIFY, "org.openmediavault.services.dropbox", array($this, "updateService"), 1);

	}
}

// Register module
$moduleMgr = &OMVModuleMgr::getInstance();
$moduleMgr->registerModule(new DropboxModule());

?>