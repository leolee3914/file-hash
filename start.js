/**
 *   _            _           ____   ___  __ _  _   
 *  | |          | |         |___ \ / _ \/_ | || |  
 *  | | ___  ___ | | ___  ___  __) | (_) || | || |_ 
 *  | |/ _ \/ _ \| |/ _ \/ _ \|__ < \__, || |__   _|
 *  | |  __/ (_) | |  __/  __/___) |  / / | |  | |  
 *  |_|\___|\___/|_|\___|\___|____/  /_/  |_|  |_|  
 * 
 */

'use strict';

(() => {
	const MAX_BUFFER_LENGTH = 1024 * 1024 * 5;//5MB
	
	const fs = require('fs');
	const crypto = require('crypto');
	
	try {
		fs.mkdirSync('./f');
	} catch ( error ) {}
	
	const startTime = performance.now();
	
	const hashAlgo = process.argv[2];
	
	if ( !crypto.getHashes().includes(hashAlgo) ) {
		throw new Error('Unsupported hash algorithm');
	}
	
	const argvPathList = process.argv.slice(3);
	
	if ( argvPathList.length > 0 ) {
		argvPathList.forEach(function (path) {
			printHash(path);
		});
	} else {
		printHash('./f');
	}
	
	const endTime = performance.now();
	console.log(`Time: ${Math.round(endTime - startTime) / 1000}s\n\n`);
	
	function printHash ( path ) {
		let pathStat = fs.statSync(path);
	
		if ( pathStat.isDirectory() ) {
			fs.readdirSync(path).forEach(function (fileName) {
				printHash(path + '/' + fileName);
			});
		} else if ( pathStat.isFile() ) {
			let file = fs.openSync(path, 'r');
			let hashCtx = crypto.createHash(hashAlgo);
			let buffer = Buffer.allocUnsafe(MAX_BUFFER_LENGTH);
	
			while ( true ) {
				let bytesRead = fs.readSync(file, buffer, 0, MAX_BUFFER_LENGTH, null);
	
				if ( bytesRead < MAX_BUFFER_LENGTH ) {
					if ( bytesRead > 0 ) {
						hashCtx.update(buffer.subarray(0, bytesRead));
					}
					break;
				}
				hashCtx.update(buffer);
			}
			fs.closeSync(file);
	
			let realPath = fs.realpathSync(path);
			let hash = hashCtx.digest('hex');
	
			console.log(`File: ${realPath}\n${hashAlgo}: ${hash}\n`);
		}
	}
})();
