@echo off
setlocal enabledelayedexpansion

:: Define variables
set "intro=Assemble and Run program using nasm and with gcc linker. It assembles using nasm and links using gcc to binary."
set "author=Author: Abdullah AL Shohag <HackerShohag@outlook.com>"
set "author=!author!\nGithub: https://github.com/HackerShohag"
set "usage=Usage:"
set "usage="
set "usage=!usage!%~nx0 filename to assemble, link, and run"
set "file=%~1"
for %%I in ("%file%") do set "filename=%%~nI"

:: Display help message
if "%file%" == "" (
  color 4
  echo ERROR: Please, specify a filename.
  echo !usage!
  echo:
  echo Press Any Key To Exit
  pause>nul
  exit /b 1
)

:: Check if the file exists
if not exist "%file%" (
  color 4
  echo ERROR: "%file%" does not exist.
  echo !usage!
  echo:
  echo Press Any Key To Exit
  pause>nul
  exit /b 1
)

:: Check the file extension
set "ext=%file:~-3%"
if not "%ext%" == "asm" (
  color 4
  echo Provide a valid file (*.asm)
  echo:
  echo Press Any Key To Exit
  pause>nul
  exit /b 1
)

:: Assemble
echo.
echo Assembling %file%
nasm -f win32 %file% -o %filename%.o
if not !errorlevel! == 0 (
  pause>nul
  exit /b 1
)
echo Assembled %file%

:: Link
echo.
echo Linking %filename%.o using gcc
gcc -m32 -o %filename% %filename%.o
if not !errorlevel! == 0 (
  pause>nul
  exit /b 1
)
echo Linked %filename%.o to %filename%

:: Build message
echo.
echo Built target %filename%

:: Clean
del %filename%.o

:: Run
echo.
color 2
echo Output of the program:
echo.
%filename%
echo.
pause>nul
exit /b 0
