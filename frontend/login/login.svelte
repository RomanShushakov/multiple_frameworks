<script>
  import "bootstrap/dist/css/bootstrap.css";
  import "bootstrap";
  import Ajv from "ajv";
  import addFormats from "ajv-formats";

  const form = {
    email: "",
    password: "",
  };

  const formErrors = {
    email: "",
    password: "",
  };

  const schema = {
    type: "object",
    properties: {
      email: {
        type: "string",
        format: "email",
      },
      password: {
        type: "string",
        minLength: 5,
        maxLength: 30,
      },
    },
    required: ["email", "password"],
    additionalProperties: false,
  };

  const ajv = new Ajv();
  addFormats(ajv, ["email"]);
  const validate = ajv.compile(schema);

  const getData = async (url) => {
    const response = await fetch(url);
    return response;
  };

  const postData = async (url, data) => {
    const response = await fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response;
  };

  const login = async (url, data) => {
    let success;
    let message;
    let token = "";
    await postData(url, data).then(async (response) => {
      success = response.status === 200;
      if (success && import.meta.env.MODE === "development") {
        const { token_type, access_token } = await response.json();
        token = `${token_type} ${access_token}`;
      }
      message =
        response.status === 200
          ? "You have successfully logged in."
          : "There was a problem logging in. Check your email and password.";
    });
    return [success, message, token];
  };

  let successMessage = "";
  let errorMessage = "";
  const showMessage = async (success, message) => {
    if (success) {
      successMessage = message;
      errorMessage = "";
    } else {
      successMessage = "";
      errorMessage = message;
    }
    setTimeout(
      () => {
        successMessage = "";
        errorMessage = "";
        if (success) {
          getData("./index.html").then((response) => {
            window.location.href = response.url;
          });
        }
      },
      !message ? 0 : success ? 1500 : 3500,
    );
  };

  const handleSubmit = async () => {
    if (!validate(form)) {
      formErrors[validate.errors[0].instancePath.slice(1)] =
        validate.errors[0].message;
      setTimeout(() => {
        Object.keys(formErrors).forEach((key) => {
          formErrors[key] = "";
        });
      }, 3500);
      return;
    }

    const [success, message, token] = await login(
      import.meta.env.VITE_LOGIN_URL,
      form,
    );
    if (import.meta.env.MODE === "development") {
      localStorage.token = token;
    }
    await showMessage(success, message);
  };
</script>

<div class="wrapper">
  <p class="fs-6 fw-semibold">Choose your destiny</p>
  <form on:submit|preventDefault={handleSubmit} style="width: 15%;">
    <div class="row mb-3 w-10">
      <input
        type="text"
        class="form-control"
        class:is-invalid={formErrors.email}
        placeholder="email@example.com"
        bind:value={form.email}
      />
      <div class="invalid-feedback">{formErrors.email}</div>
    </div>
    <div class="row mb-3">
      <input
        type="password"
        class="form-control"
        class:is-invalid={formErrors.password}
        placeholder="Password"
        bind:value={form.password}
      />
      <div class="invalid-feedback">{formErrors.password}</div>
    </div>
    <div class="row mb-3">
      <button type="submit" class="btn btn-primary mb-3">Log In</button>
    </div>
  </form>

  <div class="row justify-content-center">
    <span
      class={successMessage ? "text-success" : "text-danger"}
      style="margin-bottom: 1rem; display: {successMessage || errorMessage
        ? 'block'
        : 'none'};"
    >
      {@html successMessage || errorMessage}
    </span>
  </div>

  <a href="./index.html" class="link-secondary">to the start page</a>
</div>

<style>
  .wrapper {
    margin-top: 1rem;
    margin-bottom: 0;
    margin-left: 0;
    margin-right: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
