# Brica NPM File Manipulation Help Tools

This library can be used to manipulate files and folders as a part of a build process, for instance. Using a single or multiple configuration files it is possible to define and later run different targets. Each target can have multiple actions. The actions can:

- delete files
- delete folders
- delete files in a folder using include and/or exclude filters
- Copy files
- Copy folders
- Copy files using include and/or exclude filters
- Join/concatenate files
- Rename file
- Make folders
- Search and replace strings in file with a string or values read from a json file

The features are targeting the most used UNIX file commands [mkdir](#action-mkdir), [rm](#action-rm), [cp](#action-cp), [sed](#action-sed), [rename](#action-rename) etc. with few
changes and/or additions.

## Install

```
npm install @pureit/brica --save-dev
```

## Usage
The tool can be started or used in package.json scripts using:
```
brica target_one [config_file]
```
You can replace target_one with any of the configured targets. If config_file path is not specified the
```
.brica.json
```
in the root of the project is assumed.

Programmatically it can be used with the static execute function:
```
import { Executer } from '@pureit/brica';
Executer.execute('target_one, 'path_to_config');
``` 

```
var Executer = require("@pureit/brica").Executer;
Executer.execute('target_one, 'path_to_config');
```

## Configure
The easiest configuration is with an assumed file in the root of the project.
```
.brica.json
```
Exemple configuration files could be found in the node_modules/@pureit/brica/examples.

The configuration file should start with the proper schema so that your editor can offer help while editing the configuration.
```
{
    "$schema": "./node_modules/@pureit/brica/brica.schema.json"
    "target_one: {
        ...
    },
    "target_two": {
        ...
    }
    ...
}
```
You can create multiple configuration files as well. In that case you will need to supply both target and config file in the call.

## Target
Each target groups a number of actions and defines the target usage.
```
{
    "$schema": "./node_modules/@pureit/brica/brica.schema.json"
    ...
    "build_step": {
            "title": "Build step",
            "description": "Step during build",
            "flags": [
                "title",
                "description"
            ],
            "actions": [
                ...
            ]
    }
    ...
}
```
- title defines the target usage
- description describes the ditails about the target
- flags can be used to display title and/or description in the console at the moment of the execution
- actions* are mandatory and define which actions should be executed when the target is ran

## Action
Each action can have, in addition to specific ones needed for the execution, one of the following properties:
```
{
    "$schema": "./node_modules/@pureit/brica/brica.schema.json"
    ...
    "build_step": {
            "title": "Build step",
            "description": "Step during build",
            "flags": [
                "title",
                "description"
            ],
            "actions": [
                ...
                {
                    "action": "mkdir"
                    "title": "Create dist folder",
                    "flags": ["title"],
                    ...
                }
                ...
            ]
    }
    ...
}
```
- action* property is mandatory and specifies which action to perform
- title defines the action title and can be used for readability or to print in the console during execution
- flags defines additional behaviour and if it contains 'title' and title property is defined for this action then it will be printed during execution

### Action mkdir
This action is used to create a folder. The action will attempt to create the full folder path.
```
{
    "$schema": "./node_modules/@pureit/brica/brica.schema.json"
    ...
    "build_step": {
            "title": "Build step",
            "description": "Step during build",
            "flags": [
                "title",
                "description"
            ],
            "actions": [
                ...
                {
                    "action": "mkdir",
                    "title": "Create dist folder",
                    "flags": ["title"],
                    "target": "./dist"
                }
                ...
            ]
    }
    ...
}
```
- action is mkdir
- target specifies the folder to create

### Action rm
This action is used to delete files and or folder.
```
{
    "$schema": "./node_modules/@pureit/brica/brica.schema.json"
    ...
    "build_step": {
            "title": "Build step",
            "description": "Step during build",
            "flags": [
                "title",
                "description"
            ],
            "actions": [
                ...
                {
                    "action": "rm",
                    "title": "Remove LICENSE and unused d.ts files",
                    "target": "./dist/",
                    "exclude": [
                        { "name": "brica\\.d\\.ts", "flags": "i", "dir": false }
                    ],
                    "include": [
                        { "name": ".*\\.d\\.ts", "flags": "i", "dir": false },
                        { "name": "license", "flags": "i", "dir": false }
                    ]
                }
                ...
            ]
    }
    ...
}
```
- action is rm
- target is the target to delete if it does not include trailing folder separator then the target itself will be also deleted if empty
- exclude if exists defines which files will be skipped (matched via file full path and name regular expression with flags and via optional dir property which represents file or folder)
- include if exists defines which files to include but only if they do not match exclude (matched via file full path and name regular expression with flags and via optional dir property which represents file or folder)

### Action cp
This action can be used to copy files or folders and to join/concatenate multiple files into a single file.
```
{
    "$schema": "./node_modules/@pureit/brica/brica.schema.json"
    ...
    "build_step": {
            "title": "Build step",
            "description": "Step during build",
            "flags": [
                "title",
                "description"
            ],
            "actions": [
                ...
                {
                    "action": "cp",
                    "title": "Copy licenses",
                    "flags": ["title"],
                    "target": "./dist/LICENSE",
                    "source": "./licenses/",
                    "exclude": [
                        { "name": "readme", "flags": "i", "dir": false }
                    ],
                    "include": [
                        { "name": "license", "flags": "i", "dir": false }
                    ],
                    "join": true
                }
                ...
            ]
    }
    ...
}
```
- action is cp
- target represents destination folder or file in case join is enabled
- source represents source files (if the directory separator is at the end then everything inside the folder will be copied rarther then the folder itself)
- exclude if exists defines which files will be skipped (matched via file full path and name regular expression with flags and via optional dir property which represents file or folder)
- include if exists defines which files to include but only if they do not match exclude (matched via file full path and name regular expression with flags and via optional dir property which represents file or folder)
- join if enabled will join the files into a single file named with target property

### Action sed
This action can be used to search and replace text in a target file using regular expressions.
```
{
    "$schema": "./node_modules/@pureit/brica/brica.schema.json"
    ...
    "build_step": {
            "title": "Build step",
            "description": "Step during build",
            "flags": [
                "title",
                "description"
            ],
            "actions": [
                ...
                {
                    "action": "sed",
                    "title": "Update package.json scripts and dependencies",
                    "flags": ["title"],
                    "target": "./dist/package.json",
                    "replace": [
                        { "find": "\"scripts\"[^{]*{[^}]*}", "flags": "", "replace": "\"scripts\": {}" },
                        { "find": "\"devDependencies\"[^{]*{[^}]*}", "flags": "", "replace": "\"devDependencies\": {}"}
                    ]
                },
                {
                    "action": "sed",
                    "title": "Update LICENSE with version",
                    "flags": ["title"],
                    "target": "./dist/LICENSE",
                    "replace": [
                        { "find": "#version#", "flags": "g", "json": "./dist/package.json", "property": ["version"] }
                    ]
                }
                ...
            ]
    }
    ...
}
```
- action is sed
- target is the file to change
- replace defines multiple find and replace options using regular expression find and flags
- json JSON file to load for the replacement values if property parm is also defined
- property Property path in json for the value to use to replace the found match if json param is also defined

### Action rename
This action can be used to rename a file.
```
{
    "$schema": "./node_modules/@pureit/brica/brica.schema.json"
    ...
    "build_step": {
            "title": "Build step",
            "description": "Step during build",
            "flags": [
                "title",
                "description"
            ],
            "actions": [
                ...
                {
                    "action": "rename",
                    "title": "Rename licenses.txt to LICENSE",
                    "flags": ["title"],
                    "target": "./dist/LICENSE",
                    "source": "./dist/licenses.txt"
                }
                ...
            ]
    }
    ...
}
```
- action is rename
- target is the new file name
- source is the existing file to rename
