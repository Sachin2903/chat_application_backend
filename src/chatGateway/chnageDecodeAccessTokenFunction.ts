export const changeDecodeAccessTokenFunction = {
    "3p2UKSdT_maangalbazaar": mangalBazaarAccessTokenFunction,
    "sz6EFYp8Z1_hotlead":omnileadzAccessTokenFunction
}
function omnileadzAccessTokenFunction(decodeToken:{sub:string,username:string,name:string,business:string,email:string,role:string[]}){
    return {
        sub: decodeToken?.username,
        name: decodeToken?.name,
        business: decodeToken?.business,
        email: decodeToken?.email,
        role: decodeToken?.role[0]?decodeToken?.role[0]:"UNKNOWN"
    }
}
function mangalBazaarAccessTokenFunction(decodeToken: { userId: string, userFullName: string, userMail: string, userType: string }) {
    return {
        sub: decodeToken?.userId,
        name: decodeToken?.userFullName,
        business: "NjVhNjU1NzhkMTE5NzMwMWE5NzRiNGI1",
        email: decodeToken?.userMail,
        role: [decodeToken?.userType]
    }
}
