setlocal

cd /d %~dp0
cd ..

node node_modules\textlint\bin\textlint.js -c .textlintrc_format %1

set /P USR_INPUT_STR="空リターンで続行"
if ""%USR_INPUT_STR%"" == """" (goto FORMAT)

exit 0

:FORMAT
node node_modules\textlint\bin\textlint.js -c .textlintrc_format --fix %1
pause

endlocal
