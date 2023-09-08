@echo off
chcp 65001>nul
title File hash
chcp 950>nul
cd /D %~dp0
php.exe -f start.php "sha384" %*
pause
