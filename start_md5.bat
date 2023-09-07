@echo off
chcp 65001>nul
title File hash
chcp 950>nul
cd /D %~dp0
call node start.js "md5" %*
pause
