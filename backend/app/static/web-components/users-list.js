class UsersList extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML =
      /*html*/
      `
      <style>
        :host {
          display: flex;
          width: 100%;
        }

        .wrapper {
          display: flex;
          flex-direction: column;
          padding: 0;
          margin: 10px 0 0 0;
          width: 100%;
          align-items: center;
        }

        .users-list-container {
          display: flex;
          flex-direction: column;
          margin: 0;
          padding: 0;
          width: 100%;
          align-items: center;
        }

        ::slotted(.user-name-label-container) {
          font-size: 16px;
          font-weight: 600; 
        }
      </style>

      <div class=wrapper>
        <div class="users-list-container">
          <slot name="users-label"></slot>
          <slot name="users"></slot>
        </div>
      </div>
      `;
  }

  connectedCallback() {
    this.defineLabelText(this.getAttribute("lang"));
  }

  disconnectedCallback() {
  }

  static get observedAttributes() {
    return ["lang", "users"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "lang") {
      this.defineLabelText(newValue);
    }

    if (name === "users") {
      this.querySelectorAll(".user-name-container").forEach((element) => element.remove());
      this.querySelectorAll(".user-name-label-container").forEach((element) => element.remove());

      for (const userName of JSON.parse(newValue)) {
        const userNameElement = document.createElement("div");
        userNameElement.setAttribute("slot", "users");
        userNameElement.className = "user-name-container";
        userNameElement.innerHTML = userName;
        this.append(userNameElement);
      }

      if (JSON.parse(newValue).length !== 0) {
        const userNameLabelElement = document.createElement("div");
        userNameLabelElement.setAttribute("slot", "users-label");
        userNameLabelElement.className = "user-name-label-container";
        userNameLabelElement.innerHTML = TRANSLATIONS[this.getAttribute("lang")].usersList;
        this.append(userNameLabelElement);
      }
    }
  }

  adoptedCallback() {
  }

  defineLabelText(lang) {
    const userNameLabelElement = this.querySelector(".user-name-label-container");
    if (userNameLabelElement) {
      userNameLabelElement.innerHTML = TRANSLATIONS[lang].usersList;
    }
  }
}

export default UsersList;
