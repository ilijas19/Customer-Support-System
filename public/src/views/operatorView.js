class OperatorView {
  _messageForm = document.getElementById("message-form");
  _messageInput = document.querySelector(".message-input");
  _operatorName = document.querySelector(".operator-name");
  _chatContainer = document.querySelector(".chat-container");
  _asideChatContainer = document.querySelector(".aside-chat-section");
  _chatTitle = document.querySelector(".chat-title");
  _chatTypeSelect = document.querySelector(".chat-type");
  _logoutButton = document.querySelector(".logout-btn");
  //dotmenu
  _dotMenuButton = document.getElementById("dot-dropdown-btn");
  _dotMenu = document.querySelector(".dot-dropdown");
  _closeChatBtn = document.getElementById("close-chat");
  _closeAndDeleteBtn = document.getElementById("close-delete-chat");
  _dropdownLiEl = document.querySelector(".dot-dropdown-li");

  //variables
  _messageSubmitHandler = null;
  _clickHandler = null;
  _currentUser;

  addDotMenuListeners(handler, conversation, socket) {
    if (window.location.pathname === "/operator") {
      this._dotMenuButton.style.opacity = "1";
      this._dotMenuButton.style.pointerEvents = "auto";
      this._dotMenuButton.style.cursor = "pointer";

      // Remove the existing click handler if it exists
      if (this._clickHandler) {
        this._dropdownLiEl.removeEventListener("click", this._clickHandler);
        this._clickHandler = null;
      }

      // function
      this._clickHandler = (e) => {
        handler(conversation._id);
        socket.emit("deletedConversation", conversation);
      };

      // Add click handler
      this._dropdownLiEl.addEventListener("click", this._clickHandler);
      this._toggleMenu();
    }
  }

  _toggleMenu() {
    this._dotMenuButton.addEventListener("click", () => {
      const isVisible = this._dotMenu.style.opacity === "1";
      this._dotMenu.style.opacity = isVisible ? "0" : "1";
      this._dotMenu.style.pointerEvents = isVisible ? "none" : "auto";
    });
  }

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
    this._asideChatContainer.innerHTML = "";

    conversations.forEach((conversation) => {
      const asideChatEl = document.createElement("div");
      asideChatEl.classList.add("aside-chat");

      asideChatEl.innerHTML = `
          <p class="aside-chat-name">${conversation.userId.username}</p>
          <p class="chat-status ${conversation.status}">${conversation.status}</p>
          
      `;
      //-handler function to open conversation
      asideChatEl.addEventListener("click", () => {
        socket.emit("operatorJoinOpenConversation", conversation);
      });

      this._asideChatContainer.appendChild(asideChatEl);
    });
  }

  renderPreviousMessages(messages) {
    messages.forEach((message) => {
      const msgEl = `
      <li class="message message-${
        message.senderId.username !== this._currentUser.username
          ? "left"
          : "right"
      }">
        <p class="message-info">${
          message.senderId.username
        } <span>${this._getTimeFromTimestamp(message.timestamp)}</span></p>
        <p class="message-text">
          ${message.text}
        </p>
      </li>
    `;
      this._chatContainer.insertAdjacentHTML("beforeend", msgEl);
    });
    this._chatContainer.scrollTo(0, this._chatContainer.scrollHeight);
  }

  _getTimeFromTimestamp(timestamp) {
    const date = new Date(timestamp); // Convert the timestamp string to a Date object
    let hours = date.getHours(); // Get hours (24-hour format)
    const minutes = date.getMinutes().toString().padStart(2, "0"); // Get minutes and pad with zero
    const ampm = hours >= 12 ? "PM" : "AM"; // Determine AM or PM

    hours = hours % 12 || 12; // Convert to 12-hour format (0 becomes 12)
    return `${hours.toString().padStart(2, "0")}:${minutes} ${ampm}`; // Return formatted time
  }

  reloadPage() {
    if (window.location.pathname === "/operator") {
      location.reload();
    }
  }

  addLogoutBtnHandler(handler) {
    this._logoutButton.addEventListener("click", () => {
      handler();
      alert("Logout");
      window.location.href = "/login";
    });
  }
}

export default new OperatorView();
