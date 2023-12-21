sap.ui.define([
    "sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/format/DateFormat",
	"sap/m/MessageToast",
	"sap/ui/integration/library",
	"sap/ui/core/date/UI5Date"
], function (Controller, JSONModel, DateFormat, MessageToast, integrationLibrary, UI5Date) {
        "use strict";

        return Controller.extend("miniproject.controller.Student", {
            onInit: function () {
                if (!localStorage.getItem("isLoggedIn")) {
                    alert("please login first");
                    this.getOwnerComponent().getRouter().navTo("RouteLogin");
                }
                // var oModel = new JSONModel("/odata/v4/student/");
                // this.getView().setModel(oModel);
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.initialize();

            },
            resolveUrl: function(sUrl) {
                return sap.ui.require.toUrl("miniproject/assets/avatars/" + sUrl);
            }
        ,
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
                
        }
        ,
     
        onAction: function (oEvent) {
            if (oEvent.getParameter("type") === integrationLibrary.CardActionType.Navigation) {
                MessageToast.show("URL: " + oEvent.getParameter("parameters").url);
            }
        },
        handleClick: function () {
			var oSideNavigation = this.getView().byId("sideNavigation");
			oSideNavigation.setCollapsed(!oSideNavigation.getCollapsed());
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
        onItemPress: function(oEvent) {
            var sKey = oEvent.getParameter("item").getKey();
            var oRouter = this.getOwnerComponent().getRouter();
            // alert('gashu man')
            switch (sKey) {
              case "detail":
                // alert('detail')
                oRouter.navTo("RouteStudent");
                break;
              case "detail2":
                // alert('detail2')
                oRouter.navTo("RouteStudent");
                break;
              case "detailDetail":
                //  alert('detailDetail')
                 oRouter.navTo("RouteUsers");	
                // oRouter.navTo("Student");
                break;
              // Add cases for other keys as needed
              default:
                break;
            }
          },
      
        });
    });
