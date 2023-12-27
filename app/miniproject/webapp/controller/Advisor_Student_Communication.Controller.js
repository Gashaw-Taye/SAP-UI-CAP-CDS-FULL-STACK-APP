// UserController.js
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
   
    ], function (Controller, MessageToast, JSONModel,MessageBox) {
      "use strict";
    
      return Controller.extend("miniproject.controller.Advisor_Student_Communication", {
        // Your User Controller Logic Here
        onInit: function() {
  
  
          
          // end of dynamic search
          this._oTable = this.byId("table0");
          // this._createReadOnlyTemplates();
          // this.rebindTable(this.oReadOnlyTemplate, "Navigation");
  
          var oModel = new JSONModel({
            Student_edit: "",
            User_edit: "",
            Message_edit: "",         
            Updated_by_edit:"",
  
          });
          this.getView().setModel(oModel, "editModel");
    
        },
        onOpenDetailDialog: function (oEvent) {
          var oSelectedRow = oEvent.getSource().getBindingContext("comm").getObject();
  
          // Create a new JSONModel with the values from the selected row
          var oModel = new JSONModel({
            Student_edit: oSelectedRow.Student,
            User_edit: oSelectedRow.User,
            Message_edit: oSelectedRow.Message,
            Updated_by_edit: oSelectedRow.Updated_by,
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
                  text: "{Student_communications>Id}"
              }),
              new sap.m.Text({
                  text: "{Student_communications>Student}"
              }),
              new sap.m.Text({
                  text: "{Student_communications>User}"
              }),
              new sap.m.Text({
                  text: "{Student_communications>Message}"
              }),
              new sap.m.Text({
                  text: "{Student_communications>Updated_by}"
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
        
        try {
           
            var IdControl = this.getView().byId("Id");
            if (IdControl) {
            var Id = this.getView().byId("Id");
            var User = this.getView().byId("User");
            var Message = this.getView().byId("Message");
            var Student = this.getView().byId("Student");
            var Updated_by = this.getView().byId("Updated_by");
            var Id = Id.getValue();
            var User = User.getValue();
            var Message = Message.getValue();
            var Student = Student.getValue();
            var Updated_by = Updated_by.getValue();
    
            if (User !== "") {
                const oList = this._oTable;
                const oBinding = oList.getBinding("items");
                const oContext = oBinding.create({
                    "Id": parseInt(Id),
                    "User": parseInt(User),
                    "Message": Message,
                    "Student": parseInt(Student),
                    "Created_date": new Date(),
                    "Updated_by": parseInt(Updated_by),
                    "Updated_date": new Date(),
                });
    
                oContext.created()
                    .then(() => {
                        this.getView().byId("OpenDialog").close();
                    })
                    .catch((error) => {
                        console.error("Error creating context:", error);
                    });
            } 
              
            } else {
                console.error("Control with ID 'Id' not found in the view.");
            }
        } catch (error) {
            console.error("Error in onCreate:", error);
        }
    },
       onCreatee: function() {
        try {
            var Id = this.getView().byId("Id");
            var User = this.getView().byId("User");
            var Message = this.getView().byId("Message");
            var Student = this.getView().byId("Student");
            var Updated_by = this.getView().byId("Updated_by");
            var Id = Id.getValue();
            var User = User.getValue();
            var Message = Message.getValue();
            var Student = Student.getValue();
            var Updated_by = Updated_by.getValue();
    
            if (User !== "") {
                const oList = this._oTable;
                const oBinding = oList.getBinding("items");
                const oContext = oBinding.create({
                    "Id": parseInt(Id),
                    "User": parseInt(User),
                    "Message": Message,
                    "Student": parseInt(Student),
                    "Created_date": new Date(),
                    "Updated_by": parseInt(Updated_by),
                    "Updated_date": new Date(),
                });
    
                oContext.created()
                    .then(() => {
                        this.getView().byId("OpenDialog").close();
                    })
                    .catch((error) => {
                        console.error("Error creating context:", error);
                    });
            } else {
                MessageToast.show("Full Name cannot be empty");
            }
        } catch (error) {
            console.error("Error in onCreate:", error);
        }
    },
    
      onSuccessfulPatch: function () {
        // Assuming "mainModel" is your main model instance
        var Students = this.getView().getModel("comm");
      
        // Assuming "editModel" is your edit model instance
        var editModel = this.getView().getModel("editModel");
      
        // Retrieve the updated data from the editModel
        var updatedData = editModel.getProperty("/ID_edit");
      
        // Update the main model with the updated data
        Students.setProperty("comm>/Student_communications", updatedData);
      
        // Refresh the bindings to update the UI
        Students.refresh(); 
      },
      
    onUpdate: function () {
        var oSo = this.getView().byId("Id_edit").getValue();
        if (oSo !== "") {
            const oList = this._oTable;
                const oBinding = oList.getBinding("items");
                      
                
                try{
                    const endpoint = "http://localhost:4004/comm/Student_communications";
  
                    // Assuming you have the updateData object defined as mentioned in your question
                    const updateData = {
                        "Student": this.byId("Student_edit").getValue(),
                        "User": this.byId("User_edit").getValue(),
                        "Message": this.byId("Message_edit").getValue(),
                        "Updated_by": parseInt(this.byId("Updated_by_edit").getValue(), 10),
                  
                    };
                    
                    // You may want to replace 'yourStudentID' with the actual ID of the student you want to update
                    const studentID = parseInt(this.byId("Id_edit").getValue(), 10)
                    
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
            MessageToast.show("Name cannot be blank");
        }
  
    },
  
    confirm: function(oEvent) {
      var oRecord = this.byId("table0").getSelectedItem();
  
      MessageBox.show(
          "This message should appear in the message box.", {
              icon: MessageBox.Icon.INFORMATION,
              title: "My message box title",
              actions: [MessageBox.Action.YES, MessageBox.Action.NO],
              emphasizedAction: MessageBox.Action.YES,
              onClose: function(oAction) {
                  if (oAction === 'YES') {
                      this.onDelete(oRecord); // Call the function using 'this.onDelete'
                  }
              }.bind(this) // Ensure 'this' refers to the controller within the onClose callback
          }
      );
  },
  
  onDelete: function(oRecord) {
      var oSelected = oRecord;
      // alert(oRecord);
  
      if (oSelected) {
          var oSalesOrder = oSelected.getBindingContext("comm").getObject().ID;
  
          oSelected.getBindingContext("comm").delete("$auto").then(function() {
              MessageToast.show("A Student with ID " + oSalesOrder + " Successfully Deleted");
          }.bind(this), function(oError) {
              MessageToast.show("Deletion Error: " + oError);
          });
      } else {
          MessageToast.show("Please Select a Row to Delete");
      }
  }
  ,
  
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
                  new sap.ui.model.Filter("comm", sap.ui.model.FilterOperator.Contains, sQuery),
                  // Add more filters based on your needs
              ],
              and: false
          });
  
          
          oBinding.filter([oFilter]);
          this.getView().getModel("comm").refresh();
  
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
    