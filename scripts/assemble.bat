@echo off
setlocal enabledelayedexpansion

:: Define variables
set "intro=Assemble and Run program using nasm and with gcc linker. It assembles using nasm and links using gcc to binary."
set "author=Author: Abdullah AL Shohag <HackerShohag@outlook.com>"
set "author=!author!\nGithub: https://github.com/HackerShohag"
set "usage=Usage:"
set "usage=!usage!\n\t%~nx0 filename       to assemble, link, and run"
set "file=%~1"
for %%I in ("%file%") do set "filename=%%~nI"

:: Display help message
if "%file%" == "" (
  echo ERROR: Please, specify a filename.
  echo !usage!
  exit /b 1
)

:: Check if the file exists
if not exist "%file%" (
  echo ERROR: "%file%" does not exist.
  echo !usage!
  exit /b 1
)

:: Check the file extension
set "ext=%file:~-3%"
if not "%ext%" == "asm" (
  echo Provide a valid file (*.asm)
  exit /b 1
)

:: Assemble
echo NASM: Assembling %file%
nasm -f elf %file%
if not !errorlevel! == 0 (
  exit /b 1
)
echo NASM: Assembled %file%

:: Link
echo GCC: Linking %filename%.o using gcc
gcc -m32 -o %filename% %filename%.o
if not !errorlevel! == 0 (
  exit /b 1
)
echo GCC: Linked %filename%.o to %filename%

:: Build message
echo Assemble: Built target %filename%

:: Clean
del %filename%.o

:: Run
echo.
echo Output of the program:
echo.
%filename%
exit /b 0

