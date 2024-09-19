
// Defining the structure of an authenticated user
export type AuthUserType = {
    id : string;
    firstName : string;
    lastName : string;
    email : string;
    phone : string;
    city : string;
    country : string;
    userType : string;
    accessToken?: string;
    refreshToken?: string;
    otp?: string;
    otpExpires?: Date;
}

// Defining the structure of the authentication state
export type AuthStateType = {
    user: AuthUserType | null;
    loading: boolean;
    authenticated: boolean;
    unauthenticated: boolean;
    formSubmitted: boolean;
    userId: string | null;
    accessToken: string | null;
}

// Defining the structure of AuthContext
export interface AuthContextType {
    user : AuthUserType | null;
    loading : boolean;
    authenticated : boolean;
    unauthenticated : boolean;
    formSubmitted: boolean;
    userId: string | null;
    accessToken: string | null;
    login: (email:string,password:string) => Promise<void>
    register: (email:string, password:string, firstName:string, lastName:string, phone:string, country:string, city:string, userType:string) => Promise<void>
    logout: () => Promise<void>
    setFormSubmitted: (submitted: boolean) => void;
}

// Define the possible actions for the authentication state
export enum AuthActionTypes{
    INITIAL = 'INITIAL',
    LOGIN = "LOGIN",
    REGISTER = 'REGISTER',
    LOGOUT = 'LOGOUT',
    SET_FORM_SUBMITTED = 'SET_FORM_SUBMITTED',
    STOP_LOADING = 'STOP_LOADING'
}

// Define the payloads for each action
export type AuthActionPaylaod = {
    [AuthActionTypes.INITIAL] : {user:AuthUserType; accessToken:string; userId:string};
    [AuthActionTypes.LOGIN] : {user:AuthUserType; accessToken:string; userId:string};
    [AuthActionTypes.REGISTER] : {user:AuthUserType; accessToken:string; userId:string};
    [AuthActionTypes.LOGOUT] : undefined;
    [AuthActionTypes.SET_FORM_SUBMITTED] : {formSubmitted: boolean};
}

//Define the structure of an action 
export type AuthAction = {
    type:AuthActionTypes;
    payload? :any;
}