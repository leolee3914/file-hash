<?php

/**
 *   _            _           ____   ___  __ _  _
 *  | |          | |         |___ \ / _ \/_ | || |
 *  | | ___  ___ | | ___  ___  __) | (_) || | || |_
 *  | |/ _ \/ _ \| |/ _ \/ _ \|__ < \__, || |__   _|
 *  | |  __/ (_) | |  __/  __/___) |  / / | |  | |
 *  |_|\___|\___/|_|\___|\___|____/  /_/  |_|  |_|
 */

declare(strict_types=1);

namespace {

	set_time_limit(-1);

	const MAX_BUFFER_LENGTH = 1024 * 1024 * 5;

	@mkdir('./f');

	$startTime = hrtime(true);

	define('HASH_ALGO', $argv[1] ?? null);

	if ( !in_array(HASH_ALGO, hash_algos(), true) ) {
		throw new InvalidArgumentException('Unsupported hash algorithm');
	}

	$argvPathList = array_slice($argv, 2);

	$folderCount = 0;
	$fileCount = 0;

	if ( count($argvPathList) > 0 ) {
		foreach ( $argvPathList as $path ) {
			printHash($path);
		}
	} else {
		printHash('./f');
	}

	$endTime = hrtime(true);
	echo "Folders: $folderCount, Files: $fileCount\n";
	echo "Time: " . round(($endTime - $startTime) / 1_000_000_000, 3) . "s [PHP]\n\n\n";

	function printHash ( $path ) : void {
		global $folderCount, $fileCount;

		if ( is_dir($path) ) {
			++$folderCount;

			foreach ( scandir($path . '/') as $fileName ) {
				if ( $fileName === '.' or $fileName === '..' ) {
					continue;
				}
				printHash($path . '/' . $fileName);
			}
		} elseif ( is_file($path) ) {
			++$fileCount;

			$hash = hash_file(HASH_ALGO, $path);

			echo 'File: ' . realpath($path) . "\n" . HASH_ALGO . ': ' . $hash . "\n\n";
		}
	}

}
