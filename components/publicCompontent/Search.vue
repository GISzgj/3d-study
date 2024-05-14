<template>
  <div class="search-box">
    <input
      class="search-txt"
      type="text"
      v-model.trim="inputValue"
      placeholder="动态搜索框"
      @input=""
    />
    <a class="search-btn" @click="e => handlerClick(inputValue, e)">
      <img src="./img/search.svg" />
    </a>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  const inputValue = ref('')
  const emit = defineEmits(['clickSearch'])
  const handlerClick = (v, e) => {
    emit('clickSearch', v, e)
    inputValue.value = ''
  }
</script>

<style lang="scss" scoped>
  .search-box {
    display: flex;
    justify-content: center;
    height: 100%;
    border-radius: 40px;
    padding: 10px;
    background-color: #faab6b;
    backdrop-filter: blur(1px);
  }
  .search-btn {
    float: right;
    display: flex;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    justify-content: center;
    transition: 0.8s;
    cursor: pointer;
  }
  .search-btn > img {
    height: 25px;
    width: 25px;
  }
  .search-txt {
    border: none;
    background: none;
    outline: none;
    float: left;
    color: rgb(117, 117, 117);
    font-size: 16px;
    transition: 0.8s;
    line-height: 40px;
    width: 145px;
    padding: 0 6px;
  }
</style>
