const cds = require("@sap/cds");

const { generateJWT } = require('./utils/tokenHandler');
const { sendOtpEmail } = require('./utils/emailHelper');


module.exports = cds.service.impl(async function (srv) {
    const db = await cds.connect.to('db');
    const {  Users, Otp_Code } = db.entities;

    srv.on('Login', async(req)=>{
        
        const Email = req.data.input.username
        const Password = req.data.input.password

        const user = await db.read(Users).where({ Email, Password });

        if (user.length > 0) {
            var randomOTPCode = Math.floor(1000 + Math.random() * 9000);
// insert the generated code to Otp_Code

        const newOtp = await INSERT.into(Otp_Code).entries({
                                User:Email,
                                Code: randomOTPCode.toString(),
                                is_used: 'N'
                            });



            sendOtpEmail(Email, randomOTPCode)
            const token = generateJWT(user[0]);
            user[0].token = token
            
            return { user: user[0] };
        } else {
            return { message: 'User not found' };
        }

        return req.data;
    })


});

