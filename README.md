# Salvare (sav)

Salvare is an experimental Version Control System (VCS) built entirely using native JavaScript and running on Node.js. Designed for personal use, portfolio demonstration, and seamless execution in both Linux and Termux environments.

## Features

- **`init`**: Initialize a new Salvare repository (`.sav_data`).
- **`add`**: Stage files into the local index (supports individual files or all to track everything at once).
- **`backup`**: Create a compressed (`.gz`) snapshot of your files with safe SHA-256 hex hashing.
- **`list`**: View a list of available backups.
- **`logs`**: Check the history of recorded actions.
- **`restore`**: Decompress and restore files from a specific backup.
- **`status`**: Check for untracked files in the working directory.

## Installation

You can easily install Salvare locally using the provided installation script. It automatically checks for Node.js and sets up the `sav` command globally.

1. Clone or download this repository.
2. Run the installation script:
   ```bash
   chmod +x install.sh
   ./install.sh
   ```

## Usage
once installed, you can use the sav command from anywhere :
sav -v
sav help
sav mdir
sav status
sav add <filename> / sav add all
sav backup <backup_name>
sav restore <backup_name>

## License
MIT License