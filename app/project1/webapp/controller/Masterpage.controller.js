sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'sap/m/Button',
	'sap/m/library',
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/ColumnListItem",
    "sap/m/Input",
    "sap/ui/core/Fragment",    
    'sap/ui/core/IconPool',
    'sap/m/Link',
    'sap/m/MessageItem',
    'sap/m/MessageView',
    'sap/m/Bar',
    'sap/m/Title',
    'sap/m/ResponsivePopover',
    "project1/config/Config"
    

], function (Controller, JSONModel, Button, library,MessageBox,MessageToast,ColumnListItem,Input,Fragment,IconPool, Link, MessageItem, MessageView, Bar, Title,ResponsivePopover,Config) {
	"use strict";

	var CController = Controller.extend("project1.controller.Masterpage", {
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

  }
   
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

      this.oModel = new JSONModel();
			this.oModel.loadData(sap.ui.require.toUrl("project1/model/model.json"), null, false);
			this.getView().setModel(this.oModel);

//message

var that = this;
var	oLink = new Link({
  text: "Show more information",
  href: "http://sap.com",
  target: "_blank"
});

var oMessageTemplate = new MessageItem({
  type: '{type}',
  title: '{title}',
  description: '{description}',
  subtitle: '{subtitle}',
  counter: '{counter}',
  markupDescription: "{markupDescription}",
  link: oLink
});

var aMockMessages = [{
  type: 'Error',
  title: 'Error message',
  description: 'First Error message description. \n' +
  'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod',
  subtitle: 'Example of subtitle',
  counter: 1
}, {
  type: 'Warning',
  title: 'Warning without description',
  description: ''
}, {
  type: 'Success',
  title: 'Success message',
  description: 'First Success message description',
  subtitle: 'Example of subtitle',
  counter: 1
}, {
  type: 'Error',
  title: 'Error message',
  description: 'Second Error message description',
  subtitle: 'Example of subtitle',
  counter: 2
}, {
  type: 'Information',
  title: 'Information message',
  description: 'First Information message description',
  subtitle: 'Example of subtitle',
  counter: 1
}];

var oModel = new JSONModel(),
  that = this;

oModel.setData(aMockMessages);

this.oMessageView = new MessageView({
    showDetailsPageHeader: false,
    itemSelect: function () {
      oBackButton.setVisible(true);
    },
    items: {
      path: "/",
      template: oMessageTemplate
    }
  });
var	oBackButton = new Button({
    icon: IconPool.getIconURI("nav-back"),
    visible: false,
    press: function () {
      that.oMessageView.navigateBack();
      that._oPopover.focus();
      this.setVisible(false);
    }
  });

this.oMessageView.setModel(oModel);

var oCloseButton =  new Button({
    text: "Close",
    press: function () {
      that._oPopover.close();
    }
  }).addStyleClass("sapUiTinyMarginEnd"),
  oPopoverBar = new Bar({
    contentLeft: [oBackButton],
    contentMiddle: [
      new Title({text: "Messages"})
    ]
  });

this._oPopover = new ResponsivePopover({
  customHeader: oPopoverBar,
  contentWidth: "20%",
  contentHeight: "40%",
  verticalScrolling: false,
  modal: true,
  content: [this.oMessageView],
  endButton:oCloseButton
});
     

		},

    handlePopoverPress: function (oEvent) {
      this.oMessageView.navigateBack();
      this._oPopover.openBy(oEvent.getSource());
    },

    formatColor: function (value) {
      // Your condition for setting the color
      if (value === 1) {
        return "red";
      } else if (value === 2) {
        return "blue";
      } else if (value === 3) {
        return "green";
      } else {
        return "black";
      }
    },
  press: function (oEvent) {
      MessageToast.show("The comparison micro chart is pressed.");
  },
		onItemSelect : function(oEvent) {
			var item = oEvent.getParameter('item');
			this.byId("pageContainer").to(this.getView().createId(item.getKey()));
		},

		onMenuButtonPress : function() {
			var toolPage = this.byId("toolPage");

			toolPage.setSideExpanded(!toolPage.getSideExpanded());
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



  //  switch:function(){
  //     alert('switch buttun cliked')
  //      },

       livesearch:function(){
       alert('search button cilked')
      },
      settings:function(){
        alert('setting button cilked')
       },

       profile:function(){
       
       },
 
       onProductSwitcherItemSelect: function (oEvent) {
        // Get the selected item
        var oSelectedItem = oEvent.getParameter("listItem");

        if (oSelectedItem) {
            // Retrieve the selected value
            var sSelectedTitle = oSelectedItem.getTitle();
           
          if(sSelectedTitle==='Sign out')
            {
              this.avater(); 

            }
            else{
              alert('setting button cilked')
            }
            // Now you can use the selected value as needed
            console.log("Selected Value: " + sSelectedTitle);
        }
    },

       avater: function(oEvent) {       
        MessageBox.show(
            "Do you want to Logout.", {
                icon: MessageBox.Icon.INFORMATION,
                title: "confirmation Box",
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                emphasizedAction: MessageBox.Action.YES,
                onClose: function(oAction) {
                    if (oAction === 'YES') {
                        this.logout(); // Call the function using 'this.onDelete'
                    }
                }.bind(this) // Ensure 'this' refers to the controller within the onClose callback
            }
        );
    },
    
    logout: function(oRecord) {
      // alert("You are successfully logedout");
  
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
    
switch: function () {
  // Handle product switcher pressed event
  var oView = this.getView();
  var oProductSwitcher = oView.byId("x"); // Replace with your actual ID

  if (oProductSwitcher) {
      if (!this._oNotificationSwitcherPopover) {
          Fragment.load({
              id: oView.getId(),
              name: "project1.view.Notification",
              controller: this
          }).then(function (oPopover) {
              this._oNotificationSwitcherPopover = oPopover;
              oView.addDependent(this._oNotificationSwitcherPopover);
              this._oNotificationSwitcherPopover.openBy(oProductSwitcher);
          }.bind(this));
      } else {
          this._oNotificationSwitcherPopover.openBy(oProductSwitcher);
      }
  } else {
      // Log an error or handle the case where the product switcher is not found
      console.error("Notfication switcher control not found.");
  }
},



// close pop up button
onCloseButtonPress: function () {
  var oPopover = this.getView().byId("closepop"); // Replace "yourPopoverId" with the actual ID of your Popover
  oPopover.close();
}




 
        
	});


	return CController;

});
