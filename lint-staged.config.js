/* Lint-staged config for client and server workspaces.
 * Ensures commands run in the correct subdirectory and receive file paths relative to that subdirectory.
 */
const path = require('path');

function stripPrefix(prefix, files) {
  const re = new RegExp(`^${prefix}/`);
  return files
    .filter((f) => f.startsWith(`${prefix}/`))
    .map((f) => f.replace(re, ''));
}

module.exports = {
  // Client: TypeScript/TSX and CSS files
  'client/**/*.{ts,tsx,css}': (files) => {
    const clientFiles = stripPrefix('client', files);
    if (clientFiles.length === 0) return [];
    const joined = clientFiles.map((f) => `"${f}"`).join(' ');
    return [
      // Run using client's local binaries
      `cd client && eslint --fix ${joined}`,
      `cd client && prettier --write ${joined}`,
    ];
  },

  // Server: TypeScript files
  'server/**/*.ts': (files) => {
    const serverFiles = stripPrefix('server', files);
    if (serverFiles.length === 0) return [];
    const joined = serverFiles.map((f) => `"${f}"`).join(' ');
    return [
      `cd server && eslint --fix ${joined}`,
      `cd server && prettier --write ${joined}`,
    ];
  },
};
