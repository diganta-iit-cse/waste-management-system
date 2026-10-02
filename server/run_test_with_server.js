const { spawn } = require('child_process');
const http = require('http');

console.log('🚀 Launching WasteWise Server for automated test suite...');

const serverProcess = spawn('node', ['server.js'], {
  cwd: __dirname,
  stdio: 'pipe',
  shell: true,
});

serverProcess.stdout.on('data', (d) => process.stdout.write(`[SERVER] ${d}`));
serverProcess.stderr.on('data', (d) => process.stderr.write(`[SERVER ERR] ${d}`));

const pollReady = (retries = 25) => {
  return new Promise((resolve, reject) => {
    const check = (attempt) => {
      const req = http.get('http://localhost:5000/api/health', (res) => {
        if (res.statusCode === 200) {
          console.log(' Server is live and healthy on port 5000!');
          resolve();
        } else {
          retry(attempt);
        }
      });
      req.on('error', () => retry(attempt));
    };

    const retry = (attempt) => {
      if (attempt >= retries) {
        reject(new Error('Server failed to start within timeout window'));
      } else {
        setTimeout(() => check(attempt + 1), 1000);
      }
    };

    check(1);
  });
};

async function main() {
  try {
    await pollReady();

    console.log(' Running test_wastewise_e2e.js...');
    const testProcess = spawn('node', ['test_wastewise_e2e.js'], {
      cwd: __dirname,
      stdio: 'inherit',
      shell: true,
    });

    testProcess.on('close', (code) => {
      console.log(` Test process exited with code ${code}`);
      serverProcess.kill();
      process.exit(code);
    });
  } catch (err) {
    console.error('Execution failure:', err);
    serverProcess.kill();
    process.exit(1);
  }
}

main();
