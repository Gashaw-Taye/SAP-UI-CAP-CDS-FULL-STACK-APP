// Dashboard.js
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
  ], function (Controller,MessageToast) {
    "use strict";
  
    return Controller.extend("miniproject.controller.Dashboard", {

      onInit: function() {

       
        this._oTable = this.byId("table0");
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

      onItemPress: function (event) {
        var key = event.getParameter("item").getKey();
        this.byId("SplitAppDemo").toDetail(this.createId(key));
      },
  
      onDetailNavigate: function (event) {
        var key = event.getParameter("toId");
        this.byId("sideNavigation").setSelectedKey(key);
      },
      onCollapseExpandPress: function () {
        var oSideNavigation = this.byId("sideNavigation");
        var bExpanded = oSideNavigation.getExpanded();
  
        oSideNavigation.setExpanded(!bExpanded);
        
      },

     
     
     

    });
  
  });
  