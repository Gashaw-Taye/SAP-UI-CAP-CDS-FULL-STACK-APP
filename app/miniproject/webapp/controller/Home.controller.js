sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/ColumnListItem",
    "sap/m/Input",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */

    function (Controller, MessageToast, ColumnListItem,Input, JSONModel) {
        "use strict";

        return Controller.extend("miniproject.controller.Home", {
            
            onInit: function () {
                this._oTable = this.byId("table0");
                this._createReadOnlyTemplates();
                this.rebindTable(this.oReadOnlyTemplate, "Navigation");

          
                
                fetch("https://port4004-workspaces-ws-wml98.us10.trial.applicationstudio.cloud.sap/odata/v4/users/Users")
                .then(response => response.json())
                .then(data => {
                    // Create a JSONModel and set the data to the model
                    var oModel = new JSONModel(data);
                    console.log(data,"=======", oModel)
                    this.getView().setModel(oModel, "userModel");
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });


                // var oModel = new JSONModel({
                //     Users: [
                //         { UserId: "1", UserName: "User1" },
                //         { UserId: "2", UserName: "User2" },
                //         // Add more sample data as needed
                //     ]
                // });
    
                // // Set the model to the view
                // this.getView().setModel(oModel, "userModel");

                var oModel = new JSONModel({
                    Planned_study_date_edit: "",
                    Office_edit: "",
                    Advisor_edit: "",
                    Gender_edit: "",
                    Full_name_edit:"",
                    ID_edit:"",

                });
                this.getView().setModel(oModel, "editModel");

                
                this.oEditableTemplate = new ColumnListItem({
                    cells: [
                        new Input({
                            value: "{mainModel>ID}",
                            change: [this.onInputChange, this]
                        }), new Input({
                            value: "{mainModel>Full_name}",
                            change: [this.onInputChange, this]
                        }), new Input({
                            value: "{mainModel>Office}",
                            change: [this.onInputChange, this]
                        }), new Input({
                            value: "{mainModel>Advisor_ID}",
                            change: [this.onInputChange, this]
                        }),  new Input({
                            value: "{mainModel>Planned_study_date}",
                            change: [this.onInputChange, this]
                        }),
                        new sap.m.Button({
                            id: "editModeButton",
                            visible: true,
                            icon: "sap-icon://edit",
                            tooltip: "Edit",
                            press: this.onOpenDetailDialog.bind(this), // Assuming onEditMode is a function you've defined
                            layoutData: new sap.m.OverflowToolbarLayoutData({
                                priority: sap.m.OverflowToolbarPriority.NeverOverflow
                            })
                        })
                 
                    ]
                });

            },
            onSearch: function (oEvent) {
                var oTable = this.getView().byId("table0");
                var oBinding = oTable.getBinding("items");
                var sQuery = oEvent.getParameter("query");
                // alert('fuhairfhr')
                if (sQuery) {
                    var oFilter = new sap.ui.model.Filter({
                        filters: [
                            new sap.ui.model.Filter("Full_name", sap.ui.model.FilterOperator.Contains, sQuery),
                            // Add more filters based on your needs
                        ],
                        and: false
                    });
       
                    oBinding.filter([oFilter]);
                } else {
                    // If the search field is empty, remove the filter
                    oBinding.filter([]);
                }
            },
            
            onLiveSearch: function (oEvent) {
                var oTable = this.getView().byId("table0");
                var oBinding = oTable.getBinding("items");
                var sQuery = oEvent.getParameter("newValue");
                if (sQuery) {
                    var oFilter = new sap.ui.model.Filter({
                        filters: [
                            new sap.ui.model.Filter("Full_name", sap.ui.model.FilterOperator.Contains, sQuery),
                        ],
                        and: false
                    });
                    oBinding.filter([oFilter]);
                    console.log(oBinding)

                } else {
                    // If the search field is empty, remove the filter
                    oBinding.filter([]);
                }
            },
            
          
              onLogout: function () {
                this.getOwnerComponent().getRouter().navTo("RouteLogin"); // not working 
              },
          
              onToggleMenu: function () {
                this.byId("navContainer").to(this.byId("menuPage"), "show");
              },
          
              onMenuItemPress: function (oEvent) {
                MessageToast.show("Menu Item Pressed: " + oEvent.getSource().getTitle());
          
                this.byId("navContainer").back();
              },
            onOpenAddDialog: function () {
                var oDialog = this.getView().byId("OpenDialog");
                oDialog.setContentWidth("100%");
                oDialog.setContentHeight("100%");
                oDialog.open();
                // this.getView().byId("OpenDialog").open();
             },
             onOpenDetailDialog: function (oEvent) {
                var oSelectedRow = oEvent.getSource().getBindingContext("mainModel").getObject();

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


                var oDialog = this.getView().byId("studentDetailModal");
                oDialog.setContentWidth("100%");
                oDialog.setContentHeight("100%");

                this.getView().byId("studentDetailModal").open();
             },
             onCancelDialog: function (oEvent) {
                oEvent.getSource().getParent().close();
             },
             onCreate: function () {
                var oSo = this.getView().byId("Full_name").getValue();
                if (oSo !== "") {
                    const oList = this._oTable;
                        const oBinding = oList.getBinding("items");
                        const plannedStudyDate = this.byId("Planned_study_date").getDateValue();
                        let formattedDate = ""
                        if (plannedStudyDate instanceof Date && !isNaN(plannedStudyDate)) {
                             formattedDate = plannedStudyDate.toISOString().split('T')[0];
                        }         
                        
                        try{
                        const oContext = oBinding.create({
                        
                            "Full_name": this.byId("Full_name").getValue(),
                            "Gender": this.byId("Gender").getValue(),
                            "Office": this.byId("Office").getValue(),
                            "Advisor_ID": parseInt(this.byId("Advisor_ID").getValue(), 10),//this.byId("Advisor_ID").getValue(),
                            "Created_at": new Date(),
                            "Planned_study_date": formattedDate,  
                            
                        });
                        oContext.created()
                        .then(()=>{
                                // that._focusItem(oList, oContext);
                                this.getView().byId("OpenDialog").close();
                        });
                    }catch(e){
                        this.getView().byId("OpenDialog").close();
                    }
  

                    this.getView().byId("OpenDialog").close();
                    MessageToast.show("Student registered successfulyl");

                }else {
                    MessageToast.show("Full Name cannot be blank");
                }
    
            },
            onSuccessfulPatch: function () {
                // Assuming "mainModel" is your main model instance
                var mainModel = this.getView().getModel("mainModel");
              
                // Assuming "editModel" is your edit model instance
                var editModel = this.getView().getModel("editModel");
              
                // Retrieve the updated data from the editModel
                var updatedData = editModel.getProperty("/ID_edit");
              
                // Update the main model with the updated data
                mainModel.setProperty("mainModel>/StudentWithAdvisor", updatedData);
              
                // Refresh the bindings to update the UI
                mainModel.refresh(); 
              },
              
            onUpdate: function () {
                var oSo = this.getView().byId("Full_name_edit").getValue();
                if (oSo !== "") {
                    const oList = this._oTable;
                        // const oBinding = oList.getBinding("items");
                        const plannedStudyDate = this.byId("Planned_study_date_edit").getDateValue();
                        let formattedDate = ""
                        if (plannedStudyDate instanceof Date && !isNaN(plannedStudyDate)) {
                             formattedDate = plannedStudyDate.toISOString().split('T')[0];
                        }         
                        
                        try{
                            const endpoint = "https://port4004-workspaces-ws-wml98.us10.trial.applicationstudio.cloud.sap/StudentServices/Students";

                            // Assuming you have the updateData object defined as mentioned in your question
                            const updateData = {
                                "Full_name": this.byId("Full_name_edit").getValue(),
                                "Gender": this.byId("Gender_edit").getValue(),
                                "Office": this.byId("Office_edit").getValue(),
                                "Advisor_ID": parseInt(this.byId("Advisor_edit").getSelectedKey(), 10),
                          
                            };
                          
                         
                            // You may want to replace 'yourStudentID' with the actual ID of the student you want to update
                            const studentID = parseInt(this.byId("ID_edit").getValue(), 10)
                            
                            // Construct the full URL with the student ID
                            const fullURL = `${endpoint}/${studentID}`;
                            console.log("asasAs", parseInt(this.byId("Advisor_edit").getSelectedKey(), 10))
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
                        this.getView().byId("OpenDialog").close();
                    }
  
                }else {
                    MessageToast.show("Full Name cannot be blank");
                }
    
            },
            onDeleteStudent: async function () {
                try {
                    const endpoint = "https://port4004-workspaces-ws-wml98.us10.trial.applicationstudio.cloud.sap/StudentServices/Students";
            
                    // You may want to replace 'yourStudentID' with the actual ID of the student you want to delete
                    const studentID = parseInt(this.byId("ID_edit").getValue(), 10);
            
                    // Construct the full URL with the student ID
                    const fullURL = `${endpoint}/${studentID}`;
            
                    // Send the DELETE request
                    const response = await fetch(fullURL, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
            
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
            
                    // Handle the response data as needed
                    console.log('Delete successful');
                    
                    // Close the dialog and show a success message
                    this.getView().byId("studentDetailModal").close();
                    MessageToast.show("Student Deleted, refresh the page to get the changes");
            
                } catch (error) {
                    console.error('Error deleting student:', error);
                    // Handle the error as needed
                }
            },
            

            onEditMode: function(){
                this.byId("editModeButton").setVisible(false);
                this.byId("saveButton").setVisible(true);
                this.byId("deleteButton").setVisible(true);
                this.rebindTable(this.oEditableTemplate, "Edit");
                //this.rebindTable(this.oEditableTemplate, "Edit");

           },
           onDelete: function(){

            var oSelected = this.byId("table0").getSelectedItem();
            if(oSelected){
                var oSalesOrder = oSelected.getBindingContext("mainModel").getObject().ID;
            
                oSelected.getBindingContext("mainModel").delete("$auto").then(function () {
                    MessageToast.show(oSalesOrder + " SuccessFully Deleted");
                }.bind(this), function (oError) {
                    MessageToast.show("Deletion Error: ",oError);
                });
            } else {
                MessageToast.show("Please Select a Row to Delete");
            }
            
        },
        rebindTable: function(oTemplate, sKeyboardMode) {
            this._oTable.bindItems({
                path: "mainModel>/StudentWithAdvisor",
                template: oTemplate,
                templateShareable: true
            }).setKeyboardMode(sKeyboardMode);
        },
        onInputChange: function(){
            this.refreshModel("mainModel");

        },
        
refreshModel: function (sModelName, sGroup){
            return new Promise((resolve,reject)=>{
                this.makeChangesAndSubmit.call(this,resolve,reject,
                sModelName,sGroup);
            });
            
        },
        makeChangesAndSubmit: function (resolve, reject, sModelName,sGroup){
            const that = this;
            sModelName = "mainModel";
            sGroup = "$auto";
            if (that.getView().getModel(sModelName).hasPendingChanges(sGroup)) {
                that.getView().getModel(sModelName).submitBatch(sGroup).then(oSuccess =>{
                    that.makeChangesAndSubmit(resolve,reject, sModelName,sGroup);
                    MessageToast.show("Record updated Successfully");
                },reject)
                .catch(function errorHandler(err) {
                    MessageToast.show("Something Went Wrong ",err.message); // 'Oops!'
                  });
            } else {
                that.getView().getModel(sModelName).refresh(sGroup);
                resolve();
            }
        },
        onSave: function(){
            this.getView().byId("editModeButton").setVisible(true);
            this.getView().byId("saveButton").setVisible(false);
            this._oTable.setMode(sap.m.ListMode.None);
            this.rebindTable(this.oReadOnlyTemplate, "Navigation");
            
        },
        _createReadOnlyTemplates: function () {
            this.oReadOnlyTemplate = new sap.m.ColumnListItem({
            cells: [
                new sap.m.Text({
                    text: "{mainModel>ID}"
                }),
                new sap.m.Text({
                    text: "{mainModel>Full_name}"
                }),
                new sap.m.Text({
                    text: "{mainModel>Office}"
                }),
                new sap.m.Text({
                    text: "{mainModel>AdvisorName}"
                }),
                new sap.m.Text({
                    text: "{mainModel>Planned_study_date}"
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
        });
    });
