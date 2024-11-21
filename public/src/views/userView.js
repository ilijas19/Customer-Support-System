class UserView {
  _messageForm = document.getElementById("message-form");
  _messageInput = document.querySelector(".message-input");
  _usernameElement = document.getElementById("user-name");
  _chatContainer = document.querySelector(".chat-container");
  _messageSubmitHandler = null;
  _currentUser;

  chatInit(modelState) {
    this._currentUser = modelState.currentUser;
    this._messageInput.style.pointerEvents = "auto";
    this._clearChat();
  }

  addMessageFormListener(socket, roomName, user) {
    // Remove previous listener if it exists
    if (this._messageSubmitHandler && this._messageForm) {
      this._messageForm.removeEventListener(
        "submit",
        this._messageSubmitHandler
      );
    }
    // Define new event listener
    this._messageSubmitHandler = (e) => {
      e.preventDefault();
      if (!this._messageInput || this._messageInput.value === "") return;
      socket.emit("chatMessage", {
        msg: this._messageInput.value,
        roomName,
        from: user.username,
      });
      this._messageInput.value = ""; // Clear input after sending
    };

    // Add event listener if _messageForm exists
    if (this._messageForm) {
      this._messageForm.addEventListener("submit", this._messageSubmitHandler);
    }
  }

  _clearChat() {
    this._chatContainer.innerHTML = "";
  }

  renderMessage(msg, from) {
    const now = new Date();
    const currentTime = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const msgEl = `
      <li class="message message-${
        from !== this._currentUser.username ? "left" : "right"
      }">
        <p class="message-info">${from} <span>${currentTime}</span></p>
        <p class="message-text">
          ${msg}
        </p>
      </li>
    `;
    this._chatContainer.insertAdjacentHTML("beforeend", msgEl);
    this._chatContainer.scrollTo(0, this._chatContainer.scrollHeight);
    this._messageInput.focus();
  }
}

export default new UserView();
