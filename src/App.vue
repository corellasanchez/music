<template>
<div id="app" v-on:mousemove="updateCoordinates">
    <router-view />
</div>
</template>

<script>
export default {
    data: function () {
        return {
            y: 0,
            lastState: false
        };
    },
    methods: {
        updateCoordinates: function (event) {
            this.y = event.clientY;
            const currentState = this.y < 200;

            if (currentState !== this.lastState) {
                this.$ipcRenderer.invoke("hideMenu", currentState);
            }
            this.lastState = currentState;
        }
    }
};
</script>

<style>
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

#nav {
    padding: 30px;
}

#nav a {
    font-weight: bold;
    color: #2c3e50;
}

#nav a.router-link-exact-active {
    color: #42b983;
}

.upper {
    text-transform: uppercase;
}

.swal2-title {
    font-size: 1.1em !important;
}
</style>
