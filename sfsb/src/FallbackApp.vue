<template>
    <div class="container">
        <ul class="loader">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
        </ul>
    </div>
</template>

<style scoped>
body {
    background-color: #333;
}

.container {
    position: fixed;
    z-index: 4;
    left: 35px;
    right: 0;
    top: 50%;
    margin: -45px auto 0;
    width: 120px;
    height: 80px;
    list-style: none;
}


.loader {
    position: fixed;
    z-index: 3;
    left: 0;
    right: 0;
    top: 50%;
    margin: -30px auto 0;
    width: 90px;
    height: 60px;
    list-style: none;

}

@keyframes loadbars {
    0% {
        height: 10px;
        margin-top: 25px;
    }
    50% {
        height: 50px;
        margin-top: 0px;
    }
    100% {
        height: 10px;
        margin-top: 25px;
    }
}

li {
    background-color: #2F477E;
    width: 10px;
    height: 10px;
    float: right;
    margin-right: 5px;
    box-shadow: 0px 20px 10px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
}

li:first-child {
    animation: loadbars 1s cubic-bezier(0.645, 0.045, 0.355, 1) infinite 0s;
}

li:nth-child(2) {
    animation: loadbars 1s ease-in-out infinite -0.2s;
}

li:nth-child(3) {
    animation: loadbars 1s ease-in-out infinite -0.4s;
}

li:nth-child(4) {
    animation: loadbars 1s ease-in-out infinite -0.6s;
}

li:nth-child(5) {
    animation: loadbars 1s ease-in-out infinite -0.8s;
}

li:nth-child(6) {
    animation: loadbars 1s ease-in-out infinite -1.0s;
}


</style>
