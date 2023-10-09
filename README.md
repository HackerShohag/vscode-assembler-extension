# Assemble and Compile Script with NASM and GCC

This simple bash script, named 'assemble,' streamlines the process of assembling and compiling assembly code for your host platform using NASM (Netwide Assembler) and GCC (GNU Compiler Collection). With 'assemble,' you can quickly turn your assembly source code into an executable binary with a 'main' section instead of '_start,' making it compatible with C-style program entry points.

![output](https://github.com/HackerShohag/vscode-assembler-extension/assets/47150885/c8a7ef37-20e7-4adf-bd9f-8419ea6e557f)

## Features

* Simplifies the process of assembling and compiling assembly code.
* Automatically detects the host platform and compiles the code accordingly.
* Generates an executable binary with a 'main' section for C-style program entry points.

# Requirements

To ensure that the assemble script runs correctly, certain requirements must be installed globally on your system. The installation methods may vary depending on your operating system. Below, you will find some popular guides, but you may need to adapt the instructions to your specific system.

## Basic Requrements

* NASM (Netwide Assembler, widely used assembly language compiler, https://www.nasm.us/)
* GCC (GNU Compiler Collection, widely used compiler for the C and C++, https://gcc.gnu.org/install/binaries.html)

### Installing NASM and GCC on Windows:

**NASM (Netwide Assembler):**

1. **Download NASM from (https://www.nasm.us/pub/nasm/releasebuilds).**

2. **Run the Installer and follow the instructions.**

3. **You may need to add NASM installation binary path to the environment variable for systemwide execution. [More details.](https://learn.microsoft.com/en-us/previous-versions/office/developer/sharepoint-2010/ee537574(v=office.14))**

4. **Verify the Installation:**
   - Open Command Prompt or PowerShell and run:
     ```bash
     nasm --version
     ```
   - It should display the installed NASM version.

**GCC (GNU Compiler Collection):**

1. **Downlaod GCC from (https://gcc.gnu.org/install/binaries.html)**

2. **Run the Installer and follow the instructions.**

3. **You may need to add NASM installation binary path to the environment variable for systemwide execution. [More details.](https://learn.microsoft.com/en-us/previous-versions/office/developer/sharepoint-2010/ee537574(v=office.14))**

4. **Verify the Installation:**
   - In the MSYS2 terminal, run:
     ```bash
     gcc --version
     ```
   - It should display the installed GCC version.

### Installing NASM and GCC on Linux (e.g., Ubuntu):

   - Run the following command to install NASM:
     ```bash
     sudo apt-get install nasm gcc
     ```
   - Run the following command to verify installtion:
      * For NASM:
         ```bash
         nasm --version
         ```
      * For GCC:
         ```bash
         gcc --version
         ```
   - It should display the installed NASM and GCC version.

### Installing NASM and GCC on macOS:

**NASM (Netwide Assembler):**

1. **Install NASM via Homebrew:**
   - If you don't have Homebrew installed, follow the instructions [here](https://docs.brew.sh/Installation).
   - Run the following command in terminal to install NASM:
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

# Example

The 'main' section is needed because it serves as the entry point for the program when compiled and linked with GCC. When you use GCC to compile and link your code, it expects to find a 'main' function as the starting point of your program. 

Here's a brief explanation of the process:

1. **Assembly Code:** You write your assembly code, including the 'main' section, which contains the code that will be executed when the program starts.

2. **Assembling:** You use NASM to assemble your assembly code into object code. This step generates a binary file containing machine code instructions.

3. **Linking with GCC:** When you link the object code with GCC, it performs several tasks, including resolving external dependencies and creating an executable binary. GCC expects a 'main' section as the program entry point.

4. **Program Execution:** When you run the resulting executable, the operating system loads it into memory and begins execution at the 'main' section, effectively starting your program.

In summary, the 'main' section is essential because it defines where program execution begins when using GCC to create an executable from assembly code. It ensures that your assembly program integrates seamlessly with the C-style program entry point expected by the compiler and the operating system.

Sample assembly code in 'hello.asm' with a 'main' section:

**For Linux and Windows Platform:**

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

**For macOS (Due to Compiler Dependency):**
```assembly
      global _main
      extern _puts

      section .text
   _main:
      sub     rsp, 8

      lea     rdi, [message]        ; Use this instead of 'mov rdi, message'
      call    _puts
      add     rsp, 8
      ret

      section .data
   message:
   default rel                     ; Add 'default rel' under label
      db   "Hello, world",0
```

## Author

Abdullah AL Shohag (<HackerShohag@outlook.com>)

Feel free to further customize the description with your own details and any additional features or usage instructions you think are relevant.

## License

Copyright (C) 2023 Abdullah AL Shohag

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3, as published by the Free Software Foundation.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranties of MERCHANTABILITY, SATISFACTORY QUALITY, or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.
