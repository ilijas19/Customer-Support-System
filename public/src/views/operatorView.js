class OperatorView {
  _messageForm = document.getElementById("message-form");
  _messageInput = document.querySelector(".message-input");
  _operatorName = document.querySelector(".operator-name");
  _chatContainer = document.querySelector(".chat-container");
  _asideChatContainer = document.querySelector(".aside-chat-section");
  _chatTypeSelect = document.querySelector(".chat-type");
  _messageSubmitHandler = null;

  addSelectElListener(handler) {
    this._chatTypeSelect?.addEventListener("change", (e) => {
      handler(this._chatTypeSelect.value);
    });
  }

  //RENDERING ASIDE CHAT ELEMENTS AND ADDING EVENT LISTENER ON EACH ELEMENT ADDED
  renderChatsAddListener(users, handler) {
    this._asideChatContainer.innerHTML = "";

    users.forEach((user) => {
      const asideChatEl = document.createElement("div");
      asideChatEl.classList.add("aside-chat");

      asideChatEl.innerHTML = `
          <p class="aside-chat-name">${user.username}</p>
          <p class="chat-status pending">Pending</p>
          <i class="fa-solid fa-ellipsis aside-icon"></i>
      `;
      //-handler function to create conversation
      asideChatEl.addEventListener("click", () => {
        handler(user);
      });

      this._asideChatContainer.appendChild(asideChatEl);
    });
  }

  addMessageFormListener(socket, roomName) {
    // Remove the previous event listener if it exists
    if (this._messageSubmitHandler) {
      this._messageForm.removeEventListener(
        "submit",
        this._messageSubmitHandler
      );
    }

    // Define the new event listener
    this._messageSubmitHandler = (e) => {
      e.preventDefault();
      if (this._messageInput.value === "") return;
      socket.emit("chatMessage", { msg: this._messageInput.value, roomName });
      this._messageInput.value = ""; // Clear input after sending
    };

    // Add the new event listener
    this._messageForm.addEventListener("submit", this._messageSubmitHandler);
  }

  // addMessageFormListener(socket, roomName) {
  //   this._messageForm.addEventListener("submit", (e) => {
  //     e.preventDefault();
  //     if (this._messageInput.value === "") return;
  //     socket.emit("chatMessage", { msg: this._messageInput.value, roomName });
  //   });
  // }
}

export default new OperatorView();
