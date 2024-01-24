sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("project1.controller.Application", {
        onInit: function() {
        },
        onOpenAddDialog: function () {
            // alert('helo')
            var oDialog = this.getView().byId("OpenDialog");
            oDialog.setContentWidth("50%");
            oDialog.setContentHeight("50%");
            oDialog.open();
            // this.getView().byId("OpenDialog").open();
         },
         onCreate:function(){
        alert("hello create")
         },
         onCancelDialog: function (oEvent) {
            oEvent.getSource().getParent().close();
         },
         onLiveSearch:function(){
         alert("search cliked")
         },
         onUpdate:function(){
            alert("edit")
         },
         onDelete:function(){
            alert('delete')
         }
      });
    }
  );