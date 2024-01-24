sap.ui.define([
	"sap/m/MessageToast",
	"sap/ui/core/mvc/Controller",
	"sap/ui/Device",
	"sap/base/Log"
], function (MessageToast, Controller, Device, Log) {
	"use strict";

	return Controller.extend("sap.m.sample.SplitApp.C", {

		onInit: function () {
			this.getSplitAppObj().setHomeIcon({
				'phone': 'phone-icon.png',
				'tablet': 'tablet-icon.png',
				'icon': 'desktop.ico'
			});

			Device.orientation.attachHandler(this.onOrientationChange, this);
		},

		onExit: function () {
			Device.orientation.detachHandler(this.onOrientationChange, this);
		},

		onOrientationChange: function (mParams) {
			var sMsg = "Orientation now is: " + (mParams.landscape ? "Landscape" : "Portrait");
			MessageToast.show(sMsg, { duration: 5000 });
		},

		onPressNavToDetail: function () {
			this.getSplitAppObj().to(this.createId("detailDetail"));
		},

		onPressDetailBack: function () {
			this.getSplitAppObj().backDetail();
		},

		onPressMasterBack: function () {
			this.getSplitAppObj().backMaster();
		},

		onPressGoToMaster: function () {
			this.getSplitAppObj().toMaster(this.createId("master2"));
		},

		onListItemPress: function (oEvent) {
			var sToPageId = oEvent.getParameter("listItem").getCustomData()[0].getValue();

			this.getSplitAppObj().toDetail(this.createId(sToPageId));
		},

		onPressModeBtn: function (oEvent) {
			var sSplitAppMode = oEvent.getSource().getSelectedButton().getCustomData()[0].getValue();

			this.getSplitAppObj().setMode(sSplitAppMode);
			MessageToast.show("Split Container mode is changed to: " + sSplitAppMode, { duration: 5000 });
		},

		getSplitAppObj: function () {
			var result = this.byId("SplitAppDemo");
			if (!result) {
				Log.info("SplitApp object can't be found");
			}
			return result;
		},
		onSearch: function () {
			MessageToast.show("ggg");
		  },
	  
		  onLogout: function () {
			this.getOwnerComponent().getRouter().navTo("RouteLogin"); // not working 
		  },
	  
		  onToggleMenu: function () {
			this.byId("navContainer").to(this.byId("menuPage"), "show");
		  },
	  
		  onMenuItemPress: function (oEvent) {
			MessageToast.show("Menu Item Pressed: " + oEvent.getSource().getTitle());
	  
			this.byId("navContainer").back();
		  },
		onOpenAddDialog: function () {
			this.getView().byId("OpenDialog").open();
		 },
		 onCancelDialog: function (oEvent) {
			oEvent.getSource().getParent().close();
		 },
		 onCreate: function () {
			var oSo = this.getView().byId("idSo").getValue();
			if (oSo !== "") {
				const oList = this._oTable;
					const oBinding = oList.getBinding("items");
					const oContext = oBinding.create({
						"soNumber": this.byId("idSo").getValue(),
						"customerName": this.byId("idCustName").getValue(),
						"customerNumber": this.byId("idCustomer").getValue(),
						"PoNumber": this.byId("idPo").getValue(),
						"inquiryNumber": this.byId("idInqNumber").getValue()      
					});
					oContext.created()
					.then(()=>{
							// that._focusItem(oList, oContext);
							this.getView().byId("OpenDialog").close();
					});

			}else {
				MessageToast.show("So cannot be blank");
			}

		},
		onEditMode: function(){
			this.byId("editModeButton").setVisible(false);
			this.byId("saveButton").setVisible(true);
			this.byId("deleteButton").setVisible(true);
			this.rebindTable(this.oEditableTemplate, "Edit");
			//this.rebindTable(this.oEditableTemplate, "Edit");

	   },
	   onDelete: function(){

		var oSelected = this.byId("table0").getSelectedItem();
		if(oSelected){
			var oSalesOrder = oSelected.getBindingContext("mainModel").getObject().soNumber;
		
			oSelected.getBindingContext("mainModel").delete("$auto").then(function () {
				MessageToast.show(oSalesOrder + " SuccessFully Deleted");
			}.bind(this), function (oError) {
				MessageToast.show("Deletion Error: ",oError);
			});
		} else {
			MessageToast.show("Please Select a Row to Delete");
		}
		
	},
	rebindTable: function(oTemplate, sKeyboardMode) {
		this._oTable.bindItems({
			path: "mainModel>/SalesOrder",
			template: oTemplate,
			templateShareable: true
		}).setKeyboardMode(sKeyboardMode);
	},
	onInputChange: function(){
		this.refreshModel("mainModel");

	},
	
refreshModel: function (sModelName, sGroup){
		return new Promise((resolve,reject)=>{
			this.makeChangesAndSubmit.call(this,resolve,reject,
			sModelName,sGroup);
		});
		
	},
	makeChangesAndSubmit: function (resolve, reject, sModelName,sGroup){
		const that = this;
		sModelName = "mainModel";
		sGroup = "$auto";
		if (that.getView().getModel(sModelName).hasPendingChanges(sGroup)) {
			that.getView().getModel(sModelName).submitBatch(sGroup).then(oSuccess =>{
				that.makeChangesAndSubmit(resolve,reject, sModelName,sGroup);
				MessageToast.show("Record updated Successfully");
			},reject)
			.catch(function errorHandler(err) {
				MessageToast.show("Something Went Wrong ",err.message); // 'Oops!'
			  });
		} else {
			that.getView().getModel(sModelName).refresh(sGroup);
			resolve();
		}
	},
	onSave: function(){
		this.getView().byId("editModeButton").setVisible(true);
		this.getView().byId("saveButton").setVisible(false);
		this._oTable.setMode(sap.m.ListMode.None);
		this.rebindTable(this.oReadOnlyTemplate, "Navigation");
		
	},
	_createReadOnlyTemplates: function () {
		this.oReadOnlyTemplate = new sap.m.ColumnListItem({
		cells: [
			new sap.m.Text({
				text: "{mainModel>soNumber}"
			}),
			new sap.m.Text({
				text: "{mainModel>customerName}"
			}),
			new sap.m.Text({
				text: "{mainModel>customerNumber}"
			}),
			new sap.m.Text({
				text: "{mainModel>PoNumber}"
			}),
			new sap.m.Text({
				text: "{mainModel>inquiryNumber}"
			})
		]
	});
},

	});
});