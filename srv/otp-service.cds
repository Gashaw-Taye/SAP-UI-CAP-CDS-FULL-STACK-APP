using { cap_tutorial as my } from '../db/schema';
namespace cap_tutorial; 
@protocol: 'rest'
service OtpService  { 
  // entity Otp_Code as projection on my.Otp_Code;

    @open
    type object {};
    action   checkOTP(input : object)       returns object;

}