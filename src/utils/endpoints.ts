export const authEndpoints = {
    me: '/api/auth/me',
    login: '/api/auth/login',
    register:'/api/auth/register',
    forgotPassword:'/api/auth/forgot-password',
    logout:'/api/auth/logout',
    refreshToken:'/api/auth/refresh-token',
}

export const userEndpoints = {
    userCompany:'/api/companies/user/[userId]',
    companyId:'/api/companies/[companyId]',
    companies:'/api/companies',

    userContact:'/api/contact/user/[userId]',
    contactId:'/api/contact/[contactId]',
    contact:'/api/contact',

    userId:'/api/user/[id]',
    createUser:'/api/user/create',
    readUser:'/api/user/read',
    user:'/api/user',
}
