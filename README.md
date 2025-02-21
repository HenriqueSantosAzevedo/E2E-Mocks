## Project Description

This CLI application starts an HTTP server that imports files from the current working directory (PWD) and uses them as response templates.

### Features
- **Start Server**: Easily start the server using the CLI.
- **Response Templates**: Import files from the PWD and use them as response templates.
- **Command-Line Options**: Configure server settings via command-line options.

### Technologies Used
- **TypeScript**: For type safety.
- **Bun.js**: As the runtime environment.

### Getting Started
1. **Install Dependencies**: Run `bun install`.
2. **Start the Server**: Use the CLI to start the server:
   ```sh
   bunx https://github.com/HenriqueSantosAzevedo/E2E-Mocks --port 3000
   ```

### CLI Configuration
- **Port Configuration**: Specify the port using the `--port` or `-p` option.

### Example
```sh
bunx https://github.com/HenriqueSantosAzevedo/E2E-Mocks --port 8080
```

This command starts the server on port 8080.