using { cap_tutorial as my } from '../db/schema';
namespace cap_tutorial; 

service UsersService { 
  entity Users as projection on my.Users;

}