<template lang="pug">
.container
  .error-message
    h1.error-message__text ОШИБКА ПОДКЛЮЧЕНИЯ К СЕРВЕРУ АВТОРИЗАЦИИ
    button.error-message__button(@click="reload") Сдохни, тварь!
</template>

<script setup lang="ts">
const reload =()=>{
  location.reload()
}
</script>


<style scoped lang="sass">
.container
  background: #333
  color: #fff
  position: fixed
  inset: 0
  width: 100vw
  height: 100vh
  display: grid
  place-items: center

.error-message

  &__button
    display: block
    background: #ddd
    color: #d40
    padding: 1rem
    border-radius: 6px
    width: max-content
    margin: 2rem auto
</style>
