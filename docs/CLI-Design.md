# CLI design

## Global options

1. -v, --version - get cli version
2. -h, --help - get cli help command
3. -V, --valid - check computer os and hardware
4. --verbose - log everything

## Setup

```bash
$ my-settings setup <how> [options]
[interactive prompts...]
```

### How

1. new-mac
2. old-mac

### Options

1. `-I`, `--with-internet` (default) - setup with internet access
2. `-N`, `--without-internet`, `--no-internet` - setup with no internet access
