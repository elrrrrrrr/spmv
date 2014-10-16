#!/usr/bin/env node
var pathUtil = require('path');
var http = require('http');

var fs = require('fs-extra');
var inquirer = require('inquirer');
var ui = new inquirer.ui.BottomBar();
var facade = require('commander');

var pkg = require('./package.json');
var remote = require('./t.js').remoteVersion;
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
 .parse(process.argv);


function showList(list, cb) {

  var isDictionary = function(name) {
    return fs.lstatSync(name).isDirectory();
  }

  inquirer.prompt([
    {
      type: "list",
      name: "version",
      message: "pick a version",
      choices: list
                  
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
  var list = fs.readdirSync(pathUtil.join(__dirname, 'spms'));
  showList(list, useVersion)
}

function handlerInstall() {
  var url = 'http://r.cnpmjs.org/spm';
  remote('http://r.cnpmjs.org/spm', function(err, versions) {
    if (err) {
      console.log('Err');
      return 
    } else {
      var list = Object.keys(versions)
                      .filter( function(e) {
                        return e.length == 5 && ( e.indexOf('2') == 0 || e.indexOf('3') ==0 );
                      })
                      .sort( function (a, b) { return a-b; } );
      showList(list, installVersion)    
    }
  })
  
}

function useVersion(name, path) {
  console.log('should use Version', name) 
  var source = pathUtil.join(__dirname, 'spms', name) + '/node_modules/.bin/spm';
  var dist = '/usr/local/bin/' + 'spm';

  fs.remove(dist, function() {
    exec('ln -s ' + source + ' ' + dist)  
  })
}

function installVersion (name) {
  console.log('should install ' + name);
  var perfix = '';
  // function output(error, stdout, stderr) {
  //   console.log('stdout: ' + stdout);
  //   console.log('stderr: ' + stderr);
  //   if (error !== null) {
  //     console.log('exec error: ' + error);
  //   }
  // }
  var shellInstall = exec('npm install spm@' + name + ' --prefix ./spms/'+ name)
  shellInstall.stdout.on('data', function (data) {
    console.log('' + data);
  });
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