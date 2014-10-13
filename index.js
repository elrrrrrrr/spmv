#!/usr/bin/env node
var pathUtil = require('path');
var fs = require('fs-extra');
var inquirer = require('inquirer');
var facade = require('commander');

var pkg = require('./package.json');
// var pokemonList = fs.readdirSync('pokemon');


// primary comamnd , support type pokemon directly . [TODO]
facade
  .command('install')
  .description('catch a pokemon')
  .action(handlerInstall);
facade
  .command('use')
  .description('release a pokemon')
  .action(handlerUse)

facade
 .version(pkg.version)
 .option('-f, --force', 'processing in force [TODO]')
 .option('-r, --rename', 'rename the pokemon [TODO]')
 .option('-m, --merge', 'merge two pokemon [TODO]')
 .parse(process.argv);


function showList(type, cb) {

  var isDictionary = function(name) {
    return fs.lstatSync(name).isDirectory();
  }

  inquirer.prompt([
    {
      type: "list",
      name: "version",
      message: "pick a version",
      choices: fs.readdirSync(pathUtil.join(__dirname, 'spms'))
                  //.concat([ new inquirer.Separator(), 'exit'])
    }
  ], function( answers ) {
      
      cb && cb( answers.version )
      //console.log( JSON.stringify(answers, null, "  ") );
    }); 
}

function temp() {
  console.log('still in building');
}

function handlerUse() {
  showList( 'use', useVersion )
  
}

function handlerInstall() {
  showList( 'install', installVersion )
}

function useVersion(name, path) {
  console.log('should use Version', name) 
  var source = pathUtil.join(__dirname, 'spms', name) + '/index.js'
  var dist = '/usr/local/bin/' + 'ttt'
  fs.remove(dist, function() {
    exec('ln -s ' + source + ' ' + dist )  
  })
  
}

function killPoke(name) {

}

function listPoke(name) {

}

var exec = require('child_process').exec;

function puts(error, stdout, stderr) { sys.puts(stdout) }


// exec("ls -la", function(err, stdout, stderr) {
//   if (err) {
//     return console.log(stderr)
//   }
//   console.log(stdout)
// });