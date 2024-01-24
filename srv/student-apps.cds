using { cap_tutorial as my } from '../db/schema';


service StudentAppServices@(path:'/StudentAppServices')  { 
  entity Student_applications as projection on my.Student_applications;

view StudentWithApps as select from Student_applications {
    Student_applications.*,
    Student_applications.Course.Course_name as CourseName

  };

}
