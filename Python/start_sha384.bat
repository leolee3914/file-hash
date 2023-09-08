@echo off
chcp 65001>nul
title File hash
chcp 950>nul
cd /D %~dp0
py start.py "sha384" %*
pause
