<script setup>
// external imports
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

// internal imports
import { SUPPORT_LOCALES } from '../i18n.js';

const { t, locale } = useI18n();
</script>

<template>
  <div class=wrapper>
    <div class="lang-select-container">
      <select class="lang-select" v-model="locale">
        <option v-for="optionLocale in SUPPORT_LOCALES" :key="optionLocale" :value="optionLocale">
          {{ optionLocale }}
        </option>
      </select>
    </div>
  </div>
</template>

<style scoped>
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
