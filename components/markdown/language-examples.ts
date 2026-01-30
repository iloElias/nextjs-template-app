export const LANGUAGE_EXAMPLES: Record<string, string> = {
  javascript: `function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));`,

  typescript: `function add(a: number, b: number): number {
  return a + b;
}

const result: number = add(5, 3);
console.log(result);`,

  jsx: `function Button() {
  return (
    <button onClick={() => alert('Clicked!')}>
      Click me
    </button>
  );
}`,

  tsx: `interface Props {
  text: string;
}

const Button: React.FC<Props> = ({ text }) => {
  return <button>{text}</button>;
};`,

  python: `def greet(name):
    return f"Hello, {name}!"

print(greet("World"))`,

  java: `public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,

  csharp: `using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("Hello, World!");
    }
}`,

  cpp: `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`,

  c: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,

  go: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,

  rust: `fn main() {
    println!("Hello, World!");
}`,

  php: `<?php
$name = "World";
echo "Hello, $name!";
?>`,

  ruby: `def greet(name)
  "Hello, #{name}!"
end

puts greet("World")`,

  swift: `func greet(name: String) -> String {
    return "Hello, \\(name)!"
}

print(greet(name: "World"))`,

  kotlin: `fun main() {
    val name = "World"
    println("Hello, $name!")
}`,

  html: `<!DOCTYPE html>
<html>
<head>
    <title>My Page</title>
</head>
<body>
    <h1>Hello, World!</h1>
</body>
</html>`,

  css: `.button {
  background: #3490dc;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
}

.button:hover {
  background: #2779bd;
}`,

  scss: `$primary: #3490dc;

.button {
  background: $primary;
  
  &:hover {
    background: darken($primary, 10%);
  }
}`,

  json: `{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.2"
  }
}`,

  yaml: `name: my-app
version: 1.0.0
services:
  web:
    image: nginx:latest
    ports:
      - "80:80"`,

  xml: `<?xml version="1.0"?>
<note>
  <to>User</to>
  <from>System</from>
  <message>Hello, World!</message>
</note>`,

  markdown: `# Hello World

This is **bold** and this is *italic*.

- Item 1
- Item 2`,

  sql: `SELECT * FROM users
WHERE status = 'active'
ORDER BY created_at DESC;`,

  bash: `#!/bin/bash
echo "Hello, World!"
for i in {1..5}; do
    echo "Count: $i"
done`,

  shell: `#!/bin/sh
name="World"
echo "Hello, $name!"`,

  powershell: `$name = "World"
Write-Host "Hello, $name!"`,

  dockerfile: `FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]`,

  plaintext: `This is plain text.
No syntax highlighting.
Just simple text.`,
};
