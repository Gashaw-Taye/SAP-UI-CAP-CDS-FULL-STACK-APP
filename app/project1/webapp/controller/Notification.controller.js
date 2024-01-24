sap.ui.define([
    "sap/ui/core/mvc/Controller"
  ], function (Controller) {
    "use strict";
  
    return Controller.extend("project1.controller.Notification", {
      // Your controller logic for SubItem1 goes here
      onInit: function () {
     
      },
      onwitcherItemSelect: function (oEvent) {
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
  
    });
  });
  