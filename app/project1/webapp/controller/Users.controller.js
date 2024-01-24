sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/ColumnListItem",
    "sap/m/Input",
    "sap/ui/model/json/JSONModel",
    "project1/config/Config",

	"sap/m/MessageBox",
	"sap/ui/core/Fragment",
	"sap/ui/core/library"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */

    function (Controller, MessageToast, ColumnListItem,Input, JSONModel,Config,MessageBox,Fragment,CoreLibrary) {
        "use strict";

        var ValueState = CoreLibrary.ValueState,
		oData = {
			full_nameNameState: ValueState.Error,
			officenameState: ValueState.Error,
			studentType: "leads",
			reviewButton: false,
			backButtonVisible: false,
			availabilityType: "In store",
			productVAT: false,
			measurement: "",
			Advisor_ID: "N/A",
			productDescription: "N/A",
			size: "N/A",
			productPrice: "N/A",
			manufacturingDate: "N/A",
			Gender: ""
		};

        return Controller.extend("project1.controller.Users", {
            
            onInit: function () {
             
               
                this._oTable = this.byId("studentsTables");
                this._createReadOnlyTemplates();
                this.rebindTable(this.oReadOnlyTemplate, "Navigation");

                const token = sessionStorage.getItem('token')
                if(token){
                    fetch(Config.baseUrl+"odata/v4/users/Users", {
                        headers: {
                          'Authorization': `Bearer ${token}`,
                          'Content-Type': 'application/json',
                        },
                      })
                    
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
    
            }
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
                            value: "{customModel>ID}",
                            change: [this.onInputChange, this]
                        }), new Input({
                            value: "{customModel>Full_name}",
                            change: [this.onInputChange, this]
                        }), new Input({
                            value: "{customModel>Office}",
                            change: [this.onInputChange, this]
                        }), new Input({
                            value: "{customModel>Advisor_ID}",
                            change: [this.onInputChange, this]
                        }),  new Input({
                            value: "{customModel>Planned_study_date}",
                            change: [this.onInputChange, this]
                        }),
                        new sap.m.Button({
                            id: "editModeButt",
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
                var oTable = this.getView().byId("studentsTables");
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
               
                var oTable = this.getView().byId("studentsTables");
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
                var oSelectedRow = oEvent.getSource().getBindingContext("customModel").getObject();

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
            const idInput = this.byId("ID");
            if (idInput) {
                const idValue = idInput.getValue();
                // rest of your code...
            } else {
                console.error("Element with 'ID' not found.");
            }

            const idInputad = this.byId("ID");
            if (idInputad) {
                const idValued = idInputad.getValue();
                // rest of your code...
            } else {
                console.error("Element with ID 'ID' not found.");
            }

    var oSo = this.getView().byId("Full_name").getValue();
    const plannedStudyDate = new Date();  // Replace this with your actual date value
const formattedDate = plannedStudyDate.toISOString().split('T')[0];

    if (oSo !== "") {
        try {
            const endpoint = Config.baseUrl + "StudentServices/Students";

            // Assuming you have the createData object defined
            const createData = {
                "ID": parseInt(this.byId("ID").getValue(), 10), 
                "Full_name": this.byId("Full_name").getValue(),
                "Gender": this.byId("Gender").getValue(),
                "Office": this.byId("Office").getValue(),
                "Advisor_ID":1, 
                "Created_at": new Date(),
                "Planned_study_date": formattedDate,
            };

            // Send the POST request
            fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(createData),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    // Handle the response data as needed
                    console.log('Create successful:', data);
                    MessageToast.show("Student registered successfully");
                    this.getView().byId("wizardDialog").close();
                })
                .catch(error => {
                    console.error('Error creating student:', error);

                    // Log specific details of the error, if available
                    this.getView().byId("wizardDialog").close();
                });
        } catch (e) {
            // Handle any specific error if needed
            MessageToast.show("Error in registration: " + e.message);
                    this.getView().byId("wizardDialog").close();
        }
    } else {
        MessageToast.show("Full Name cannot be blank");
    }
},

            
            
            
            
            
            onSuccessfulPatch: function () {
                var customModel = this.getView().getModel("customModel");
              
                // Assuming "editModel" is your edit model instance
                var editModel = this.getView().getModel("editModel");
              
                // Retrieve the updated data from the editModel
                var updatedData = editModel.getProperty("/ID_edit");
              
                // Update the main model with the updated data
                customModel.setProperty("customModel>/StudentWithAdvisor", updatedData);
              
                // Refresh the bindings to update the UI
                customModel.refresh(); 
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
                            const endpoint = Config.baseUrl+"StudentServices/Students";

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
                    const endpoint = Config.baseUrl+"StudentServices/Students";
            
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
                this.byId("editModeButt").setVisible(false);
                this.byId("saveButton").setVisible(true);
                this.byId("deleteButton").setVisible(true);
                this.rebindTable(this.oEditableTemplate, "Edit");
                //this.rebindTable(this.oEditableTemplate, "Edit");

           },
           onDelete: function(){

            var oSelected = this.byId("studentsTables").getSelectedItem();
            if(oSelected){
                var oSalesOrder = oSelected.getBindingContext("customModel").getObject().ID;
            
                oSelected.getBindingContext("customModel").delete("$auto").then(function () {
                    MessageToast.show(oSalesOrder + " SuccessFully Deleted");
                }.bind(this), function (oError) {
                    MessageToast.show("Deletion Error: ",oError);
                });
            } else {
                MessageToast.show("Please Select a Row to Delete");
            }
            
        },
        rebindTable: function(oTemplate, sKeyboardMode) {
           
            const token = sessionStorage.getItem('token')
            if(token){
            fetch(Config.baseUrl+"StudentServices/StudentWithAdvisor", {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
            .then(response => response.json())
            .then(data => {
                // Create a JSONModel and set the data to the model
                var oModel = new JSONModel(data);
        
                // Set the model on the table
                this._oTable.setModel(oModel, "customModel");
                console.log('Table Model:', this._oTable.getModel("customModel")); // Check if the model is set on the table
        
                // Bind items using the newly set model
                this._oTable.bindItems({
                    path: "customModel>/value",
                    template: oTemplate,
                    templateShareable: true
                }).setKeyboardMode(sKeyboardMode);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        }
        },
        
        onInputChange: function(){
            this.refreshModel("customModel");

        },
        
        refreshModel: function (sModelName, sGroup){
            return new Promise((resolve,reject)=>{
                this.makeChangesAndSubmit.call(this,resolve,reject,
                sModelName,sGroup);
            });
            
        },
        makeChangesAndSubmit: function (resolve, reject, sModelName,sGroup){
            const that = this;
            sModelName = "customModel";
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
            this.getView().byId("editModeButt").setVisible(true);
            this.getView().byId("saveButton").setVisible(false);
            this._oTable.setMode(sap.m.ListMode.None);
            this.rebindTable(this.oReadOnlyTemplate, "Navigation");
            
        },
        _createReadOnlyTemplates: function () {
            this.oReadOnlyTemplate = new sap.m.ColumnListItem({
            cells: [
                new sap.m.Text({
                    text: "{customModel>ID}"
                }),
                new sap.m.Text({
                    text: "{customModel>Full_name}"
                }),
                new sap.m.Text({
                    text: "{customModel>Office}"
                }),
                new sap.m.Text({
                    text: "{customModel>AdvisorName}"
                }),
                new sap.m.Text({
                    text: "{customModel>Planned_study_date}"
                }),
                new sap.m.Button({
                    id: "editModeSIngleButtonnn",
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

    handleOpenDialog: function () {

        
        var oView = this.getView();

        // create Dialog
        if (!this._pDialog) {
            this._pDialog = Fragment.load({
                id: oView.getId(),
                name: "project1.view.WizardSingleStep",
                controller: this
            }).then(function(oDialog) {
                oDialog.attachAfterOpen(this.onDialogAfterOpen, this);
                oView.addDependent(oDialog);
                oDialog.bindElement("/ProductCollection/0");
                return oDialog;
            }.bind(this));
        }
        this._pDialog.then(function(oDialog){
            oDialog.open();
        });
        fetch(Config.baseUrl+"odata/v4/users/Users", {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })
        
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



    },

    onDialogAfterOpen: function () {
        this._oWizard = this.byId("CreateStudentWizard");
        this._iSelectedStepIndex = 0;
        this._oSelectedStep = this._oWizard.getSteps()[this._iSelectedStepIndex];

        this.handleButtonsVisibility();
    },

    handleButtonsVisibility: function () {
        var oModel = this.getView().getModel();
        switch (this._iSelectedStepIndex){
            case 0:
                oModel.setProperty("/nextButtonVisible", true);
                oModel.setProperty("/nextButtonEnabled", true);
                oModel.setProperty("/backButtonVisible", false);
                oModel.setProperty("/reviewButtonVisible", false);
                oModel.setProperty("/finishButtonVisible", false);
                break;
            case 1:
                oModel.setProperty("/backButtonVisible", true);
                oModel.setProperty("/nextButtonVisible", true);
                oModel.setProperty("/reviewButtonVisible", false);
                oModel.setProperty("/finishButtonVisible", false);
                break;
            case 2:
                oModel.setProperty("/nextButtonVisible", true);
                oModel.setProperty("/backButtonVisible", true);
                oModel.setProperty("/reviewButtonVisible", false);
                oModel.setProperty("/finishButtonVisible", false);
                break;
            case 3:
                oModel.setProperty("/nextButtonVisible", false);
                oModel.setProperty("/backButtonVisible", true);
                oModel.setProperty("/reviewButtonVisible", true);
                oModel.setProperty("/finishButtonVisible", false);
                break;
            case 4:
                oModel.setProperty("/nextButtonVisible", false);
                oModel.setProperty("/finishButtonVisible", true);
                oModel.setProperty("/backButtonVisible", false);
                oModel.setProperty("/reviewButtonVisible", false);
                break;
            default: break;
        }

    },

    handleNavigationChange: function (oEvent) {
        this._oSelectedStep = oEvent.getParameter("step");
        this._iSelectedStepIndex = this._oWizard.getSteps().indexOf(this._oSelectedStep);
        this.handleButtonsVisibility();
    },

    setProductType: function (oEvent) {
        var sProductType = oEvent.getSource().getTitle();
        this.getView().getModel().setProperty("/studentType", sProductType);
        this.byId("ProductStepChosenType").setText("Chosen product type: " + sProductType);
        this._oWizard.validateStep(this.byId("studentTypeStep"));
    },

    setProductTypeFromSegmented: function (oEvent) {
        var sProductType = oEvent.getParameters().item.getText();
        this.getView().getModel().setProperty("/studentType", sProductType);
        this._oWizard.validateStep(this.byId("studentTypeStep"));
    },

    additionalInfoValidation: function () {
        var oModel = this.getView().getModel(),
            sName = this.byId("Full_name").getValue(),
            iWeight = parseInt(this.byId("Office").getValue());

        this.handleButtonsVisibility();

        if (isNaN(iWeight)) {
            this._oWizard.setCurrentStep(this.byId("studentInfoStep"));
            oModel.setProperty("/officenameState", ValueState.Error);
        } else {
            oModel.setProperty("/officenameState", ValueState.None);
        }

        if (sName.length < 6) {
            this._oWizard.setCurrentStep(this.byId("studentInfoStep"));
            oModel.setProperty("/full_nameNameState", ValueState.Error);
        } else {
            oModel.setProperty("/full_nameNameState", ValueState.None);
        }

        if (sName.length < 6 || isNaN(iWeight)) {
            this._oWizard.invalidateStep(this.byId("studentInfoStep"));
            oModel.setProperty("/nextButtonEnabled", false);
            oModel.setProperty("/finishButtonVisible", false);
        } else {
            this._oWizard.validateStep(this.byId("studentInfoStep"));
            oModel.setProperty("/nextButtonEnabled", true);
        }
    },

    optionalStepActivation: function () {
        // MessageToast.show(
        //     'This event is fired on activate of Step3.'
        // );
    },
    optionalStepCompletion: function () {
        MessageToast.show(
            'This event is fired on complete of Step3. You can use it to gather the information, and lock the input data.'
        );
    },

    editStepOne: function () {
        this._handleNavigationToStep(0);
    },

    editStepTwo: function () {
        this._handleNavigationToStep(1);
    },

    editStepThree: function () {
        this._handleNavigationToStep(2);
    },

    editStepFour: function () {
        this._handleNavigationToStep(3);
    },

    _handleNavigationToStep: function (iStepNumber) {
        this._pDialog.then(function(oDialog){
            oDialog.open();
            this._oWizard.goToStep(this._oWizard.getSteps()[iStepNumber], true);
        }.bind(this));
    },

    _handleMessageBoxOpen: function (sMessage, sMessageBoxType) {
        MessageBox[sMessageBoxType](sMessage, {
            actions: [MessageBox.Action.YES, MessageBox.Action.NO],
            onClose: function (oAction) {
                if (oAction === MessageBox.Action.YES) {
                    this._oWizard.discardProgress(this._oWizard.getSteps()[0]);
                    this.byId("wizardDialog").close();
                    // this.getView().getModel().setData(Object.assign({}, oData));
                }
            }.bind(this)
        });
    },

    onDialogNextButton: function () {
        this._iSelectedStepIndex = this._oWizard.getSteps().indexOf(this._oSelectedStep);
        var oNextStep = this._oWizard.getSteps()[this._iSelectedStepIndex + 1];

        if (this._oSelectedStep && !this._oSelectedStep.bLast) {
            this._oWizard.goToStep(oNextStep, true);
        } else {
            this._oWizard.nextStep();
        }

        this._iSelectedStepIndex++;
        this._oSelectedStep = oNextStep;

        this.handleButtonsVisibility();
    },

    onDialogBackButton: function () {
        this._iSelectedStepIndex = this._oWizard.getSteps().indexOf(this._oSelectedStep);
        var oPreviousStep = this._oWizard.getSteps()[this._iSelectedStepIndex - 1];

        if (this._oSelectedStep) {
            this._oWizard.goToStep(oPreviousStep, true);
        } else {
            this._oWizard.previousStep();
        }

        this._iSelectedStepIndex--;
        this._oSelectedStep = oPreviousStep;

        this.handleButtonsVisibility();
    },

    handleWizardCancel: function () {
        
        this._handleMessageBoxOpen("Are you sure you want to cancel your report?", "warning");
    },

    handleWizardSubmit: function () {
        this._handleMessageBoxOpen("Are you sure you want to submit your report?", "confirm");
    },

    productWeighStateFormatter: function (oVal) {
        return isNaN(oVal) ? ValueState.Error : ValueState.None;
    },

    discardProgress: function () {
       
        var oModel = this.getView().getModel();
        this._oWizard.discardProgress(this.byId("studentTypeStep"));

        var clearContent = function (aContent) {
            for (var i = 0; i < aContent.length; i++) {
                if (aContent[i].setValue) {
                    aContent[i].setValue("");
                }

                if (aContent[i].getContent) {
                    clearContent(aContent[i].getContent());
                }
            }
        };

        oModel.setProperty("/officenameState", ValueState.Error);
        oModel.setProperty("/full_nameNameState", ValueState.Error);
        clearContent(this._oWizard.getSteps());
    },

});
});
