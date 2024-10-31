class TopBar extends HTMLElement {
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
          margin: 0;
          border-bottom: 1px solid gray;
          width: 100%;
        }

        .lang-select-container {
          display: flex;
          flex-direction: row;
          padding: 10px;
          margin: 0;
          justify-content: end;
        }

        .lang-select {
          border: hidden;
        }
      </style>

      <div class=wrapper>
        <div class="lang-select-container">
          <select class="lang-select"></select>
        </div>
      </div>
      `;

    this.shadowRoot.querySelector(".lang-select").addEventListener(
      "change", (event) => this.onLangSelect(event),
    );
  }

  connectedCallback() {
    this.defineSelectedLanguage();
  }

  disconnectedCallback() {
  }

  static get observedAttributes() {
  }

  attributeChangedCallback(name, oldValue, newValue) {
  }

  adoptedCallback() {
  }

  defineSelectedLanguage() {
    const langSelect = this.shadowRoot.querySelector(".lang-select");
    for (let i = Object.keys(TRANSLATIONS).length - 1; i >= 0; i--) {
      langSelect.options[i] = null;
    }
    for (const lang of Object.keys(TRANSLATIONS)) {
      let langOption = document.createElement("option");
      langOption.value = lang;
      langOption.innerHTML = lang.toUpperCase();
      if (lang === this.getAttribute("lang")) {
        langOption.selected = true;
      }
      langSelect.appendChild(langOption);
    }
  }

  onLangSelect(event) {
    this.dispatchEvent(new CustomEvent("selectLanguage", {
      bubbles: true,
      composed: true,
      detail: {
        "lang": event.target.value,
      }
    }));
  }
}

export default TopBar;
