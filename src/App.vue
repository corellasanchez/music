<script src="../node_modules/firebase/firebase-app.js"></script>
<script src="../node_modules/firebase/firebase-auth.js"></script>
<script src="../node_modules/firebase/firebase-storage.js"></script>
<script src="../node_modules/firebase/firebase-firestore.js"></script>

<template>

    <div id="app">
        <router-view/>
    </div>
</template>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
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

.upper{
    text-transform: uppercase;
}
</style>
