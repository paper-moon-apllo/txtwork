cd /d %~dp0

REM delete old files
call del_old.bat

cd ..
REM 
gulp watch
