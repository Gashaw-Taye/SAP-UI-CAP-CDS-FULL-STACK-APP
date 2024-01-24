const cds = require("@sap/cds");

const { generateJWT } = require('./utils/tokenHandler');
const { sendOtpEmail } = require('./utils/emailHelper');


module.exports = cds.service.impl(async function (srv) {
    const db = await cds.connect.to('db');
    const {  Users, Otp_Code } = db.entities;

    srv.on('checkOTP', async(req)=>{
        
        const User = req.data.input.User
        const Code = req.data.input.Code
        console.log(req.data)
        const user = await db.read(Otp_Code).where({ User, Code });
        return {user:user};
        if (user.length > 0) {


            return { "sucecss":"true"};
        } else {
            return { message: 'User not found' };
        }


    })


});

