<template>
    <div class="impuls-hub">
        <div class="impuls">ИМПУЛЬС</div>
        <div class="hub">Атом</div>
    </div>
</template>

<style scoped>
.impuls-hub {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 2px solid black;
    padding: 4px;
    background-color: black;
    color: black;
    border-radius: 10px;
    height: 100%;
}

.impuls,
.hub {
    font-family: 'Roboto', sans-serif;
    font-size: 1em;
    padding: 0px 5px;
}

.impuls {
    background-color: black;
    color: white;
    font-weight: bold;
}

.hub {
    background-color: #fff;
    border-radius: 10px;
    font-weight: bold;
}
</style>
