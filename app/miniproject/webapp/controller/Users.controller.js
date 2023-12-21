sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/format/DateFormat",
	"sap/m/MessageToast",
	"sap/ui/integration/library",
	"sap/ui/core/date/UI5Date"
], function (Controller, JSONModel, DateFormat, MessageToast, integrationLibrary, UI5Date) {
	"use strict";

	return Controller.extend("miniproject.controller.Users", {
      onInit: function() {
        if (!localStorage.getItem("isLoggedIn")) {
            alert("please login first");
            this.getOwnerComponent().getRouter().navTo("RouteLogin");
        }
        
        // You can add initialization logic here if needed
      },
      
      logout:function(){
     
        alert("You are successfully logedout");
  
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
      resolveUrl: function(sUrl) {
        return sap.ui.require.toUrl("miniproject/assets/avatars/" + sUrl);
    }
      ,
      view_back:function(){
          this.getOwnerComponent().getRouter().navTo("RouteStudent");	
      },	onAction: function (oEvent) {
        if (oEvent.getParameter("type") === integrationLibrary.CardActionType.Navigation) {
            MessageToast.show("URL: " + oEvent.getParameter("parameters").url);
        }
    },

    });
  });
  