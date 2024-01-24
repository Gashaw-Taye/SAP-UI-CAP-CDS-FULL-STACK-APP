// sap.ui.define([
// 	"sap/ui/Device",
// 	"sap/ui/core/mvc/Controller",
// 	"sap/ui/model/json/JSONModel",
// 	"sap/m/Popover",
// 	"sap/m/Button",
// 	"sap/m/library",
// 	"sap/ui/core/Fragment",
// 	"project1/controller/AdditionalPage",
// 	"sap/m/MessageBox",
//     "sap/m/MessageToast",

// ], function (Device, Controller, JSONModel, Popover, Button, library,Fragment,AdditionalPage,MessageBox,MessageToast) {
	
	sap.ui.define([
		"sap/ui/Device",
		"sap/m/Popover",
		'sap/ui/core/mvc/Controller',
		'sap/ui/model/json/JSONModel',
		'sap/m/Button',
		'sap/m/library',
		"sap/m/MessageBox",
		"sap/m/MessageToast",
		"sap/m/ColumnListItem",
		"sap/m/Input",
		"sap/ui/core/Fragment",    
		'sap/ui/core/IconPool',
		'sap/m/Link',
		'sap/m/MessageItem',
		'sap/m/MessageView',
		'sap/m/Bar',
		'sap/m/Title',
		'sap/m/ResponsivePopover',
		"project1/config/Config"
		
	
	], function (Device,Popover,Controller, JSONModel, Button, library,MessageBox,MessageToast,ColumnListItem,Input,Fragment,IconPool, Link, MessageItem, MessageView, Bar, Title,ResponsivePopover,Config) {
	
	"use strict";

	var ButtonType = library.ButtonType,
		PlacementType = library.PlacementType;

	return Controller.extend("project1.controller.Dashpage", {
		_themeHasBeenSet: false, // Add this flag
		onInit: function () {
			
			var oModel = new JSONModel(sap.ui.require.toUrl("project1/model/data.json"));
			this.getView().setModel(oModel);
			this._setToggleButtonTooltip(!Device.system.desktop);

			//message

			var that = this;
			var	oLink = new Link({
				text: "Show more information",
				href: "http://sap.com",
				target: "_blank"
			});

			var oMessageTemplate = new MessageItem({
				type: '{type}',
				title: '{title}',
				description: '{description}',
				subtitle: '{subtitle}',
				counter: '{counter}',
				markupDescription: "{markupDescription}",
				link: oLink
			});

			var aMockMessages = [{
				type: 'Error',
				title: 'Error message',
				description: 'First Error message description. \n' +
				'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod',
				subtitle: 'Example of subtitle',
				counter: 1
			}, {
				type: 'Warning',
				title: 'Warning without description',
				description: ''
			}, {
				type: 'Success',
				title: 'Success message',
				description: 'First Success message description',
				subtitle: 'Example of subtitle',
				counter: 1
			}, {
				type: 'Error',
				title: 'Error message',
				description: 'Second Error message description',
				subtitle: 'Example of subtitle',
				counter: 2
			}, {
				type: 'Information',
				title: 'Information message',
				description: 'First Information message description',
				subtitle: 'Example of subtitle',
				counter: 1
			}];

			var oModel = new JSONModel(),
				that = this;

			oModel.setData(aMockMessages);

			this.oMessageView = new MessageView({
					showDetailsPageHeader: false,
					itemSelect: function () {
						oBackButton.setVisible(true);
					},
					items: {
						path: "/",
						template: oMessageTemplate
					}
				});
			var oBackButton = new Button({
					icon: IconPool.getIconURI("nav-back"),
					visible: false,
					press: function () {
						that.oMessageView.navigateBack();
						that._oPopover.focus();
						this.setVisible(false);
					}
				});

			this.oMessageView.setModel(oModel);

			var oCloseButton =  new Button({
					text: "Close",
					press: function () {
						that._oPopover.close();
					}
				}).addStyleClass("sapUiTinyMarginEnd"),
				oPopoverFooter = new Bar({
					contentRight: oCloseButton
				}),
				oPopoverBar = new Bar({
					contentLeft: [oBackButton],
					contentMiddle: [
						new Title({text: "Messages"})
					]
				});

			this._oPopover = new Popover({
				customHeader: oPopoverBar,
				contentWidth: "440px",
				contentHeight: "440px",
				verticalScrolling: false,
				modal: true,
				content: [this.oMessageView],
				footer: oPopoverFooter,
				placement: "Left",  // Set placement to Left
			});
		},
		onLiveSearch: function (oEvent) {
			alert('this is search')

			var oTable = this.getView().byId("table0");
			var oBinding = oTable.getBinding("items");
			var sQuery = oEvent.getParameter("newValue");
			if (sQuery) {
				var oFilter = new sap.ui.model.Filter({
					filters: [
						new sap.ui.model.Filter("Full_name", sap.ui.model.FilterOperator.Contains, sQuery),
					],
					and: false
				});
				oBinding.filter([oFilter]);
				console.log(oBinding)
	  
			} else {
				// If the search field is empty, remove the filter
				oBinding.filter([]);
			}
		},

		handlePopoverPress: function (oEvent) {
			this.oMessageView.navigateBack();
			this._oPopover.openBy(oEvent.getSource());
			var oButton = oEvent.getSource();

			// Retrieve the notification count from the custom data
			var notificationCount = oButton.getCustomData()[0].getValue(); // Assuming it's the first custom data
		
			// Update the icon with the notification count
			oButton.setIcon("sap-icon://bell" + (notificationCount > 0 ? "-notification" : ""));
		
		},
		  
		// onButtonClick:function(){
		// 	alert('you clicked me')
		//   },

	// profile drop dowen page 

	
		onItemSelect: function (oEvent) {
			var oItem = oEvent.getParameter("item");
			this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));
		},


		switch: function () {
			
			// Handle product switcher pressed event
			var oView = this.getView();
			var oProductSwitcher = oView.byId("x"); // Replace with your actual ID
		  
			if (oProductSwitcher) {
				if (!this._oNotificationSwitcherPopover) {
					Fragment.load({
						id: oView.getId(),
						name: "project1.view.Notification",
						controller: this
					}).then(function (oPopover) {
						this._oNotificationSwitcherPopover = oPopover;
						oView.addDependent(this._oNotificationSwitcherPopover);
						this._oNotificationSwitcherPopover.openBy(oProductSwitcher);
					}.bind(this));
				} else {
					this._oNotificationSwitcherPopover.openBy(oProductSwitcher);
				}
			} else {
				// Log an error or handle the case where the product switcher is not found
				console.error("Notfication switcher control not found.");
			}
		  },
		  // bellow is alternative profile dropdowen menu


		
		
		handleUserNamePress: function (event) {
			var oView = this.getView();
			var oProfileContainer = oView.byId("profile");
			var oPopover = new Popover({
				showHeader: false,
				placement: PlacementType.Bottom,
				content: [
					new Button({
						text: 'profile',
						type: ButtonType.Transparent,
						key:'profile',
						press: function () {
							// Call your logout function here
							this.profile(); // Adjust the function name as per your implementation
						}.bind(this) // Ensure 'this' refers to the current controller
					}),
					new Button({
						text: 'Help',
						type: ButtonType.Transparent,
						press: function () {
							// Call your logout function here
							this.help(); // Adjust the function name as per your implementation
						}.bind(this) // Ensure 'this' refers to the current controller
					}),
					new Button({
						text: 'Logout',
						type: ButtonType.Transparent,
						press: function () {
							// Call your logout function here
							this.onLogout(); // Adjust the function name as per your implementation
						}.bind(this) // Ensure 'this' refers to the current controller
					})
				]
			}).addStyleClass('sapMOTAPopover sapTntToolHeaderPopover');

			oPopover.openBy(event.getSource());
		},

		onSwitcherItemSelect: function (oEvent) {
			// Get the selected item
			
			var oSelectedItem = oEvent.getParameter("listItem");
	
			if (oSelectedItem) {
				// Retrieve the selected value
				var sSelectedTitle = oSelectedItem.getTitle();
			   
			  if(sSelectedTitle==='Sign out')
				{
				  this.onLogout(); 
	
				}
				else{
				  alert('setting button cilked')
				}
				// Now you can use the selected value as needed
				console.log("Selected Value: " + sSelectedTitle);
			}
		},

		onLogout: function(oEvent) {       
			MessageBox.show(
				"Do you want to Logout.", {
					icon: MessageBox.Icon.INFORMATION,
					title: "confirmation Box",
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					emphasizedAction: MessageBox.Action.YES,
					onClose: function(oAction) {
						if (oAction === 'YES') {
							this.logout(); // Call the function using 'this.onDelete'
						}
					}.bind(this) // Ensure 'this' refers to the controller within the onClose callback
				}
			);
		},
		
		logout: function(oRecord) {
		  // alert("You are successfully logedout");
	  
		  localStorage.removeItem("isLoggedIn");
		  
		  var oLoginController = window.loginController;
		  if (oLoginController) {
			  var oUsernameInput = oLoginController.byId("user"); // Replace with your actual ID
			  var oPasswordInput = oLoginController.byId("pwd"); // Replace with your actual ID
			  oUsernameInput.setValue("");
			  oPasswordInput.setValue("");
		  }
		  this.getOwnerComponent().getRouter().navTo("RouteLogin");	
		   
		},
		// onCloseButtonPress: function () {
		// 	var oPopover = this.getView().byId("closepop"); // Replace "yourPopoverId" with the actual ID of your Popover
		// 	oPopover.close();
		//   },		  

		onSideNavButtonPress: function () {
			var oToolPage = this.byId("toolPage");
			var bSideExpanded = oToolPage.getSideExpanded();

			this._setToggleButtonTooltip(bSideExpanded);

			oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
		},

		_setToggleButtonTooltip: function (bLarge) {
			var oToggleButton = this.byId('sideNavigationToggleButton');
			if (bLarge) {
				oToggleButton.setTooltip('Large Size Navigation');
			} else {
				oToggleButton.setTooltip('Small Size Navigation');
			}
		},
		file:function(){
         MessageToast.show('File Menu function will implement here')
		},
		edit:function(){
			MessageToast.show('Edit Menu function will implement here')
					},
		view:function(){
			MessageToast.show('View Menu function will implement here')
					},
		tool:function(){
			MessageToast.show('Tools Menu function will implement here')
					},

		help:function(){
			MessageToast.show('Help  function will implement here')
					},
		profile:function(){
			MessageToast.show('Profile  function will implement here')
					},


					onChangeTheme: function(oEvent) {
						// alert('helo')
						var selectedTheme = oEvent.getParameter("selectedItem").getKey();
						sap.ui.getCore().applyTheme(selectedTheme);
					},

	});
});