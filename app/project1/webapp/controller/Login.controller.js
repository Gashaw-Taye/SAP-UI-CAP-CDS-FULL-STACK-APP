sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/ColumnListItem",
    "sap/m/Input",
    "sap/m/Panel",
    "project1/config/Config"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */

    function (Controller, MessageToast, ColumnListItem,Input, Panel,Config) {
        "use strict";

        return Controller.extend("project1.controller.Login", {
            onLoginClick: function(){
                var username = this.getView().byId('username').getValue();
                var pwd = this.getView().byId('pwd').getValue();

                this._sendLoginRequest(username, pwd);
           
            },
            _sendLoginRequest: function (username, password) {
                // Construct the request body
                var requestBody = {
                    input: {
                        username: username,
                        password: password
                    }
                };
    
                // Make the POST request using fetch API
                fetch(Config.baseUrl+"rest/root/Login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestBody),
                })
                .then(response => response.json())
                .then(data => {
                    // Handle the response data
                    console.log(data);
                    if(data.user && data.user.Account_status ==1){
                        MessageToast.show('Please verify OTP');
                        // this.getOwnerComponent().getRouter().navTo("Targetdash"); //when i got otp varification from mulie i will change to the first coomt line and remove this
                        const token = data.user.token
                        sessionStorage.setItem('token', token)


                               // Hide the login panel
                               var loginPanel = this.getView().byId("loginPanel");
                               loginPanel.setVisible(false);
       
                               // Show the OTP panel
                               var otpPanel = this.getView().byId("otpPanel");
                               otpPanel.setVisible(true);

                               var emailInput = otpPanel.byId("User");
                               emailInput.setValue(username);


                        // this.getOwnerComponent().getRouter().navTo("dashboard");
                    }else{
                        MessageToast.show('Invalid credentials');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            },
       
            onVerifyOtpClick: function(){
                var User = this.getView().byId('username').getValue();
                var Code = this.getView().byId('otpcode').getValue();

                this._sendOtpVerificationRequest(User, Code);
           
            },
            _sendOtpVerificationRequest: function (User, Code) {
                // Construct the request body
                var requestBody = {
                    input: {
                        User: User,
                        Code: Code
                    }
                };
    
                // Make the POST request using fetch API
                fetch(Config.baseUrl+"rest/otp/checkOTP", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestBody),
                })
                .then(response => response.json())
                .then(data => {
                    // Handle the response data
                    console.log(data);
                    if(data.user && data.user[0].is_used =='N'){
                        MessageToast.show('Logged in sucecssfully');
                        this.getOwnerComponent().getRouter().navTo("Dashpage");//Targetdash  dashboard Dashpage
                    }else{
                        MessageToast.show('Invalid credentials');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            },
       
        });
    });

