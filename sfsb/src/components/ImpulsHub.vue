<template>
  <v-container class="impuls-hub">
    <div class="impuls">ИМПУЛЬС</div>
    <div class="hub">Атом</div>
  </v-container>
</template>

<style scoped>
.impuls-hub {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 2px solid black;
  padding: 10px;
  background-color: black;
  color: black;
  border-radius: 10px;
}

.impuls, .hub {
  font-family: 'Roboto', sans-serif;
  font-size: 1em;
  padding: 5px;
}

.impuls {
  background-color: black;
  color: white;
  font-weight: bold;
}

.hub {
  background-color: orange;
  border-radius: 10px;
  font-weight: bold;
}
</style>
