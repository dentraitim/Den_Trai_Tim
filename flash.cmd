@echo off
mos flash --platform esp8266 --esp-flash-params "dio,32m,80m" --port COM8 --esp-baud-rate 0 --esp-erase-chip --esp-rom-baud-rate 115200