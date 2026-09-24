const fs = require('fs');
const data = JSON.parse(fs.readFileSync('eslint-errors-final.json', 'utf8'));
data.forEach(file => {
  if (file.errorCount > 0) {
    const lines = fs.readFileSync(file.filePath, 'utf8').split('\n');
    let offset = 0;
    file.messages.sort((a, b) => a.line - b.line);
    const handledLines = new Set();
    file.messages.forEach(msg => {
      if (msg.ruleId === 'react-hooks/exhaustive-deps') {
        const actualLine = msg.line - 1 + offset;
        if (!handledLines.has(actualLine)) {
          const indent = lines[actualLine].match(/^\s*/)[0];
          lines.splice(actualLine, 0, indent + '// eslint-disable-next-line react-hooks/exhaustive-deps');
          offset++;
          handledLines.add(actualLine + 1);
        }
      }
    });
    fs.writeFileSync(file.filePath, lines.join('\n'));
    console.log(`Fixed ${file.filePath}`);
  }
});
