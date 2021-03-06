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
	"use strict";
	var initialConfig = {
		rpcService  :"dropbox"
	};
	Ext.apply(initialConfig, config);
	OMV.Module.Services.dropbox.superclass.constructor.call(this, initialConfig);
};

Ext.extend(OMV.Module.Services.dropbox, OMV.FormPanelExt, {

	initComponent:function () {
		"use strict";
		OMV.Module.Services.dropbox.superclass.initComponent.apply(this, arguments);
	},

	/* Overridden to refresh loaded data instead of original form fields */
	reset        :function () {
		"use strict";
		this.doLoad();
	},

	/* Overridden to populate folders */
	doSubmit     :function () {
		"use strict";
	},

	getFormItems:function () {
		"use strict";
		return [
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
						xtype	  :"textfield",
						name 	  :"login",
						fieldLabel:_("Dropbox login"),
						allowNone : false,
						plugins   :[ OMV.form.plugins.FieldInfo ],
						infoText  :_("The login that you use to log into dropbox")
					},
					{
						xtype     :"textfield",
						inputType :"password",
						name      :"password",
						fieldLabel:_("Dropbox password"),
						allowNone : false,
						plugins   :[ OMV.form.plugins.FieldInfo ],
						infoText  :_("The password taht you use to log into dropbox")
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
		];
	}
});


OMV.NavigationPanelMgr.registerPanel("services", "dropbox", {
	cls:OMV.Module.Services.dropbox
});
