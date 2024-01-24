const cds = require('@sap/cds');
const { sendEmail } = require('./utils/emailHelper');
const { decodeJWT } = require('./utils/tokenHandler');


module.exports = async function () {
  const db = await cds.connect.to('db');
  const { Student_applications } = db.entities;

  // Handle READ operation
  this.on('READ', 'Student_applications', async (req) => {

    // sendEmail() 

    const result = await SELECT.from(Student_applications);
    return result;
  });

  this.on('READ', 'StudentWithApps', async (req) => {

    const token = req.headers.authorization

    const decoded = decodeJWT(token)
    if(!token || !decoded){
      console.log(decoded)
      // return {"success":"false","message":"token expired or invalid"}
    }

    const result = await cds
    .run(
      SELECT.from(Student_applications).columns([
        'ID',
        'Student_ID',
        'User_ID',
        'Course',
        'Application_status',
        'Course.Course_name  as CourseName', 
        'Note',
        'Final_choice'
      ])
    )
    .then((result) => result);

  return result;



  });



  this.on('createStudent', 'Student_applications', async (data) => {
    console.log(data)
    const newStudent = await INSERT.into(Student_applications).entries(data);
    return newStudent;
  });

  this.on('CREATE', 'Student_applications', async (req) => {
    const data = req.data;
    console.log(data);

    const newStudent = await INSERT.into(Student_applications).entries(data);
    return newStudent;
  });


};
