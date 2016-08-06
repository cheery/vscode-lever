# vscode-lever README

This is the official extension for programming in [Lever language](http://leverlanguage.com). 

## Features

It associates '.lc' files to lever and provides syntax coloring for them.

It provides a debug utility to run Lever programs.

## Requirements

User configuration entry "lever.runtime_path" is required, it should point out to the directory where lever's runtime is.

You can obtain yourself a runtime by downloading it from [the website](http://leverlanguage.com/#download).

## Extension Settings

This extension contributes the following settings:

* `lever.runtime_path`: The folder path to the runtime the editor should use.

## Useful tips

You can use `${file}` in the `"program"` -option to have your environment run the currently opened file.

The "lever_path" in its default setting is supplied from the extension's settings. If your project should use some custom runtime, you can write it here.

## Known Issues

It can run them, but it cannot debug lever programs. This appreciated feature will come in the next milestone.

## Release Notes

### 0.0.1

Ridiculously bad release.

### 0.0.2

Humiliatingly bad release.

### 0.0.3

The first almost proper release, for now.

## Github

http://github.com/cheery/vscode-lever