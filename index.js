#!/usr/bin/env node
var pathUtil = require('path');
var http = require('http');

var fs = require('fs-extra');
var inquirer = require('inquirer');
var facade = require('commander');
var exec = require('child_process').exec;

var pkg = require('./package.json');
var remote = require('./t.js').remoteVersion;

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
  .version(pkg.version);

facade.parse(process.argv);

if (!facade.args.length) facade.help();


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
                        return e.length == 5 && 
                              ( e.indexOf('2') == 0 || e.indexOf('3') ==0 );
                      })
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
  var installPath = pathUtil.join(__dirname, './spms/', name);
  fs.ensureDirSync( pathUtil.join(__dirname, 'spms/') );
  var shellInstall = exec('npm install spm@' + name + ' --prefix ' + installPath);
  shellInstall.stdout.on('data', function (data) {
    console.log('' + data);
  });
  shellInstall.stderr.on('data', function (data) {
    console.log('' + data);
  });
}




