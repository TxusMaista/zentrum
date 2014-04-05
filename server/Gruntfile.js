// module.exports = function(grunt) {
//     grunt.initConfig({  
//         pkg: grunt.file.readJSON('package.json'),

//         bgShell: {
//             runNode: {
//                 cmd: 'node app.js',
//                 bg: true
//             }
//         },

//         message: {
//             mesage: 'Kaixo!!'
//         },

//         watch: {
//             stylesheets: {
//                 files: ['*.js'],
//                 tasks: ['message'],
//                 options: {
//                     interrupt: true
//                 }
//             }
//         }
//     });


//     grunt.loadNpmTasks('grunt-contrib-watch');
//     grunt.loadNpmTasks('grunt-bg-shell');

//     // Con ésta tarea llamada 'compile' llamamos a las tareas 'stylus' y 'cssmin' que ahora definiremos
//     //grunt.registerTask('compile', ['stylus', 'cssmin']);
//     // Ésta tarea llamada 'server' nos permitirá correr el servidor a al vez que las tareas 'compile' y 'watch' que ahora definiremos
//     //grunt.registerTask('log', ['message']);
//     grunt.registerTask('server', ['bgShell:runNode', 'watch']);
// };

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    serverFile: 'server.js',
    shell: {
      nodemon: {
        command: 'nodemon <%= serverFile %>',
        options: {
          stdout: true,
          stderr: true
        }
      }
    },
    watch: { /* nothing to do in watch anymore */ }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('default', 'shell:nodemon');
};

