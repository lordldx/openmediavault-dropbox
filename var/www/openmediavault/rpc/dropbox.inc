<?php
require_once("openmediavault/object.inc");
require_once("openmediavault/error.inc");
require_once("openmediavault/util.inc");
require_once("openmediavault/rpc.inc");

class DropboxRpc extends OMVRpc {
	
	const xpathRoot = '//services/dropbox'

	public function __construct() 
	{
		$this->methodSchemata = array(
			"set" => array(
				'{
					"type": "object",
					"properties": {
						"enable": {"type": "boolean"},
						"sharedfolderref":{' . $GLOBALS['OMV_JSONSCHEMA_UUID_NONE'] . '}
					}
				}'
			)
		);		
	}
	

	/**
	 * Get configuration object
	 */
	function get() 
	{
		global $xmlConfig;

		// Check permissions
		$this->validateSession();
		if (!$this->hasRole(OMV_ROLE_ADMINISTRATOR)) {
			throw new OMVException(OMVErrorMsg::E_RPC_SERVICE_INVALID_PERMISSION);
		}
		$this->commitSession();

		// Get configuration object
		$object = $xmlConfig->get($xpathRoot);
		if (is_null($object)) {
			throw new OMVException(OMVErrorMsg::E_CONFIG_GET_OBJECT_FAILED,
			  $xpathRoot);
		}

		// Modify result data
		$object['enable'] = boolval($object['enable']);

		return $object;
	}

	/**
	 * Set configuration
	 */
	function set($data) 
	{
		global $xmlConfig;

		// Check permissions
		$this->validateSession();
		if (!$this->hasRole(OMV_ROLE_ADMINISTRATOR)) {
			throw new OMVException(OMVErrorMsg::E_RPC_SERVICE_INVALID_PERMISSION);
		}
		$this->commitSession();

		// Validate method parameters
		$this->validateParams(__METHOD__, func_get_args());

		// Prepare configuration data
		$object = array(
			"enable" => array_boolval($data, 'enable'),
			"sharedfolderref" => $data['sharedfolderref'],
		);

		// Set configuration object
		if (FALSE === $xmlConfig->replace($xpathRoot, $object)) {
			throw new OMVException(OMVErrorMsg::E_CONFIG_SET_OBJECT_FAILED);
		}

		// Save configuration
		if (FALSE === $xmlConfig->save()) {
			throw new OMVException(OMVErrorMsg::E_CONFIG_SAVE_FAILED,
			  $xmlConfig->getError());
		}

		// Notify configuration changes
		$dispatcher = &OMVNotifyDispatcher::getInstance();
		$dispatcher->notify(OMV_NOTIFY_MODIFY,
		  "org.openmediavault.services.dropbox", $object);
	}
}

?>