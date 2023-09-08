import hashlib
import time
import os
import sys

'''
  _            _           ____   ___  __ _  _   
 | |          | |         |___ \ / _ \/_ | || |  
 | | ___  ___ | | ___  ___  __) | (_) || | || |_ 
 | |/ _ \/ _ \| |/ _ \/ _ \|__ < \__, || |__   _|
 | |  __/ (_) | |  __/  __/___) |  / / | |  | |  
 |_|\___|\___/|_|\___|\___|____/  /_/  |_|  |_|  
'''

MAX_BUFFER_LENGTH = 1024 * 1024 * 5

try:
	os.mkdir('./f')
except:
	pass

startTime = time.time()

try:
	hashAlgo = sys.argv[1]
except:
	raise ValueError('Invalid hash algorithm')

if hashAlgo not in hashlib.algorithms_available:
	raise ValueError('Unsupported hash algorithm')

argvPathList = sys.argv[2:]

folderCount = 0
fileCount = 0

def printHash ( path ) :
	global folderCount, fileCount

	if os.path.isdir(path):
		folderCount += 1

		for fileName in os.listdir(path):
			printHash(os.path.join(path, fileName))
	elif os.path.isfile(path):
		fileCount += 1

		hashCtx = hashlib.new(hashAlgo)

		with open(path, 'rb') as file:
			while 1:
				read = file.read(MAX_BUFFER_LENGTH)

				if len(read) > 0:
					hashCtx.update(read)
				else:
					break
			
			realPath = os.path.realpath(path)
			fileHash = hashCtx.hexdigest()

			print('File: ' + realPath + '\n' + hashAlgo + ': ' + fileHash + '\n')

if len(argvPathList) > 0:
	for path in argvPathList:
		printHash(path)
else:
	printHash('./f')

endTime = time.time()
print('Folders: ' + str(folderCount) + ', Files: ' + str(fileCount))
print('Time: ' + str(round(endTime - startTime, 3)) + 's [Python]\n\n')
