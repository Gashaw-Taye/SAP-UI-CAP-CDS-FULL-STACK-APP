sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/ColumnListItem",
    "sap/m/Input"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */

    function (Controller, MessageToast, ColumnListItem,Input) {
        "use strict";

        return Controller.extend("miniproject.controller.Login", {
            onLoginClick: function(){
                var username = this.getView().byId('username').getValue();
                var pwd = this.getView().byId('pwd').getValue();
                if(username=='admin' && pwd =='admin'){
                    // document.write('mskfhnaeuihf') // redirect to home view
                    this.getOwnerComponent().getRouter().navTo("dashboard");

                }else{
                    // alert('ndkjeahf')
                    MessageToast.show('Invalid credentials');

                }
            }
       

        });
    });
