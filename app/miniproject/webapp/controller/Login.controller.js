sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
], function(Controller,History) {
	"use strict";

	return Controller.extend("miniproject.controller.Login", {

        onInit: function() {
           
            window.loginController = this;
            var oLoginController = window.loginController;
            if (oLoginController) {
                var oUsernameInput = oLoginController.byId("user"); // Replace with your actual ID
                var oPasswordInput = oLoginController.byId("pwd"); // Replace with your actual ID
                oUsernameInput.setValue("");
                oPasswordInput.setValue("");
  
            }
            // You can add initialization logic here if needed
          },
		
		onBtnClick : function(){
			var oUser = this.getView().byId("user").getValue();  //get input value data in oUser variable 
			var oPwd = this.getView().byId("pwd").getValue();    //get input value data in oPwd variable
			
			if(oUser==="admin" && oPwd==="admin"){	
                // alert('helo')
                localStorage.setItem("isLoggedIn", "true");
                this.getOwnerComponent().getRouter().navTo("Targetdash");			
				// document.write("Login Successfully");
			}
            else if(oUser==="user" && oPwd==="user"){	
                localStorage.setItem("isLoggedIn", "true");
                    this.getOwnerComponent().getRouter().navTo("RouteUsers");	
            }
            else{
				alert("Re-Enter your Detail");
			}
			
			
		},
      

	});
});