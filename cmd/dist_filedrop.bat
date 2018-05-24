setlocal

cd /d %~dp0
cd ..

gulp dist -t %1

endlocal
