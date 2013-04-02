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
		layout      :"vbox",
		layoutConfig:{
			align:"stretch"
		}
	};
	Ext.apply(initialConfig, config);
	OMV.Module.Services.dropbox.superclass.constructor.call(this, initialConfig);


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
						xtype     :"textfield",
						name      :"name",
						width     :300,
						value     :_("MiniDLNA on OpenMediaVault"),
						fieldLabel:_("Name"),
						plugins   :[ OMV.form.plugins.FieldInfo ],
						infoText  :_("The name that is displayed to DLNA clients.")
					},
					{
						xtype        :"numberfield",
						name         :"port",
						fieldLabel   :_("Port"),
						vtype        :"port",
						minValue     :0,
						maxValue     :65535,
						allowDecimals:false,
						allowNegative:false,
						allowBlank   :false,
						value        :8200,
						plugins      :[ OMV.form.plugins.FieldInfo ],
						infoText     :_("Port to listen on.")
					},
					{
						xtype     :"checkbox",
						name      :"strict",
						fieldLabel:_("Strict DLNA"),
						boxLabel  :_("Strictly adhere to DLNA standards"),
						checked   :false,
						inputValue:1,
						plugins   :[ OMV.form.plugins.FieldInfo ],
						infoText  :_("This will allow server-side downscaling of very large JPEG images")
					},
					{
						xtype     :"checkbox",
						name      :"tivo",
						fieldLabel:_("TiVo support"),
						checked   :false,
						inputValue:1
					},
					{
						xtype     :"checkbox",
						name      :"rescan",
						fieldLabel:_("Media Rescan"),
						checked   :false,
						inputValue:1,
						boxLabel  :_("Force a complete rescan of all media folders")
					},
					{
						xtype:"label",
						html :_("A complete rescan should not normally be needed. When files / folders are updated (added/deleted/modified), miniDLNA will automatically rescan updated items.") + "<br /><br />"
					}
				]
			},
			{
				xtype       :"panel",
				frame       :true,
				title       :_("Media Folders (Media folders and files must be readable by the 'minidlna' user)"),
				layout      :'fit',
				boxMinHieght:200,
				flex        :1,
				items       :[
					{
						xtype     :"grid",
						id        :'minidlna-shares-grid',
						tbar      :[
							{
								id     :this.getId() + "-add",
								xtype  :"button",
								text   :_("Add"),
								icon   :"images/add.png",
								handler:function () {
									var wnd = new OMV.Module.Services.MiniDLNAFolderPropertyDialog({uuid:OMV.UUID_UNDEFINED});
									wnd.show();
								}
							},
							{
								id     :this.getId() + "-edit",
								xtype  :"button",
								text   :_("Edit"),
								icon   :"images/edit.png",
								handler:function (b) {
									var record = b.ownerCt.ownerCt.getSelectionModel().getSelected();
									var wnd = new OMV.Module.Services.MiniDLNAFolderPropertyDialog({
										uuid :'dummy',
										sfref:record.get('sfref'),
										mtype:record.get('mtype')
									});
									wnd.show();
								}
							},
							{
								id     :this.getId() + "-remove",
								xtype  :"button",
								text   :_("Remove"),
								icon   :"images/delete.png",
								handler:function (b) {
									b.ownerCt.ownerCt.getStore().remove(b.ownerCt.ownerCt.getSelectionModel().getSelected());
								}
							}
						],
						viewConfig:{ forceFit:true },
						sm        :new Ext.grid.RowSelectionModel({
							singleSelect:true
						}),
						store     :new Ext.data.SimpleStore({
							fields:[
								{ name:"sfref" },
								{ name:"name" },
								{ name:"mtype" }
							],
							data  :[ ]
						}),
						columns   :[
							{
								header   :_("Share"),
								dataIndex:"name"
							},
							{
								header   :"Content Type(s)",
								dataIndex:"mtype",
								renderer :function (val) {

									switch (val) {
										case 'A':
											return _('Audio');
										case 'V':
											return _('Video');
										case 'P':
											return _('Images');
									}
									return _('All');
								}
							}
						]
					}
				]
			}
		];
	}

});
OMV.NavigationPanelMgr.registerPanel("services", "minidlna", {
	cls:OMV.Module.Services.MiniDLNA
});
