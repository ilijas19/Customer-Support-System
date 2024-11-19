class UserView {
  _messageForm = document.getElementById("message-form");
  _messageInput = document.querySelector(".message-input");
  _usernameElement = document.getElementById("user-name");

  addFormListener(handler) {
    this._messageForm?.addEventListener("submit", (e) => {
      e.preventDefault("");
      if ((this._messageInput.value = "")) return;
      handler(this._messageInput.value);
    });
  }
}

export default new UserView();
