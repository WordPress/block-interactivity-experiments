const fs = require('fs');
const archiver = require('archiver');

// Create a new zip file
const output = fs.createWriteStream('block-interactivity-experiments.zip');
const archive = archiver('zip', { zlib: { level: 9 } });

// Add files and directories to the zip file
archive.directory('src/', 'src');
archive.directory('build/', 'build');
archive.file('Readme.md', { name: 'Readme.md' });
archive.file('wp-directives.php', { name: 'wp-directives.php' });

// Finalize the zip file
archive.pipe(output);
archive.finalize();
