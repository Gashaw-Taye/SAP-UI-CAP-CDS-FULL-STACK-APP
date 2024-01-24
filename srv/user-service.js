const cds = require('@sap/cds');


const { decodeJWT } = require('./utils/tokenHandler');





module.exports = async function () {
  const db = await cds.connect.to('db');
  const { Users } = db.entities;

  // Function to insert demo data
  const insertDemoData = async () => {
    const demoData = [
      {
        Full_name: "John Doe",
        Email: "gtforever2009@gmail.com",
        Office: "Headquarters",
        Role: "Admin",
        Password: "encrypted_password_1", // Placeholder for encrypted password
        Created_at: new Date("2023-01-01T08:00:00Z"),
        Updated_at: new Date("2023-01-01T08:00:00Z"),
        Last_login: new Date("2023-01-10T12:30:00Z"),
        Account_status: 1,
      },
      {
        Full_name: "Jane Doe",
        Email: "gtforever@example.com",
        Office: "Branch Office",
        Role: "User",
        Password: "encrypted_password_2", // Placeholder for encrypted password
        Created_at: new Date("2023-01-02T09:15:00Z"),
        Updated_at: new Date("2023-01-02T09:15:00Z"),
        Last_login: new Date("2023-01-12T14:45:00Z"),
        Account_status: 1,
      },
      // Add more user entries as needed
    ];

    const existingRecords = await SELECT.from(Users).then((result) => result.length);

    if (existingRecords === 0) {
      for (const data of demoData) {
        console.log(data);
        await INSERT.into(Users).entries(data);
      }
    }
  };

  // Insert demo data before processing any read operation
  await insertDemoData();

  // Handle READ operation
  this.on('READ', 'Users', async (req) => {
    const token = req.headers.authorization
    const decoded = decodeJWT(token)
    if(!token || !decoded){
      // return {"error":"invalid token supplied"}
    }
    const result = await SELECT.from(Users);
    return result;
  });

  // Handle CREATE operation
  this.on('CREATE', 'Users', async (req) => {
    const data = req.data;
    console.log(data);

    const newUser = await INSERT.into(Users).entries(data);
    return newUser;
  });
};
