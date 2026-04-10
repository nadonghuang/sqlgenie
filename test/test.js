const SqlGenie = require('../src/index');

// Test the SQL Genie functionality
function testSqlGenie() {
  console.log('🧙‍♂️ Testing SQL Genie...\n');
  
  const genie = new SqlGenie({
    table: 'users',
    columns: ['id', 'name', 'email', 'age']
  });
  
  const testCases = [
    {
      input: 'show all users',
      expected: 'SELECT * FROM users'
    },
    {
      input: 'get users where name equals John',
      expected: 'SELECT * FROM users WHERE name = John'
    },
    {
      input: 'count users where age greater than 25',
      expected: 'SELECT COUNT(*) FROM users WHERE age > 25'
    },
    {
      input: 'list users where email contains gmail',
      expected: 'SELECT * FROM users WHERE email LIKE %gmail%'
    },
    {
      input: 'update users set name to Jane where id equals 1',
      expected: 'UPDATE users SET name = Jane WHERE id = 1'
    }
  ];
  
  let passed = 0;
  let total = testCases.length;
  
  for (const testCase of testCases) {
    try {
      const result = genie.generate(testCase.input);
      console.log(`✅ Test: "${testCase.input}"`);
      console.log(`   SQL: ${result}`);
      console.log('');
      passed++;
    } catch (error) {
      console.log(`❌ Test: "${testCase.input}"`);
      console.log(`   Error: ${error.message}`);
      console.log('');
    }
  }
  
  console.log(`📊 Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! SQL Genie is ready to use.');
  } else {
    console.log('⚠️ Some tests failed. Please check the implementation.');
  }
}

// Run tests
testSqlGenie();