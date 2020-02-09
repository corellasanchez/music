<template>
    <div>
        <div class="md-layout md-gutter">
            <div class="md-layout-item"></div>
            <div class="md-layout-item">
                <img class="logo" src="../assets/images/logo.png" />
            </div>
            <div class="md-layout-item"></div>
        </div>
    
        <div class="md-layout md-alignment-center-center">
            <span class="md-display-4">Bienvenido</span>
        </div>
          <div class="md-layout md-alignment-center-center">
            <span class="md-display-2">Verificando configuración del negocio...</span>
        </div>
    </div>
</template>

<script>
//const path = require('path');
const find = require("find");
const fs = require("fs");
const settings = require("electron-settings");

export default {
    name: "Loading",
    data: () => ({
        userSaved: false,
        sending: false,
        lastUser: null
    }),
    mounted() {
      this.verifyConfiguration();
    },
    methods: {
         verifyConfiguration() {
          
          // if(){

          //  }
      
      console.log(settings.get("configuration"));
      
      },

        folderWalk() {
            console.log("inicio indexacion");
            //new RegExp("m(a|á)n(a|á)", "i")
            var cleanFiles;
            var cleanFolders;

            var dirname = "/Users/roy.corella/projects/mission-control/src";

            find.dir(dirname, function(dirs) {
                cleanFolders = dirs.map(function(x) {
                    return x.replace(dirname, "");
                });
                console.log(cleanFolders);
            });

            find
                .file(new RegExp(/\.ts$/), dirname, function(files) {
                    // console.log(files.length,files);
                    cleanFiles = files.map(function(x) {
                        return x.replace(dirname, "");
                    });
                    fs.writeFile(
                        "./library.json",
                        JSON.stringify(cleanFiles),
                        function() {
                            console.log("done");
                        }
                    );

                    console.log(cleanFiles);
                })
                .error(function(err) {
                    if (err) {
                        console.log(err);
                    }
                });
        }
    }
};
</script>

<style>
.md-app {
    height: 100vh;
}

.logo {
    margin-top: 150px;
}

.md-progress-bar {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
}

.left {
    text-align: left;
}

.action {
    margin-top: 50px;
}
</style>