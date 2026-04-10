<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License"/>
  <img src="https://img.shields.io/badge/Zero_Deps-✅-success?style=for-the-badge" alt="Zero Deps"/>
  <img src="https://img.shields.io/badge/SQL-4479A1?style=for-the-badge&logo=postgresql&logoColor=white" alt="SQL"/>
</p>

<h1 align="center">🧙‍♂️ SQL Genie</h1>

<p align="center">
  <strong>Convert natural language to SQL queries - no SQL knowledge required!</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-installation">Install</a> •
  <a href="#-usage">Usage</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-license">License</a>
</p>

---

## ✨ Features

- 🚀 **Natural Language Processing** - Convert simple English queries to SQL
- 🎯 **Zero SQL Knowledge Required** - Works even if you don't know SQL syntax
- 📊 **Multiple Query Types** - SELECT, INSERT, UPDATE, DELETE, COUNT
- 🔍 **Smart Condition Extraction** - Automatically translates filters and conditions
- 💬 **Interactive Mode** - Chat-like interface for continuous querying
- ⚡ **Lightning Fast** - No external dependencies, pure JavaScript
- 🎨 **Beautiful CLI** - Clean, colorful terminal output
- 📝 **Comprehensive Examples** - Works with real-world use cases

## 📦 Installation

```bash
npm install -g sqlgenie
```

Or use npx without installation:
```bash
npx sqlgenie
```

## 🚀 Usage

### Basic Query Generation

```bash
# Generate SELECT queries
sqlgenie query "show all users"
sqlgenie query "get users where name equals John"
sqlgenie query "count users where age greater than 25"

# Generate INSERT queries
sqlgenie query "add new user with name Alice and email alice@example.com"

# Generate UPDATE queries
sqlgenie query "update users set name to Bob where id equals 1"

# Generate DELETE queries
sqlgenie query "delete users where email contains old"
```

### Advanced Usage with Options

```bash
# Specify target table
sqlgenie query "show all products" --table products

# Specify available columns
sqlgenie query "get names and emails" --columns "name,email,phone"

# Save SQL to file
sqlgenie query "count active users" --output query.sql
```

### Interactive Mode

```bash
sqlgenie interactive
```

This opens a chat-like interface where you can:
- Type natural language queries one by one
- Get instant SQL generation
- Exit by typing "exit" or "quit"

### Piping from Standard Input

```bash
echo "list all users where age > 25" | sqlgenie query
cat queries.txt | sqlgenie query
```

## 📁 Project Structure

```
sqlgenie/
├── src/                 # Core source code
│   └── index.js        # Main SqlGenie class
├── bin/                # CLI entry point
│   └── cli.js          # Command-line interface
├── test/               # Test files
│   └── test.js         # Test suite
├── examples/           # Usage examples
├── README.md           # This file
├── LICENSE             # MIT License
├── package.json        # Project configuration
└── .gitignore          # Git ignore rules
```

## 💡 Supported Query Patterns

### SELECT Operations
- `"show all users"` → `SELECT * FROM users`
- `"get users where name equals John"` → `SELECT * FROM users WHERE name = 'John'`
- `"list customers where email contains gmail"` → `SELECT * FROM customers WHERE email LIKE '%gmail%'`

### Aggregations
- `"count users where age > 25"` → `SELECT COUNT(*) FROM users WHERE age > 25`
- `"how many orders this month"` → `SELECT COUNT(*) FROM orders WHERE created > '2024-01-01'`

### INSERT Operations
- `"add new user with name Alice"` → `INSERT INTO users (name) VALUES ('Alice')`
- `"create product with name laptop and price 999"` → `INSERT INTO products (name, price) VALUES ('laptop', 999)`

### UPDATE Operations
- `"update users set name to Bob where id equals 1"` → `UPDATE users SET name = 'Bob' WHERE id = 1`
- `"modify email to new@example.com where user_id = 5"` → `UPDATE users SET email = 'new@example.com' WHERE user_id = 5`

### DELETE Operations
- `"delete users where email contains old"` → `DELETE FROM users WHERE email LIKE '%old%'`
- `"remove inactive users last_login > 30 days ago"` → `DELETE FROM users WHERE last_login > '2024-01-01'`

## 🔧 Technical Details

### How It Works

SqlGenie uses pattern matching and natural language processing to:
1. **Identify Query Type** - Detects SELECT, INSERT, UPDATE, DELETE, COUNT
2. **Extract Entities** - Finds table names, column names, values, and conditions
3. **Build SQL Template** - Applies the appropriate SQL structure
4. **Format Output** - Clean, readable SQL formatting

### Supported Condition Types

- **Equality**: `equals`, `is`, `=`
- **Comparison**: `greater than`, `less than`, `>`, `<`
- **String Matching**: `contains`, `has`, `includes`, `LIKE`
- **Numeric Ranges**: `between`, `in`
- **Boolean Logic**: `and`, `or`, `not`

### Configuration Options

| Option | Description | Example |
|--------|------------|---------|
| `--table` | Specify target table | `--table users` |
| `--columns` | Available columns | `--columns "name,email,age"` |
| `--output` | Save to file | `--output query.sql` |

## 🧪 Examples

### Example 1: User Management
```bash
sqlgenie query "show all active users where last_login > 2024-01-01"
```
```sql
SELECT *
FROM users
WHERE last_login > '2024-01-01'
```

### Example 2: E-commerce Analytics
```bash
sqlgenie query "count products where category electronics and price > 500"
```
```sql
SELECT COUNT(*)
FROM products
WHERE category = 'electronics' AND price > 500
```

### Example 3: Data Cleanup
```bash
sqlgenie query "delete users where email contains temp or created < 2020-01-01"
```
```sql
DELETE FROM users
WHERE email LIKE '%temp%' OR created < '2020-01-01'
```

## 🎯 Use Cases

### For Developers
- **Quick Prototyping** - Generate SQL without writing syntax
- **Database Exploration** - Explore unfamiliar databases naturally
- **Learning SQL** - See SQL generated from plain English
- **Code Review** - Convert requirements to SQL for validation

### For Teams
- **Non-Technical Users** - Allow team members to query databases
- **Documentation** - Create SQL from user stories
- **Onboarding** - Help new developers understand database structure
- **Rapid Testing** - Generate test queries quickly

## 🚀 Roadmap

- [ ] Support for JOIN operations
- [ ] Advanced pattern matching with ML
- [ ] Multiple database dialects (PostgreSQL, MySQL, SQLite)
- [ ] Web interface
- [ ] IDE plugin integration
- [ ] Real-time database connection

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and add tests
4. Run tests: `npm test`
5. Submit a pull request

### Development Setup

```bash
git clone https://github.com/nadonghuang/sqlgenie.git
cd sqlgenie
npm install
npm test
```

## 🐛 Issues & Questions

Found a bug or have a question? Please [open an issue](https://github.com/nadonghuang/sqlgenie/issues) on GitHub.

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

---

<p align="center">
  Made with ⚡ by <a href="https://github.com/nadonghuang">nadonghuang</a>
  <br/>
  <sub>If you find this useful, please give it a ⭐!</sub>
</p>