#!/usr/bin/env node

const { program } = require('commander');
const SqlGenie = require('../src/index');
const fs = require('fs');
const path = require('path');

program
  .name('sqlgenie')
  .description('🧙‍♂️ Convert natural language to SQL queries')
  .version('1.0.0');

program
  .command('query')
  .description('Convert natural language to SQL')
  .argument('<text>', 'Natural language query')
  .option('-t, --table <name>', 'Target table name', 'users')
  .option('-c, --columns <cols>', 'Comma-separated list of available columns')
  .option('-o, --output <file>', 'Output SQL to file')
  .action((text, options) => {
    try {
      const genie = new SqlGenie({
        table: options.table,
        columns: options.columns ? options.columns.split(',') : []
      });
      
      const sql = genie.generate(text);
      console.log('🧙‍♂️ Generated SQL:');
      console.log(sql);
      
      if (options.output) {
        fs.writeFileSync(options.output, sql);
        console.log(`💾 SQL saved to: ${options.output}`);
      }
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  });

program
  .command('interactive')
  .description('Start interactive SQL generation mode')
  .action(() => {
    console.log('🧙‍♂️ Interactive SQL Generation Mode');
    console.log('Type your natural language queries (Ctrl+C to exit)\n');
    
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const genie = new SqlGenie();
    
    const askQuestion = () => {
      rl.question('💭 Your query: ', (input) => {
        if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
          rl.close();
          return;
        }
        
        try {
          const sql = genie.generate(input);
          console.log('\n🧙‍♂️ Generated SQL:');
          console.log(sql);
          console.log('');
        } catch (error) {
          console.error('❌ Error:', error.message);
          console.log('');
        }
        
        askQuestion();
      });
    };
    
    askQuestion();
  });

program.parse();