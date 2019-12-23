<template>
  <div id="app">
    <router-link to='/index' tag="div">首页</router-link>
    <router-link to='/about' tag="div">关于</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>

</style>
