sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/ColumnListItem",
    "sap/m/Input",
    "sap/ui/model/json/JSONModel",
    "project1/config/Config"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */

    function (Controller, MessageToast, ColumnListItem,Input, JSONModel,Config) {
        "use strict";

        return Controller.extend("project1.controller.Student", {
            
            onInit: function () {
               
                this._oTable = this.byId("table0");
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

                /************FETCH COURSE LIST ******************** */
                fetch(Config.baseUrl+"odata/v4/school-course/School_courses", {
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
                    this.getView().setModel(oModel, "courseList");
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });

                // student application datasource

                fetch(Config.baseUrl+"StudentAppServices/StudentWithApps", {
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
                    this.getView().setModel(oModel, "Student_applications");
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });

                /**************************** */
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
                var oSo = this.getView().byId("Full_name").getValue();
                if (oSo !== "") {
                    const oList = this._oTable;
                        const oBinding = oList.getBinding("items");
                        const plannedStudyDate = this.byId("Planned_study_date").getDateValue();
                        let formattedDate = ""
                        if (plannedStudyDate instanceof Date && !isNaN(plannedStudyDate)) {
                             formattedDate = plannedStudyDate.toISOString().split('T')[0];
                        }         
                        
                    //     try{
                    //     const oContext = oBinding.create({
                        
                    //         "Full_name": this.byId("Full_name").getValue(),
                    //         "Gender": this.byId("Gender").getValue(),
                    //         "Office": this.byId("Office").getValue(),
                    //         "Advisor_ID": parseInt(this.byId("Advisor_ID").getValue(), 10),//this.byId("Advisor_ID").getValue(),
                    //         "Created_at": new Date(),
                    //         "Planned_study_date": formattedDate,  
                            
                    //     });
                    //     oContext.created()
                    //     .then(()=>{
                    //             // that._focusItem(oList, oContext);
                    //             this.getView().byId("OpenDialog").close();
                    //     });
                    // }catch(e){
                    //     this.getView().byId("OpenDialog").close();
                    // }
      // Rest of your code...
      const endpoint = Config.baseUrl+"StudentServices/Students";

      // Assuming you have the updateData object defined as mentioned in your question
      const updateData = {
        "Full_name": this.byId("Full_name").getValue(),
        "Gender": this.byId("Gender").getValue(),
        "Office": this.byId("Office").getValue(),
        "Advisor_ID": parseInt(this.byId("Advisor_ID").getValue(), 10),//this.byId("Advisor_ID").getValue(),
        "Created_at": new Date(),
        "Planned_study_date": formattedDate,  
    
      };
      // const updateData2 = {
      //     "Student_ID": 10,
      //     "Course_ID": 1,
      //     "User_ID": 1,
      //     "Start_date": "2023-01-01T00:00:00Z",
      //     "Note": "Note",
      //     "Final_choice": "finalCASDCFhoice",
      //     "Is_deferred": "Is_deferred",
      //     "Application_status": "Application_status",
    
      // };
      const fullURL = endpoint;
         const token = sessionStorage.getItem('token')
          if(token){
      fetch(fullURL, {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${token}`,
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
              console.error('Error updating data:', error);
          });
          this.getView().byId("OpenDialog_app").close();
          MessageToast.show("Application added, refresh the page to get the changes");
          // onSuccessfulPatch()
      }

                    this.getView().byId("OpenDialog").close();
                    MessageToast.show("Student registered successfulyl");

                }else {
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
                this.byId("editModeButton").setVisible(false);
                this.byId("saveButton").setVisible(true);
                this.byId("deleteButton").setVisible(true);
                this.rebindTable(this.oEditableTemplate, "Edit");
                //this.rebindTable(this.oEditableTemplate, "Edit");

           },
           onDelete: function(){

            var oSelected = this.byId("table0").getSelectedItem();
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
            this.getView().byId("editModeButton").setVisible(true);
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
                    id: "editModeSIngleButton",
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

    // test modal

    onOpenAddDialog_app: function () {
        // alert('helo')
        var oDialog = this.getView().byId("OpenDialog_app");
        oDialog.setContentWidth("50%");
        oDialog.setContentHeight("50%");
        oDialog.open();
        // this.getView().byId("OpenDialog").open();
     },
     onCancelDialog_app: function (oEvent) {
        oEvent.getSource().getParent().close();
     },
     onCreate_app:function(oEvent){
        
        try{
        const that = this;  // Preserve the reference to the controller context

        // Use Promise to wait for the elements to be rendered
        const waitForRendering = new Promise(function(resolve) {
            // Check if the elements are already rendered
            if (that.byId("ID_edit2") && that.byId("Final_choice")) {
                resolve();
            } else {
                // Attach an event handler to wait for the elements to be created
                that.getView().attachAfterRendering(function() {
                    resolve();
                });
            }
        });
    
        // Wait for rendering to complete before accessing the elements
        waitForRendering.then(function() {
            // Access the elements after rendering
            const studentID = parseInt(that.byId("ID_edit2").getValue(), 10);
            const Course_id =  1;//parseInt(this.byId("Course_id").getSelectedKey(), 10);
            const User = 10;
            const Start_date = that.byId("Start_date").getValue();
            const Note = that.byId("Note").getValue();
            const finalChoice = that.byId("Final_choice").getValue();
            const Is_deferred = that.byId("Is_deferred").getValue();
            const Application_status = that.byId("Application_status").getValue();
    
            console.log("Student ID:", studentID);
            console.log("Final Choice:", finalChoice);
    
            // Rest of your code...
            const endpoint = Config.baseUrl+"odata/v4/apps/Student_applications";

            // Assuming you have the updateData object defined as mentioned in your question
            const updateData = {
                "Student_ID": studentID,
                "Course_ID": Course_id,
                "User_ID": User,
                "Start_date": "2023-01-01T00:00:00Z",
                "Note": Note,
                "Final_choice": finalChoice,
                "Is_deferred": Is_deferred,
                "Application_status": Application_status,
          
            };
            // const updateData2 = {
            //     "Student_ID": 10,
            //     "Course_ID": 1,
            //     "User_ID": 1,
            //     "Start_date": "2023-01-01T00:00:00Z",
            //     "Note": "Note",
            //     "Final_choice": "finalCASDCFhoice",
            //     "Is_deferred": "Is_deferred",
            //     "Application_status": "Application_status",
          
            // };
            const fullURL = endpoint;
               const token = sessionStorage.getItem('token')
                if(token){
            fetch(fullURL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
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
                    console.error('Error updating data:', error);
                });
                this.getView().byId("OpenDialog_app").close();
                MessageToast.show("Application added, refresh the page to get the changes");
                // onSuccessfulPatch()
            }
        });

    }catch(e){
        MessageToast.show("Something went wrong ... pleache try again");
    }
     
     },
     onLiveSearch_app:function(){
        alert("search clicked");
     }
        });
    });
