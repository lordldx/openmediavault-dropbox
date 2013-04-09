Ext.ns("OMV.Module.Services");

// Register the menu
OMV.NavigationPanelMgr.registerMenu("services", "dropbox", {
	text:_("Dropbox"),
	icon:"images/dropbox.png"
});

/**
 * @class OMV.Module.Services.dropbox
 * @derived OMV.FormPanelExt
 * @param config
 */
OMV.Module.Services.dropbox = function (config) {
	var initialConfig = {
		rpcService  :"dropbox",
	};
	Ext.apply(initialConfig, config);
	OMV.Module.Services.dropbox.superclass.constructor.call(this, initialConfig);
};

Ext.extend(OMV.Module.Services.dropbox, OMV.FormPanelExt, {

	initComponent:function () {

		OMV.Module.Services.dropbox.superclass.initComponent.apply(this, arguments);
	},

	/* Overridden to refresh loaded data instead of original form fields */
	reset        :function () {
		this.doLoad();
	},

	/* Overridden to populate folders */
	doSubmit     :function () {

	},

	getFormItems:function () {
		return 
		[
			{
				xtype   :"fieldset",
				title   :_("General settings"),
				defaults:{
					labelSeparator:""
				},
				items   :[
					{
						xtype     :"checkbox",
						name      :"enable",
						fieldLabel:_("Enable"),
						checked   :false,
						inputValue:1
					},
					{
						xtype: "sharedfoldercombo",
						name: "sharedfolderref",
						hiddenName: "sharedfolderref",
						fieldLabel: _("Shared folder"),
						allowNone: false,
						plugins: [ OMV.form.plugins.FieldInfo ],
						infoText: _("The location into which dropbox will synchronize")
					}
				]
			}
		]
	}

});


OMV.NavigationPanelMgr.registerPanel("services", "dropbox", {
	cls:OMV.Module.Services.dropbox
});
