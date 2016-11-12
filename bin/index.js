#!/usr/bin/env node
var path = require('path')
var fs = require('fs')
var chalk = require('chalk')
var inquirer = require('inquirer')
var release = require('../lib/release')
require('../lib/updateNotifier')
var configFilePath = path.join(process.cwd(), 'mfly-interactive.config.json')
require('../lib/configureWinston')

function init() {
	inquirer.prompt([{
		name: 'itemId',
		message: 'Enter Airship Item Id'
	}, {
		name: 'mcode',
		message: 'Enter Company Code'
	}, {
		name: 'slug',
		message: 'Enter Viewer Item slug'
	}, {
		name: 'productId',
		message: 'Enter Airship Product Id'
	}]).then(function (answers) {
		var data = {
			itemId: answers.itemId,
			mcode: answers.mcode,
			slug: answers.slug,
			productId: answers.productId
		}
    	fs.writeFile('mfly-interactive.config.json', JSON.stringify(data, null, 4), function() {
    		console.log(chalk.green('Initialized successfully!'))
    	})
	})
}

function upload() {
	inquirer.prompt([{
		name: 'userId',
		message: 'Enter Airship User Id'  
	}, {
		name: 'password',
		message: 'Enter Airship password',
		type: 'password'
	}]).then(function(answers) {
		var options = require(configFilePath)
		require('../lib/uploader')(answers.userId, answers.password, options.productId, options.itemId)
	})
}

function serve(argv) {
	var options = require(configFilePath)
	options.open = argv.open
	require('../lib/server')(options)
}

function getVersion() {
	var version = require('../package').version
	return console.log(`Version: ${chalk.green(version)}`)
}

var argv = require('yargs')
	.usage('Run the Interactive with the following options.')
	.option('open', {
		alias: 'o',
		default: true,
		type: 'boolean'
	})
	.command('version', 'Get version', function(yargs) {
		getVersion()
	})
	.command('serve', 'Serves it up', function(yargs) {
		serve(yargs.argv)
	})
	.command('init', 'Initialize', function() {
		init()
	})
	.command('publish', 'Create release and upload to Airship', function() {
		upload()
	})
	.command('release', 'Create the .interactive archive', function() {
		release(err => {
			if (err) {
				console.log(err)
			}
		})
	}).argv
