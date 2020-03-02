class Auth {

    static authenticateUser(token) {
        localStorage.setItem('cool-jwt', token)
    }

    static isUserAuthenticated() {
        return localStorage.getItem('cool-jwt') !== null
    }

    static deauthenticateUser() {
        localStorage.removeItem('cool-jwt')
    }

    static getToken() {
        return localStorage.getItem('cool-jwt')
    }
}

export default Auth