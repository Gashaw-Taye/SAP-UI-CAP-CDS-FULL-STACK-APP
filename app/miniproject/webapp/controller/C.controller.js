sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("miniproject.controller.C", {
		onInit: function () {
               // Set the initial master page width to 2px
			   var detailPage = this.getView().byId("detailPage");
			   if (detailPage) {
				   detailPage.addStyleClass("initialWidth");
			   }
        },
		onCollapseExpandPress: function () {
			var oSideNavigation = this.byId("sideNavigation");
			var bExpanded = oSideNavigation.getExpanded();

			oSideNavigation.setExpanded(!bExpanded);
			var oSplitApp = this.getView().byId("masterPages");
			var oMasterPages = oSplitApp.getMasterPages()[0]; // Assuming there is only one master page
		
			if (oMasterPages.getWidth() === "1px") {
				oMasterPages.setWidth("0px");
			} else {
				oMasterPages.setWidth("1px");
			}

			
		},

		onHideShowSubItemPress: function () {
			var oNavListItem = this.byId("subItem3");
			oNavListItem.setVisible(!oNavListItem.getVisible());
		},
        onNavigationSelect: function (oEvent) {
            var oItem = oEvent.getParameter("item");
            var sKey = oItem.getKey();
          
            // Handle navigation based on the selected key
            // You can navigate programmatically or perform other actions
            this.navigate(sKey);
          },
          
          navigate: function (sKey) {
            // Implement your navigation logic here
          }

	});
});