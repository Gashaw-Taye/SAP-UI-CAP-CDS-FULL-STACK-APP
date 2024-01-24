sap.ui.define([
    "sap/ui/core/mvc/Controller"
  ], function (Controller) {
    "use strict";
  
    return Controller.extend("miniproject.controller.Dash", {
      // Your controller logic for SubItem1 goes here
      onSliderMoved: function (oEvent) {
        var fValue = oEvent.getParameter("value");
        this.byId("panelCSSGrid").setWidth(fValue + "%");
      }
    });
  });
  