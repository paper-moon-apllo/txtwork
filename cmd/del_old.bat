setlocal

cd /d %~dp0
cd ..
forfiles /P dist /S /D -7 /M "*.txt" /c "cmd /c del @file"

endlocal
