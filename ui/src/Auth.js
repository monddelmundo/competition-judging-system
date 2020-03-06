class Auth {

    static authenticateUser(token) {
        localStorage.setItem('user', token)
    }

    static isUserAuthenticated() {
        return localStorage.getItem('user') !== null
    }

    static deauthenticateUser() {
        localStorage.removeItem('user')
    }

    static getToken() {
        return localStorage.getItem('user')
    }
    /*
    static authHeader() {
        let user = JSON.parse(localStorage.getItem('user'));

        if (user && user.token) {
            return { 'Authorization': 'Bearer ' + user.token }
        } else {
            return {};
        }
    }
    */
}

export default Auth