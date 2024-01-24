const cds = require('@sap/cds');
const { decodeJWT } = require('./utils/tokenHandler');

module.exports = async function () {
  const db = await cds.connect.to('db');
  const { Student_applications } = db.entities;


  // Handle READ operation
  this.on('READ', 'Student_applications', async (req) => {

    const token = req.headers.authorization
    const decoded = decodeJWT(token)
    if(!token || !decoded){
      // return {"error":"invalid token supplied"}
    }


    const result = await SELECT.from(Student_applications);
    return result;
  });

  // Handle CREATE operation
  this.on('CREATE', 'Student_applications', async (req) => {

    const data = req.data;
    console.log("===================", data);

    const token = req.headers.authorization
    const decoded = decodeJWT(token)
    if(!token || !decoded){
      // return {"error":"invalid token supplied"}
    }




    const newApplication = await INSERT.into(Student_applications).entries(data);
    return newApplication;
  });
};