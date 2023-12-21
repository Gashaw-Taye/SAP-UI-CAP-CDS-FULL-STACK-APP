// UserController.js
// UserController.js
sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/ui/model/json/JSONModel",
  'sap/m/Label',
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
	'sap/ui/comp/smartvariants/PersonalizableInfo'
  ], function (Controller, MessageToast, JSONModel,Label,Filter,FilterOperator,PersonalizableInfo) {
    "use strict";
  
    return Controller.extend("miniproject.controller.User", {
      // Your User Controller Logic Here
      onInit: function() {


        
        // end of dynamic search
        this._oTable = this.byId("table0");
        // this._createReadOnlyTemplates();
        // this.rebindTable(this.oReadOnlyTemplate, "Navigation");

        var oModel = new JSONModel({
            role_edit: "",
            Email_edit: "",
            Full_name_edit:"",
            ID_edit:"",

        });
        this.getView().setModel(oModel, "edituserModel");
  
      },
      onOpenDetailDialog: function (oEvent) {
      //  alert('hi')
        var oSelectedRow = oEvent.getSource().getBindingContext("Users").getObject();

        // Create a new JSONModel with the values from the selected row
        var oModel = new JSONModel({
            Email_edit: oSelectedRow.Email,
            Role_edit: oSelectedRow.Role,
            Full_name_edit: oSelectedRow.Full_name,
            ID_edit: oSelectedRow.ID,
        });
    
        // Set the model for the dialog
        this.getView().setModel(oModel, "edituserModel");
        // var oDialog = this.getView().byId("studentDetailModal");
        // oDialog.setContentWidth("30%");
        // oDialog.setContentHeight("30%");
        // oDialog.open();

        this.getView().byId("userDetailModal").open();
     },
   
      _createReadOnlyTemplates: function () {
        this.oReadOnlyTemplate = new sap.m.ColumnListItem({
        cells: [
            new sap.m.Text({
                text: "{Users>ID}"
            }),
            new sap.m.Text({
                text: "{Users>Full_name}"
            }),
            new sap.m.Text({
                text: "{Users>Role}"
            }),
            new sap.m.Text({
                text: "{Users>Email}"
            }),
        
            new sap.m.Button({
                id: "editModeSIngleButton",
                visible: true,
                icon: "sap-icon://edit",
                tooltip: "Edit",
                press: this.onOpenDetailDialog.bind(this), // Assuming onEditMode is a function you've defined
                layoutData: new sap.m.OverflowToolbarLayoutData({
                    priority: sap.m.OverflowToolbarPriority.NeverOverflow
                })
            })
            // new sap.m.Text({
            //     text: "{mainModel>Planned_study_date}"
            // })
        ]
    });
},
onSave: function(){
  this.getView().byId("editModeButton").setVisible(true);
  this.getView().byId("saveButton").setVisible(false);
  this._oTable.setMode(sap.m.ListMode.None);
  this.rebindTable(this.oReadOnlyTemplate, "Navigation");
  
},
    
      onOpenAddDialog: function () {
        // alert('gashu')
        var oDialog = this.getView().byId("OpenDialog");
        oDialog.setContentWidth("50%");
        oDialog.setContentHeight("50%");
        oDialog.open();
        // this.getView().byId("OpenDialog").open();
     },
     onCancelDialog: function (oEvent) {
        oEvent.getSource().getParent().close();
     },
     onCreate: function() {

      var Role_v = this.getView().byId("Role");
      var selectedGenderItem = Role_v.getSelectedItem();
      var Role = selectedGenderItem ? selectedGenderItem.getText() : null;

      var Email = this.getView().byId("Email");
      var Full_name_v = this.getView().byId("Full_name");      
      var Office = this.getView().byId("Office");
      var Account_status = this.getView().byId("Account_status");
      var Password = this.getView().byId("Password");
      var Full_name = Full_name_v.getValue();
      var Email = Email.getValue();
      var Office = Office.getValue();
      var Account_status = Account_status.getValue();
      var Password = Password.getValue();
      alert(Account_status)
      if (Full_name !== "") {
          const oList = this._oTable;
          const oBinding = oList.getBinding("items");
          const oContext = oBinding.create({
              "Full_name": Full_name,
              "Email": Email,
              "Office": Office,
              "Role": Role,
              "Password": Password,
              "Created_at": "2023-01-01T08:00:00Z",
              "Updated_at": '2023-01-10T12:30:00Z',
              "Last_login": '2023-01-10T12:30:00Z',
              "Account_status": Account_status,
          });
  
          oContext.created()
              .then(() => {
                  this.getView().byId("OpenDialog").close();
              })
              .catch((error) => {
                  console.error("Error creating context:", error);
              });
          this.getView().byId("OpenDialog").close();
      } else {
          MessageToast.show("Full Name can not be empty");
      }
  },
  
    onSuccessfulPatch: function () {
      // Assuming "mainModel" is your main model instance
      var Users = this.getView().getModel("Users");
    
      // Assuming "editModel" is your edit model instance
      var edituserModel = this.getView().getModel("edituserModel");
    
      // Retrieve the updated data from the editModel
      var updatedData = edituserModel.getProperty("/ID_edit");
    
      // Update the main model with the updated data
      Users.setProperty("Users>/Users", updatedData);
    
      // Refresh the bindings to update the UI
      Users.refresh(); 
    },
    
    onUpdate: function () {
      var oSo = this.getView().byId("Full_name_edit").getValue();
      if (oSo !== "") {
          try {
              const userendpoint = "http://localhost:4004/odata/v4/users/Users/";
              const usersID = parseInt(this.byId("ID_edit").getValue(), 10);
              const fullURL = `${userendpoint}/${usersID}`;
  
              const updateData = {
                  "Full_name": this.byId("Full_name_edit").getValue(),
                  "Role": this.byId("Role_edit").getValue(),
                  "Email": this.byId("Email_edit").getValue(),
              };
  
              fetch(fullURL, {
                  method: 'PATCH',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(updateData),
              })
              .then(response => {
                  if (!response.ok) {
                      throw new Error(`HTTP error! Status: ${response.status}`);
                  }
                  return response.json();
              })
              .then(data => {
                  console.log('Update successful:', data);
                  this.getView().byId("userDetailModal").close();
                  MessageToast.show("User Info Updated, refresh the page to get the changes");
              })
              .catch(error => {
                  console.error('Error updating User:', error);
                  MessageToast.show(`Error updating User: ${error.message}`);
              });
          } catch (e) {
              console.error(e);
              MessageToast.show(`An unexpected error occurred: ${e.message}`);
          }
      } else {
          MessageToast.show("Full Name cannot be blank");
      }
  },
  

  onDelete: function(){
    // alert("gashu man")
    	// MessageBox.confirm("Approve purchase order 12345?");  
    var oSelected = this.byId("table0").getSelectedItem();
    if(oSelected){
        var oSalesOrder = oSelected.getBindingContext("Users").getObject().ID;
    
        oSelected.getBindingContext("Users").delete("$auto").then(function () {
            MessageToast.show("a Users with ID " + oSalesOrder + " SuccessFully Deleted");
        }.bind(this), function (oError) {
            MessageToast.show("Deletion Error: ",oError);
        });
    } else {
        MessageToast.show("Please Select a Row to Delete");
    }
    
  },

  // daynamic search route begin

  onExit: function() {
    this.oModel = null;
    this.oSmartVariantManagement = null;
    this.oExpandedLabel = null;
    this.oSnappedLabel = null;
    this.oFilterBar = null;
    this.oTable = null;
  },

  fetchData: function () {
    var aData = this.oFilterBar.getAllFilterItems().reduce(function (aResult, oFilterItem) {
      aResult.push({
        groupName: oFilterItem.getGroupName(),
        fieldName: oFilterItem.getName(),
        fieldData: oFilterItem.getControl().getSelectedKeys()
      });

      return aResult;
    }, []);

    return aData;
  },

  applyData: function (aData) {
    aData.forEach(function (oDataObject) {
      var oControl = this.oFilterBar.determineControlByName(oDataObject.fieldName, oDataObject.groupName);
      oControl.setSelectedKeys(oDataObject.fieldData);
    }, this);
  },

  getFiltersWithValues: function () {
    var aFiltersWithValue = this.oFilterBar.getFilterGroupItems().reduce(function (aResult, oFilterGroupItem) {
      var oControl = oFilterGroupItem.getControl();

      if (oControl && oControl.getSelectedKeys && oControl.getSelectedKeys().length > 0) {
        aResult.push(oFilterGroupItem);
      }

      return aResult;
    }, []);

    return aFiltersWithValue;
  },

  onSelectionChange: function (oEvent) {
    this.oSmartVariantManagement.currentVariantSetModified(true);
    this.oFilterBar.fireFilterChange(oEvent);
  },

  onSearchh: function () {
    
    var aTableFilters = this.oFilterBar.getFilterGroupItems().reduce(function (aResult, oFilterGroupItem) {
      // alert("aTableFilters")
      var oControl = oFilterGroupItem.getControl(),
        aSelectedKeys = oControl.getSelectedKeys(),
        aFilters = aSelectedKeys.map(function (sSelectedKey) {
          return new Filter({
            path: oFilterGroupItem.getName(),
            operator: FilterOperator.Contains,
            value1: sSelectedKey
          });
        });

      if (aSelectedKeys.length > 0) {
        aResult.push(new Filter({
          filters: aFilters,
          and: false
        }));
      }


      return aResult;
    }, []);

    this.oTable.getBinding("items").filter(aTableFilters);
    this.oTable.setShowOverlay(false);

   
  },

  onFilterChange: function () {
    this._updateLabelsAndTable();
  },

  onAfterVariantLoad: function () {
    this._updateLabelsAndTable();
  },

  getFormattedSummaryText: function() {
    var aFiltersWithValues = this.oFilterBar.retrieveFiltersWithValues();

    if (aFiltersWithValues.length === 0) {
      return "No filters active";
    }

    if (aFiltersWithValues.length === 1) {
      return aFiltersWithValues.length + " filter active: " + aFiltersWithValues.join(", ");
    }

    return aFiltersWithValues.length + " filters active: " + aFiltersWithValues.join(", ");
  },

  getFormattedSummaryTextExpanded: function() {
    var aFiltersWithValues = this.oFilterBar.retrieveFiltersWithValues();

    if (aFiltersWithValues.length === 0) {
      return "No filters active";
    }

    var sText = aFiltersWithValues.length + " filters active",
      aNonVisibleFiltersWithValues = this.oFilterBar.retrieveNonVisibleFiltersWithValues();

    if (aFiltersWithValues.length === 1) {
      sText = aFiltersWithValues.length + " filter active";
    }

    if (aNonVisibleFiltersWithValues && aNonVisibleFiltersWithValues.length > 0) {
      sText += " (" + aNonVisibleFiltersWithValues.length + " hidden)";
    }

    return sText;
  },

  _updateLabelsAndTable: function () {
    this.oExpandedLabel.setText(this.getFormattedSummaryTextExpanded());
    this.oSnappedLabel.setText(this.getFormattedSummaryText());
    this.oTable.setShowOverlay(true);
  },
  onSearch: function (oEvent) {
    var sSearchValue = oEvent.getParameter("newValue");
    console.log("Search Value:", sSearchValue);

    // Get the table binding
    var oTable = this.byId("table0");
    var oBinding = oTable.getBinding("items");

    if (oBinding) {
        if (sSearchValue) {
            // Apply a filter based on the Full_name property
            var oFilter = new Filter("Full_name", FilterOperator.Contains, sSearchValue);
            oBinding.filter([oFilter]);

            console.log("Filter Applied:", oFilter);
        } else {
            // If the search value is empty, clear the filter
            oBinding.filter([]);
            console.log("Filter Cleared - Table Refreshed");
        }
    } else {
        console.error("Table binding not found!");
    }
}


  
  



  //daynamic search rout end


  


    
  });
  
  });
  
  