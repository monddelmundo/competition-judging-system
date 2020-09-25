class Auth {
  static authenticateUser(token) {
    localStorage.setItem("user", token);
  }

  static isUserAuthenticated() {
    return localStorage.getItem("user") !== null;
  }

  static deauthenticateUser() {
    localStorage.clear();
  }

  static getToken() {
    return localStorage.getItem("user");
  }

  //judge
  static authenticateJudge(token) {
    localStorage.setItem("judge", token);
  }

  static isJudgeAuthenticated() {
    return localStorage.getItem("judge") !== null;
  }

  static getTokenJudge() {
    return localStorage.getItem("judge");
  }
}

export default Auth;
