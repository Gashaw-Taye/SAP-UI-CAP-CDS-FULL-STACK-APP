const cds = require('@sap/cds');
const { sendEmail } = require('./utils/emailHelper');


module.exports = async function () {
  const db = await cds.connect.to('db');
  const { Students } = db.entities;

  // Function to insert demo data
  const insertDemoData = async () => {
    const demoData = [
      {
        Full_name: 'John Doe',
        Gender: 'Male',
        Office: 'Office A',
        // Advisor: 1, // Assuming the User_id exists in the Users entity
        Created_at: new Date(),
        Planned_study_date: new Date('2023-01-01T00:00:00.000Z'),
      },
      {
        Full_name: 'Jane Doe',
        Gender: 'Female',
        Office: 'Office B',
        // Advisor: 2, // Assuming the User_id exists in the Users entity
        Created_at: new Date(),
        Planned_study_date: new Date('2023-02-01T00:00:00.000Z'),
      },
      {
        Full_name: 'sdfasdfasdf',
        Gender: 'Female',
        Office: 'Office B',
        // Advisor: 2, // Assuming the User_id exists in the Users entity
        Created_at: new Date(),
        Planned_study_date: new Date('2023-02-01T00:00:00.000Z'),
      },
      {
        Full_name: 'Getnet',
        Gender: 'Female',
        Office: 'Office B',
        // Advisor: 2, // Assuming the User_id exists in the Users entity
        Created_at: new Date(),
        Planned_study_date: new Date('2023-02-01T00:00:00.000Z'),
      },
      {
        Full_name: 'Getachew',
        Gender: 'Female',
        Office: 'Office B',
        // Advisor: 2, // Assuming the User_id exists in the Users entity
        Created_at: new Date(),
        Planned_study_date: new Date('2023-02-01T00:00:00.000Z'),
      },
      {
        Full_name: 'Jane Doe',
        Gender: 'Female',
        Office: 'Office B',
        // Advisor: 2, // Assuming the User_id exists in the Users entity
        Created_at: new Date(),
        Planned_study_date: new Date('2023-02-01T00:00:00.000Z'),
      },
      {
        Full_name: 'Jane Doe',
        Gender: 'Female',
        Office: 'Office B',
        // Advisor: 2, // Assuming the User_id exists in the Users entity
        Created_at: new Date(),
        Planned_study_date: new Date('2023-02-01T00:00:00.000Z'),
      },
      {
        Full_name: 'Jane Doe',
        Gender: 'Female',
        Office: 'Office B',
        // Advisor: 2, // Assuming the User_id exists in the Users entity
        Created_at: new Date(),
        Planned_study_date: new Date('2023-02-01T00:00:00.000Z'),
      },
      {
        Full_name: 'Jane Doe',
        Gender: 'Female',
        Office: 'Office B',
        // Advisor: 2, // Assuming the User_id exists in the Users entity
        Created_at: new Date(),
        Planned_study_date: new Date('2023-02-01T00:00:00.000Z'),
      },
      {
        Full_name: 'Jane Doe',
        Gender: 'Female',
        Office: 'Office B',
        // Advisor: 2, // Assuming the User_id exists in the Users entity
        Created_at: new Date(),
        Planned_study_date: new Date('2023-02-01T00:00:00.000Z'),
      },
      {
        Full_name: 'Jane Doe',
        Gender: 'Female',
        Office: 'Office B',
        // Advisor: 2, // Assuming the User_id exists in the Users entity
        Created_at: new Date(),
        Planned_study_date: new Date('2023-02-01T00:00:00.000Z'),
      },
      
      {
        Full_name: 'Jane Doe',
        Gender: 'Female',
        Office: 'Office B',
        // Advisor: 2, // Assuming the User_id exists in the Users entity
        Created_at: new Date(),
        Planned_study_date: new Date('2023-02-01T00:00:00.000Z'),
      },
      
    ];

    const existingRecords = await SELECT.from(Students).then((result) => result.length);

    if (existingRecords === 0) {
      for (const data of demoData) {
        console.log(data)
        await INSERT.into(Students).entries(data);
      }
    }
  };

  // Insert demo data before processing any read operation
  await insertDemoData();

  // Handle READ operation
  this.on('READ', 'Students', async (req) => {

    // sendEmail() 

    const result = await SELECT.from(Students);
    return result;
  });


  this.on('createStudent', 'Students', async (data) => {
    console.log(data)
    const newStudent = await INSERT.into(Students).entries(data);
    return newStudent;
  });

  this.on('CREATE', 'Students', async (req) => {
    const data = req.data;
    console.log(data);

    const newStudent = await INSERT.into(Students).entries(data);
    return newStudent;
  });


};
