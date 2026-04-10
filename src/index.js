/**
 * SQL Genie - Natural Language to SQL Converter
 * 🧙‍♂️ Convert natural language to SQL queries with simple patterns
 */

class SqlGenie {
  constructor(options = {}) {
    this.table = options.table || 'table_name';
    this.columns = options.columns || [];
    this.templates = {
      select: {
        pattern: /(show|display|list|get|find|select).+(all|records|entries|data|information)/i,
        template: 'SELECT * FROM {{table}} WHERE {{condition}}'
      },
      select_columns: {
        pattern: /(show|display|list|get|find|select).+(column|field|attribute)/i,
        template: 'SELECT {{columns}} FROM {{table}} WHERE {{condition}}'
      },
      filter: {
        pattern: /(where|filter|only|just).+(specific|particular|certain)/i,
        template: 'SELECT * FROM {{table}} WHERE {{condition}}'
      },
      count: {
        pattern: /(count|number of|how many)/i,
        template: 'SELECT COUNT(*) FROM {{table}} WHERE {{condition}}'
      },
      insert: {
        pattern: /(add|insert|create|new|add new)/i,
        template: 'INSERT INTO {{table}} ({{columns}}) VALUES ({{values}})'
      },
      update: {
        pattern: /(update|modify|change|edit)/i,
        template: 'UPDATE {{table}} SET {{set_clause}} WHERE {{condition}}'
      },
      delete: {
        pattern: /(delete|remove|drop)/i,
        template: 'DELETE FROM {{table}} WHERE {{condition}}'
      }
    };
  }

  /**
   * Generate SQL from natural language text
   */
  generate(text) {
    const normalizedText = text.toLowerCase().trim();
    
    // Try to match each template
    for (const [type, template] of Object.entries(this.templates)) {
      if (template.pattern.test(normalizedText)) {
        // For update queries, don't try to extract conditions twice
        if (type === 'update') {
          const cleanText = text.replace(/\s+where\s+.*$/i, '');
          return this.applyTemplate(type, template, cleanText);
        }
        return this.applyTemplate(type, template, text);
      }
    }
    
    // Default fallback for basic queries
    return this.generateBasicQuery(text);
  }

  /**
   * Apply a template and extract parameters from text
   */
  applyTemplate(type, template, originalText) {
    const text = originalText.toLowerCase();
    let sql = template.template;
    
    // Extract table name if specified
    if (sql.includes('{{table}}')) {
      sql = sql.replace('{{table}}', this.extractTableName(text) || this.table);
    }
    
    // Extract conditions
    if (sql.includes('{{condition}}')) {
      const condition = this.extractCondition(text);
      sql = sql.replace('{{condition}}', condition || '1=1');
    }
    
    // Extract columns
    if (sql.includes('{{columns}}')) {
      const columns = this.extractColumns(text);
      sql = sql.replace('{{columns}}', columns || '*');
    }
    
    // Extract SET clause for UPDATE
    if (sql.includes('{{set_clause}}')) {
      const setClause = this.extractSetClause(text);
      sql = sql.replace('{{set_clause}}', setClause || 'column = value');
    }
    
    // Extract VALUES for INSERT
    if (sql.includes('{{values}}')) {
      const values = this.extractValues(text);
      sql = sql.replace('{{values}}', values || "'value1', 'value2'");
    }
    
    return this.formatSql(sql);
  }

  /**
   * Extract table name from text
   */
  extractTableName(text) {
    const commonTables = ['users', 'products', 'orders', 'customers', 'items', 'transactions'];
    for (const table of commonTables) {
      if (text.includes(table)) {
        return table;
      }
    }
    return null;
  }

