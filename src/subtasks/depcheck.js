const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

module.exports = (logger, dir) => new Promise((resolve, reject) => {
  let success = true;
  if (success && fs.existsSync(path.join(dir, 'package-lock.json'))) {
    const data = childProcess
      .spawnSync('npm', ['ls', '--depth=0', '--parsable', '--json', '--no-update-notifier'], { cwd: dir });
    const [stdout, stderr] = [String(data.stdout), String(data.stderr)];
    success = stderr === '' && (stdout.problems || []).length === 0;
    if (!success) {
      logger.error(stdout);
      logger.error(stderr);
    }
  }
  if (success && fs.existsSync(path.join(dir, 'yarn.lock'))) {
    const data = childProcess
      .spawnSync('yarn', ['install', '--frozen-lockfile', '--silent', '--non-interactive'], { cwd: dir });
    const [stdout, stderr] = [String(data.stdout), String(data.stderr)];
    success = ['', 'null'].includes(stderr);
    if (!success) {
      logger.error(stdout);
      logger.error(stderr);
    }
  }
  return success ? resolve() : reject();
});
