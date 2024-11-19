class AuthView {
  // LOGIN ELEMENTS
  _loginForm = document.getElementById("login-form");
  _loginEmail = document.getElementById("login-email");
  _loginPassword = document.getElementById("login-password");
  //REGISTER ELEMENTS
  _registerForm = document.getElementById("register-form");
  _registerUsername = document.getElementById("register-username");
  _registerEmail = document.getElementById("register-email");
  _registerPassword = document.getElementById("register-password");

  //-login
  addLoginFormListener(handler) {
    this._loginForm?.addEventListener("submit", async (e) => {
      e.preventDefault();
      await handler(this._loginEmail.value, this._loginPassword.value);
    });
  }

  //-register
  addRegisterFormListener(handler) {
    this._registerForm?.addEventListener("submit", async (e) => {
      e.preventDefault();
      await handler(
        this._registerUsername.value,
        this._registerEmail.value,
        this._registerPassword.value
      );
    });
  }
}

export default new AuthView();
