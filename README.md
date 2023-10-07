# Assemble and Compile Script with NASM and GCC

This simple bash script, named 'assemble,' streamlines the process of assembling and compiling assembly code for your host platform using NASM (Netwide Assembler) and GCC (GNU Compiler Collection). With 'assemble,' you can quickly turn your assembly source code into an executable binary with a 'main' section instead of '_start,' making it compatible with C-style program entry points.

![output](https://github.com/HackerShohag/vscode-assembler-extension/assets/47150885/c8a7ef37-20e7-4adf-bd9f-8419ea6e557f)

## Features

* Simplifies the process of assembling and compiling assembly code.
* Automatically detects the host platform and compiles the code accordingly.
* Generates an executable binary with a 'main' section for C-style program entry points.

# Requirements

## Basic Requrements

* NASM (Netwide Assembler, widely used assembly language compiler, https://www.nasm.us/)
* GCC (GNU Compiler Collection, widely used compiler for the C and C++, https://gcc.gnu.org/install/binaries.html)

### Installing NASM and GCC on Windows:

**NASM (Netwide Assembler):**

1. **Download NASM:**
   - Visit the official NASM website: [NASM Downloads](https://www.nasm.us/pub/nasm/releasebuilds/)
   - Download the Windows installer (usually a `.exe` file) for the latest version.

2. **Run the Installer:**
   - Double-click the downloaded `.exe` file to run the installer.
   - Follow the on-screen instructions to complete the installation.

3. **Verify the Installation:**
   - Open Command Prompt or PowerShell and run:
     ```bash
     nasm --version
     ```
   - It should display the installed NASM version.

**GCC (GNU Compiler Collection):**

1. **Install GCC:**
   - Visit the official NASM website: [GNU GCC Downloads](https://gcc.gnu.org/install/binaries.html)
   - Download the Windows installer (usually a `.exe` file) for the latest version.

2. **Run the Installer:**
   - Double-click the downloaded `.exe` file to run the installer.
   - Follow the on-screen instructions to complete the installation.

3. **Verify the Installation:**
   - In the MSYS2 terminal, run:
     ```bash
     gcc --version
     ```
   - It should display the installed GCC version.

### Installing NASM and GCC on Linux (e.g., Ubuntu):

1. **Update the Package List:**
   - Open Terminal.
   - Run the following command to update the package list:
     ```bash
     sudo apt-get update
     ```

2. **Install NASM and GCC:**
   - Run the following command to install NASM:
     ```bash
     sudo apt-get install nasm gcc
     ```

3. **Verify the Installation:**
   - In Terminal, run:
     ```bash
     nasm --version
     ```   
   - For GCC, run:
     ```bash
     gcc --version
     ```
   - It should display the installed NASM and GCC version.

### Installing NASM and GCC on macOS:

**NASM (Netwide Assembler):**

1. **Install NASM via Homebrew:**
   - Open Terminal.
   - If you don't have Homebrew installed, follow the instructions in [Installing Homebrew on macOS](#installing-homebrew-on-macos) section.
   - Run the following command to install NASM:
     ```bash
     brew install nasm gcc
     ```

2. **Verify the Installation:**
   - In Terminal, run:
     ```bash
     nasm --version
     ```
   - Again for GCC, run:
     ```bash
     gcc --version
     ```
   - It should display the installed NASM and GCC version.

These instructions should help you install NASM and GCC on Windows, Linux (Ubuntu), and macOS. Make sure to adapt the Linux instructions for other distributions if needed.


## VSCode extensions Requirements (For installing GCC and NASM automatically)

This installing guide is for the automatic installion of NASM and GCC if you haven't installed it yet. You can skip this section if your machine have properly installed NASM and GCC mentioned in [Basic Requirements](#basic-requirements) section. This requirements needs to be fulfilled before installing the extension.

### Installing Winget on Windows 11:

1. **Open the Microsoft Store.**

2. **Search for "Windows Package Manager" (Winget) or App Installer or click [here](https://www.microsoft.com/en-us/p/app-installer/9nblggh4nns1).**

3. **Install Windows Package Manager (Winget).**

4. **Verify the Installation:**
   - Once installed, you can verify the installation by opening PowerShell or Command Prompt and running:
     ```powershell
     winget --version
     ```
   - It should display the installed Winget version.

For a more detailed guide, you can visit Microsoft's Official [website](https://learn.microsoft.com/en-us/windows/package-manager/winget/#install-winget).

### Installing Homebrew on macOS:

1. **Open Terminal:**
   - Press `Cmd + Space`, type "Terminal," and press Enter to open the Terminal.

2. **Install Homebrew:**
   - Run the following command in the Terminal to install Homebrew:
     ```bash
     /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
     ```

3. **Follow the On-Screen Instructions to complete installation.**

4. **Verify the Installation:**
   - To confirm that Homebrew is installed, you can run the following command in the Terminal:
     ```bash
     brew --version
     ```
   - It should display the installed Homebrew version.

For more detailed information and troubleshooting, you can refer to the official Homebrew installation guide on their [website](https://brew.sh/).

> Note: If you have the extension installed before meeting these requirements you need to run the `installNASMndGCC` command manually to auto install NASM and GCC for Windows and macOS. To do so run, `Ctrl + Shift + P` and search for `Assembler: Install NASM and GCC`. Hit return after to execute the command. This will automatically install NASM and GCC for the desired platform using winget for Windows and homebrew for macOS.

![installNASMndGCC](https://github.com/HackerShohag/vscode-assembler-extension/assets/47150885/7d09d8a8-ffc5-4611-910c-c62ce1d46bb0)

# Example

The 'main' section is needed because it serves as the entry point for the program when compiled and linked with GCC. When you use GCC to compile and link your code, it expects to find a 'main' function as the starting point of your program. 

Here's a brief explanation of the process:

1. **Assembly Code:** You write your assembly code, including the 'main' section, which contains the code that will be executed when the program starts.

2. **Assembling:** You use NASM to assemble your assembly code into object code. This step generates a binary file containing machine code instructions.

3. **Linking with GCC:** When you link the object code with GCC, it performs several tasks, including resolving external dependencies and creating an executable binary. GCC expects a 'main' section as the program entry point.

4. **Program Execution:** When you run the resulting executable, the operating system loads it into memory and begins execution at the 'main' section, effectively starting your program.

In summary, the 'main' section is essential because it defines where program execution begins when using GCC to create an executable from assembly code. It ensures that your assembly program integrates seamlessly with the C-style program entry point expected by the compiler and the operating system.

Sample assembly code in 'hello.asm' with a 'main' section:

```assembly
section .data
    hello db 'Hello, World!',0

section .text
    global main

main:
    mov eax, 4
    mov ebx, 1
    mov ecx, hello
    mov edx, 13
    int 0x80

    mov eax, 1
    int 0x80
```

## Author

Abdullah AL Shohag (<HackerShohag@outlook.com>)

Feel free to further customize the description with your own details and any additional features or usage instructions you think are relevant.

## License

Copyright (C) 2023 Abdullah AL Shohag

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3, as published by the Free Software Foundation.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranties of MERCHANTABILITY, SATISFACTORY QUALITY, or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.
