const cds = require('@sap/cds');

module.exports = async function () {
  const db = await cds.connect.to('db');
  const { School_courses } = db.entities;

  // Function to insert demo data
  const insertDemoData = async () => {
    const demoData = [
      {
        School_ID: 1, // Replace with the actual School ID
        Course_name: 'Demo Course 1',
        Status: 1, // Replace with the actual Status
        Created_at: new Date(),
        Updated_at: new Date(),
      },
      {
        School_ID: 1, // Replace with the actual School ID
        Course_name: 'Demo Course 2',
        Status: 1, // Replace with the actual Status
        Created_at: new Date(),
        Updated_at: new Date(),
      },
      {
        School_ID: 1, // Replace with the actual School ID
        Course_name: 'Demo Course 3',
        Status: 1, // Replace with the actual Status
        Created_at: new Date(),
        Updated_at: new Date(),
      },
    ];

    const existingRecords = await SELECT.from(School_courses).then((result) => result.length);

    if (existingRecords === 0) {
      for (const data of demoData) {
        console.log(data);
        await INSERT.into(School_courses).entries(data);
      }
    }
  };

  // Insert demo data before processing any read operation
  await insertDemoData();

  // Handle READ operation
  this.on('READ', 'School_courses', async (req) => {
    const result = await SELECT.from(School_courses);
    return result;
  });

  // Handle CREATE operation
  this.on('CREATE', 'School_courses', async (req) => {
    const data = req.data;
    console.log(data);

    const newCourse = await INSERT.into(School_courses).entries(data);
    return newCourse;
  });
};