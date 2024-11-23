class OperatorView {
  _messageForm = document.getElementById("message-form");
  _messageInput = document.querySelector(".message-input");
  _operatorName = document.querySelector(".operator-name");
  _chatContainer = document.querySelector(".chat-container");
  _asideChatContainer = document.querySelector(".aside-chat-section");
  _chatTitle = document.querySelector(".chat-title");
  _chatTypeSelect = document.querySelector(".chat-type");
  _messageSubmitHandler = null;
  _currentUser;

  addSelectElListener(handler) {
    this._chatTypeSelect?.addEventListener("change", () => {
      handler(this._chatTypeSelect.value);
    });
  }

  chatInit(operator, user) {
    this._chatTitle.textContent = `Chat with ${user.username}`;

    this._clearChat();
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

  addMessageFormListener(socket, roomName, operator) {
    this._currentUser = operator;
    // Remove the previous event listener if it exists
    if (this._messageSubmitHandler) {
      this._messageForm?.removeEventListener(
        "submit",
        this._messageSubmitHandler
      );
    }

    // Define the new event listener
    this._messageSubmitHandler = (e) => {
      e.preventDefault();
      if (this._messageInput.value === "") return;
      socket.emit("chatMessage", {
        msg: this._messageInput.value,
        roomName,
        from: operator.username,
      });
      this._messageInput.value = ""; // Clear input after sending
    };

    // Add the new event listener
    this._messageForm?.addEventListener("submit", this._messageSubmitHandler);
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

  _clearChat() {
    this._chatContainer.innerHTML = "";
  }

  renderDatabaseConversations({ conversations }, socket) {
    console.log(conversations);
    this._asideChatContainer.innerHTML = "";

    conversations.forEach((conversation) => {
      const asideChatEl = document.createElement("div");
      asideChatEl.classList.add("aside-chat");

      asideChatEl.innerHTML = `
          <p class="aside-chat-name">${conversation.userId.username}</p>
          <p class="chat-status ${conversation.status}">${conversation.status}</p>
          <i class="fa-solid fa-ellipsis aside-icon"></i>
      `;
      //-handler function to open conversation
      asideChatEl.addEventListener("click", () => {
        socket.emit("operatorJoinOpenConversation", conversation);
      });

      this._asideChatContainer.appendChild(asideChatEl);
    });
  }
}

export default new OperatorView();
