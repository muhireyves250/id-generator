const { spawn } = require('child_process');
const path = require('path');

// 1. Start backend server
const server = spawn('npm', ['run', 'server'], { shell: true, stdio: 'inherit', cwd: __dirname });

// 2. Start frontend dev server
const client = spawn('npm', ['run', 'client'], { shell: true, stdio: 'inherit', cwd: __dirname });

// 3. Start new backend server
const backend = spawn('npm', ['run', 'dev'], { shell: true, stdio: 'inherit', cwd: path.join(__dirname, 'backend') });

const cleanup = () => {
    server.kill();
    client.kill();
    backend.kill();
    process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
