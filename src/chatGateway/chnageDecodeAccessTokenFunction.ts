export const changeDecodeAccessTokenFunction = {
    "3p2UKSdT_maangalbazaar": mangalBazaarAccessTokenFunction
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
