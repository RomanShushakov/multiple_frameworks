<script setup>
import { ref } from 'vue';

defineProps({
  msg: String,
});

const count = ref(0);

const getData = async (url) => {
  console.log('Get DATA');
  const repsonse = await fetch(url);
  return repsonse;
};

const postData = async (url = "", data = {}) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  return response;
};

const onButtonClick = () => {
  getData(import.meta.env.VITE_GREETING_URL)
    .then((response) => {
      if (response.ok) {
        response.json()
          .then((data) => {
            console.log(data);
          })
      }
    });

}
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <button type="button" @click="onButtonClick()">Click Me!</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>, the official Vue + Vite
    starter
  </p>
  <p>
    Learn more about IDE Support for Vue in the
    <a href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support" target="_blank">Vue Docs Scaling up Guide</a>.
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
