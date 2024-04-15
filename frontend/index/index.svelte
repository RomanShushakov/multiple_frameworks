<div class="wrapper">
  <div class="header">
    <a href="./login.html" class="btn btn-outline-primary">Log In</a> 
  </div>
  <div class="content">
    <div class="description">
      <p class="description-text">Powered by Vite!</p>
      <img src={ viteIcon } alt="vite icon" width="50" height="50">
    </div>
    <div class="cards">
      {#each Object.entries(icons) as [path, icon]}
      <div class="card">
        <div class="card-body">
          <div class="card-header">
            <img class="framework-icon" src={ icon } alt="vite icon" width="50" height="50">
            <h6 class="card-subtitle mb-2 text-body-secondary">User info</h6>
          </div>
          <a href={ path } class="card-link">Open</a>
        </div>
      </div>
      {/each}
    </div>
  </div>
</div>

<script>
  import "bootstrap/dist/css/bootstrap.css";
  import "bootstrap";

  import viteIcon from "../assets/images/vite-icon.svg";

  import vueIcon from "../assets/images/vue-icon.svg";
  import svelteIcon from "../assets/images/svelte-icon.svg";
  import angularIcon from "../assets/images/angular-icon.svg";

  const icons = {
		"./vue.html": vueIcon,
  	"./svelte.html": svelteIcon,
    "./angular.html": angularIcon,
	};
</script>

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

  .header {
    margin: 0;
    padding: 0;
    display: flex;
    width: 100%;
    justify-content: end;
  }

  .btn {
    margin: 0 2rem 0 0;
  }

  .content {
    margin: 0;
    padding: 0;
    display: flex;
    width: 100%;
    flex-direction: column;
  }

  .description {
    margin: 0;
    padding: 0;
    display: flex;
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .description-text {
    margin: 0 2rem 0 0;
    padding: 0;
    font-size: 1.2rem;
    font-weight: 700;
  }

  .cards {
    margin: 20px 0 0 0;
    padding: 0;
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: center;
  }

  .card {
    width: 12rem;
    align-items: center;  
  }

  .card-body {
    align-items: center;
    display: flex;
    flex-direction: column;
  }

  .card-header {
    margin: 0;
    padding: 0;
    display: flex;
    width: 100%;
    flex-direction: row;
    align-items: center;
    background-color: white;
    border: none;
  }

  .framework-icon {
    margin: 0 10px 0 0;
  }

  .mb-2 {
    margin-bottom: 0 !important;
  }

  .card:not(:first-child) {
    margin: 0 0 0 20px;
  }
</style>
