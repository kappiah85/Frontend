const crypto = require('crypto');

const password = "password123";
const hash = crypto.createHash('sha256').update(password).digest('hex');

console.log('Password:', password);
console.log('Generated hash:', hash);
console.log('Stored hash:   a104f81ece7e2badeccb20b616da001aa2146220c04b346e3ca673f07e832471');
console.log('Match:', hash === 'a104f81ece7e2badeccb20b616da001aa2146220c04b346e3ca673f07e832471'); 