  /**
   * Extract WHERE condition from text
   */
  extractCondition(text) {
    const patterns = [
      {
        regex: /where\s+(\w+)\s+(equals?|=|is)\s+([\'\"]?[\w\s]+[\'\"]?)/i,
        replacement: '$1 = $3'
      },
      {
        regex: /(\w+)\s+(equals?|=|is)\s+([\'\"]?[\w\s]+[\'\"]?)/i,
        replacement: '$1 = $3'
      },
      {
        regex: /(\w+)\s+(greater than|>)\s+(\d+)/i,
        replacement: '$1 > $3'
      },
      {
        regex: /(\w+)\s+(less than|<)\s+(\d+)/i,
        replacement: '$1 < $3'
      },
      {
        regex: /(\w+)\s+(contains?|has|includes?)\s+([\'\"]?[\w\s]+[\'\"]?)/i,
        replacement: '$1 LIKE %$3%'
      }
    ];
    
    // Remove the word "where" to avoid duplication
    const cleanText = text.replace(/\s+where\s+/gi, ' ');
    
    for (const { regex, replacement } of patterns) {
      const match = cleanText.match(regex);
      if (match) {
        return replacement.replace(/\$(\d+)/g, (_, n) => match[parseInt(n)]);
      }
    }
    
    return null;
  }

  /**
   * Extract column names from text
   */
  extractColumns(text) {
    const columnPatterns = [
      /show\s+(me\s+)?(.+?)(?:\s+where|$)/i,
      /get\s+(me\s+)?(.+?)(?:\s+where|$)/i,
      /list\s+(me\s+)?(.+?)(?:\s+where|$)/i
    ];
    
    for (const pattern of columnPatterns) {
      const match = text.match(pattern);
      if (match && match[2]) {
        const columns = match[2].split(',').map(col => col.trim());
        return columns.map(col => `"${col}"`).join(', ');
      }
    }
    
    return '*';
  }

  /**
   * Extract SET clause for UPDATE
   */
  extractSetClause(text) {
    const patterns = [
      /set\s+(\w+)\s+(to|=)\s+([\'\"]?[\w\s]+[\'\"]?)/i,
      /(\w+)\s+(set|change|update)\s+([\'\"]?[\w\s]+[\'\"]?)/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return `${match[1]} = ${match[3]}`;
      }
    }
    
    return null;
  }

  /**
   * Extract VALUES for INSERT
   */
  extractValues(text) {
    const patterns = [
      /with\s+values\s+(.+?)(?:\s+where|$)/i,
      /values\s+(.+?)(?:\s+where|$)/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const values = match[1].split(',').map(val => val.trim());
        return values.map(val => {
          if (val.startsWith("'") && val.endsWith("'")) {
            return val;
          }
          return `'${val}'`;
        }).join(', ');
      }
    }
    
    return "'value1', 'value2'";
  }

  /**
   * Generate basic query fallback
   */
  generateBasicQuery(text) {
    const textLower = text.toLowerCase();
    
    // Simple patterns without complex condition extraction
    if (textLower.includes('count') || textLower.includes('how many')) {
      return `SELECT COUNT(*) FROM ${this.table}`;
    }
    
    if (textLower.includes('all') || textLower.includes('everything')) {
      return `SELECT * FROM ${this.table}`;
    }
    
    // Default select
    return `SELECT * FROM ${this.table} WHERE 1=1`;
  }

  /**
   * Format SQL for better readability
   */
  formatSql(sql) {
    return sql
      .replace(/\s+WHERE\s+/gi, '\nWHERE ')
      .replace(/\s+FROM\s+/gi, '\nFROM ')
      .replace(/\s+SELECT\s+/gi, '\nSELECT ')
      .replace(/\s+SET\s+/gi, '\nSET ')
      .replace(/\s+VALUES\s+/gi, '\nVALUES ')
      .replace(/\s+,\s+/g, ', ')
      .replace(/\s+;\s*$/, '');
  }

  /**
   * Get available SQL operations
   */
  getOperations() {
    return [
      'SELECT queries - Get data from tables',
      'INSERT statements - Add new records',
      'UPDATE commands - Modify existing data',
      'DELETE operations - Remove records',
      'COUNT functions - Count records',
      'Filter conditions - WHERE clauses'
    ];
  }
}

module.exports = SqlGenie;