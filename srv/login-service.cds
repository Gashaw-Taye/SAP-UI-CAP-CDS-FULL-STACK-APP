@protocol: 'rest'
service RootService {

    @open
    type object {};

    action   Login(input : object)       returns object;

}