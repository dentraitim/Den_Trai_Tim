@echo off
echo Minify filesystem..
call node build.js
echo Building firmware..
mos build --platform="esp8266"
