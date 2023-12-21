// UserController.js
sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/ui/model/json/JSONModel",
 
  ], function (Controller, MessageToast, JSONModel) {
    "use strict";
  
    return Controller.extend("miniproject.controller.Student", {
      // Your User Controller Logic Here
      onInit: function() {


        
        // end of dynamic search
        this._oTable = this.byId("table0");
        // this._createReadOnlyTemplates();
        // this.rebindTable(this.oReadOnlyTemplate, "Navigation");

        var oModel = new JSONModel({
            Planned_study_date_edit: "",
            Office_edit: "",
            Advisor_edit: "",
            Gender_edit: "",
            Full_name_edit:"",
            ID_edit:"",

        });
        this.getView().setModel(oModel, "editModel");
  
      },
      onOpenDetailDialog: function (oEvent) {
        var oSelectedRow = oEvent.getSource().getBindingContext("Students").getObject();

        // Create a new JSONModel with the values from the selected row
        var oModel = new JSONModel({
            Planned_study_date_edit: oSelectedRow.Planned_study_date,
            Office_edit: oSelectedRow.Office,
            Advisor_edit: oSelectedRow.Advisor_ID,
            Gender_edit: oSelectedRow.Gender,
            Full_name_edit: oSelectedRow.Full_name,
            ID_edit: oSelectedRow.ID,
        });
    
        // Set the model for the dialog
        this.getView().setModel(oModel, "editModel");
        // var oDialog = this.getView().byId("studentDetailModal");
        // oDialog.setContentWidth("30%");
        // oDialog.setContentHeight("30%");
        // oDialog.open();

        this.getView().byId("studentDetailModal").open();
     },
   
      _createReadOnlyTemplates: function () {
        this.oReadOnlyTemplate = new sap.m.ColumnListItem({
        cells: [
            new sap.m.Text({
                text: "{Students>ID}"
            }),
            new sap.m.Text({
                text: "{Students>Full_name}"
            }),
            new sap.m.Text({
                text: "{Students>Office}"
            }),
            new sap.m.Text({
                text: "{Students>Advisor_ID}"
            }),
            new sap.m.Text({
                text: "{Students>Planned_study_date}"
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
        // alert('helo save')
        var Gender_v = this.getView().byId("Gender");
        var selectedGenderItem = Gender_v.getSelectedItem();
        var Gender = selectedGenderItem ? selectedGenderItem.getText() : null;
        var Full_name_v = this.getView().byId("Full_name");
        // var Gender_v = this.getView().byId("Gender");
        var Office_v = this.getView().byId("Office");
        var Advisor_v = this.getView().byId("Advisor_ID");
        var Full_name = Full_name_v.getValue();
        // var Gender = Gender_v.getValue();
        var Office = Office_v.getValue();
        var Advisor_ID = Advisor_v.getValue();
        const plannedStudyDate = this.byId("Planned_study_date").getDateValue();
                        let formattedDate = ""
                        if (plannedStudyDate instanceof Date && !isNaN(plannedStudyDate)) {
                             formattedDate = plannedStudyDate.toISOString().split('T')[0];
                        }  
     
        // alert(Planned_study_date)
        if (Full_name !== "") {
          const oList = this._oTable;
          const oBinding = oList.getBinding("items");
          // alert(oBinding)
          const oContext = oBinding.create({
            "Full_name": Full_name,
            "Gender": Gender,
            "Office": Office,
            "Advisor_ID": parseInt(Advisor_ID),
            "Created_at": new Date(),
            "Planned_study_date": formattedDate,//Planned_study_date     
          });
          
          oContext.created()
            .then(() => {
              this.getView().byId("OpenDialog").close();
            })
            .catch((error) => {
              console.error("Error creating context:", error);
             
            });
            this.getView().byId("OpenDialog").close();
        }else {
            MessageToast.show("Full Name can not by empty");
        }
        
  
    },
    onSuccessfulPatch: function () {
      // Assuming "mainModel" is your main model instance
      var Students = this.getView().getModel("Students");
    
      // Assuming "editModel" is your edit model instance
      var editModel = this.getView().getModel("editModel");
    
      // Retrieve the updated data from the editModel
      var updatedData = editModel.getProperty("/ID_edit");
    
      // Update the main model with the updated data
      Students.setProperty("Students>/Students", updatedData);
    
      // Refresh the bindings to update the UI
      Students.refresh(); 
    },
    
  onUpdate: function () {
      var oSo = this.getView().byId("Full_name_edit").getValue();
      if (oSo !== "") {
          const oList = this._oTable;
              const oBinding = oList.getBinding("items");
              const plannedStudyDate = this.byId("Planned_study_date_edit").getDateValue();
              let formattedDate = ""
              if (plannedStudyDate instanceof Date && !isNaN(plannedStudyDate)) {
                   formattedDate = plannedStudyDate.toISOString().split('T')[0];
              }         
              
              try{
                  const endpoint = "http://localhost:4004/StudentServices/Students";

                  // Assuming you have the updateData object defined as mentioned in your question
                  const updateData = {
                      "Full_name": this.byId("Full_name_edit").getValue(),
                      "Gender": this.byId("Gender_edit").getValue(),
                      "Office": this.byId("Office_edit").getValue(),
                      "Advisor_ID": parseInt(this.byId("Advisor_edit").getValue(), 10),
                
                  };
                  
                  // You may want to replace 'yourStudentID' with the actual ID of the student you want to update
                  const studentID = parseInt(this.byId("ID_edit").getValue(), 10)
                  
                  // Construct the full URL with the student ID
                  const fullURL = `${endpoint}/${studentID}`;
              
                  // Send the PATCH request
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
                          // Handle the response data as needed
                          console.log('Update successful:', data);
                      })
                      .catch(error => {
                          console.error('Error updating student:', error);
                      });
                      this.getView().byId("studentDetailModal").close();
                      MessageToast.show("Student Info Updated, refresh the page to get the changes");
                      // onSuccessfulPatch()

          }catch(e){
            alert(e)
              this.getView().byId("OpenDialog").close();
          }

      }else {
          MessageToast.show("Full Name cannot be blank");
      }

  },

  onDelete: function(){
    // alert("gashu man")
    	// MessageBox.confirm("Approve purchase order 12345?");  
    var oSelected = this.byId("table0").getSelectedItem();
    if(oSelected){
        var oSalesOrder = oSelected.getBindingContext("Students").getObject().ID;
    
        oSelected.getBindingContext("Students").delete("$auto").then(function () {
            MessageToast.show("a Student with ID " + oSalesOrder + " SuccessFully Deleted");
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

  onSearch: function (oEvent) {
// console.log(oEvent)
    var oTable = this.getView().byId("table0");
    var oBinding = oTable.getBinding("items");
    var sQuery = oEvent.getParameter("newValue");
    // alert(sQuery)
    if (sQuery) {
      // alert('helo2')
        var oFilter = new sap.ui.model.Filter({
            filters: [
                new sap.ui.model.Filter("Full_name", sap.ui.model.FilterOperator.Contains, sQuery),
                // Add more filters based on your needs
            ],
            and: false
        });

        
        oBinding.filter([oFilter]);
        this.getView().getModel("Students").refresh();

        console.log(oBinding)
    } else {
        // If the search field is empty, remove the filter
        oBinding.filter([]);
    }
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



  
  



  //daynamic search rout end


  


    
  });
  
  });
  