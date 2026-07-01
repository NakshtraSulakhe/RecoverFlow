const bcrypt = require('bcrypt');

async function generatePasswords() {
  const password = 'password123';
  const hash = await bcrypt.hash(password, 10);
  
  console.log('Password:', password);
  console.log('Bcrypt Hash:', hash);
  console.log('\nCopy this hash into the seed.sql file for the password_hash field');
}

generatePasswords().catch(console.error);
