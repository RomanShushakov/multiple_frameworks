class PinCheckForm extends HTMLElement {
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

        .pin-check-form {
          display: flex;
          flex-direction: column;
          margin: 0;
          padding: 0;
          width: 100%;
          align-items: center;
        }

        input {
          margin: 0 0 10px 0;
          padding: 0;
          height: 20px;
          width: 250px;
        }

        button {
          margin: 10px 0 0 0;
          padding: 0;
          width: 100px;
          height: 25px;
        }
      </style>

      <div class=wrapper>
        <div class="pin-check-form">
          <label class="company-id-label" for="companyId"></label>
          <input type="text" id="companyId" name="companyId">
          <label class="customer-id-label" for="customerId"></label>
          <input type="text" id="customerId" name="customerId">
          <label class="pin-label" for="pin"></label>
          <input type="text" id="pin" name="pin">
          <button class="check-button" type="button"></button>
        </div>
      </div>
      `;

    this.shadowRoot.querySelector(".check-button").addEventListener(
      "click", (event) => this.onCheckButtonClick(event),
    );
  }

  connectedCallback() {
    this.defineLabelsText(this.getAttribute("lang"));
  }

  disconnectedCallback() {
  }

  static get observedAttributes() {
    return ["lang"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "lang") {
      this.defineLabelsText(newValue);
    }
  }

  adoptedCallback() {
  }

  defineLabelsText(lang) {
    this.shadowRoot.querySelector(".company-id-label").innerHTML = TRANSLATIONS[lang].companyId;
    this.shadowRoot.querySelector(".customer-id-label").innerHTML = TRANSLATIONS[lang].customerId;
    this.shadowRoot.querySelector(".pin-label").innerHTML = TRANSLATIONS[lang].pin;
    this.shadowRoot.querySelector(".check-button").innerHTML = TRANSLATIONS[lang].checkButton;
  }

  onCheckButtonClick() {
    console.log("Click");
  }
}

export default PinCheckForm;
