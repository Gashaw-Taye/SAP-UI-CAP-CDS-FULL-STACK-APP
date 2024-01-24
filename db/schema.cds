using { Currency, managed, sap } from '@sap/cds/common';
namespace cap_tutorial; 


entity Users : managed {
  key ID : Integer;
  Full_name : String;
  Email : String;
  Office : String;
  Role : String; 
  Password : String; // Consider encryption
  Created_at : DateTime;
  Updated_at : DateTime;
  Last_login : DateTime;
  Account_status : Integer; 
}


entity Students : managed {
  @title : 'DB ID'
  key ID : Integer;
  @title : 'Full NAme'
  Full_name : String;
  @title : 'Gender'
  Gender : String;
  @title : 'Office'
  Office : String;
  @title : 'Advisor'
  Advisor : Association to Users;
  @title : 'Created AT'
  Created_at : DateTime;
  @title : 'Planned Study Date'
  Planned_study_date : Date;
}

entity Otp_Code : managed {
  key Id : Integer;
  User : String;
  Code : String; 
  is_used : String;

}
entity Student_communications : managed {
  key Id : Integer;
  Student : Association to Students;
  User : Association to Users;
  Message : String; 
  Created_date : DateTime;
  Updated_date : DateTime;
  Updated_by : Association to Users;
}

entity Schools : managed {
  key ID : Integer;
  School_name : String;
  Country : String;
  Creatd_at : DateTime; 
}

entity School_courses : managed {
  key ID : Integer;
  School : Association to Schools;
  Course_name : String;
  Status : Integer;
  Created_at : DateTime;
  Updated_at : DateTime;
}

entity Student_applications : managed {
  key ID : Integer;
  Student : Association to Students;
  Course : Association to School_courses;
  User : Association to Users;
  Start_date : DateTime;
  Note : String;
  Created_at : DateTime;
  Updated_at : DateTime;
  Final_choice : String;
  Is_deferred : String;
  Application_status : String;
}
