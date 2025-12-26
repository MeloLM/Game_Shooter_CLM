/**
 * validateArchitecture.js
 * 
 * Script per validare la coerenza del progetto rispetto all'architettura definita.
 * Genera un report in TODO.md con le incongruenze trovate.
 * 
 * Uso: node validateArchitecture.js
 */

const fs = require('fs');
const path = require('path');

// ============================================
// CONFIGURAZIONE ARCHITETTURA ATTESA
// ============================================

const EXPECTED_STRUCTURE = {
  'src/scenes': {
    required: ['Level.js', 'MainMenu.js', 'GameOver.js'],
    optional: ['Boot.js', 'HUD.js', 'TrophyScreen.js', 'Settings.js'],
    pattern: /\.js$/
  },
  'src/entities': {
    required: ['Player.js'],
    optional: ['README.md'],
    pattern: /\.js$/
  },
  'src/entities/enemies': {
    required: ['Goblin.js', 'Slime.js', 'SlimeGreen.js', 'SlimeBlue.js', 'SlimeRed.js', 'Fly.js'],
    optional: ['Enemy.js', 'TankEnemy.js', 'SpeedEnemy.js', 'RangedEnemy.js', 'SkeletonKnight.js'],
    pattern: /\.js$/
  },
  'src/entities/enemies/bosses': {
    required: ['GiantGoblin.js', 'OrcBoss.js'],
    optional: [],
    pattern: /\.js$/
  },
  'src/entities/weapons': {
    required: ['Sword.js', 'Beam.js'],
    optional: ['Boomerang.js', 'Shotgun.js', 'Shield.js', 'Thunder.js'],
    pattern: /\.js$/
  },
  'src/entities/items': {
    required: ['RedBottle.js', 'BlueBottle.js', 'GreenBottle.js'],
    optional: ['Bottle.js', 'YellowBottle.js', 'PurpleBottle.js', 'OrangeBottle.js', 'CyanBottle.js', 'Door.js'],
    pattern: /\.js$/
  },
  'src/entities/effects': {
    required: [],
    optional: ['DeathAnim.js'],
    pattern: /\.js$/
  },
  'src/managers': {
    required: ['WaveManager.js', 'AudioManager.js'],
    optional: ['GameManager.js', 'EventBus.js', 'AchievementSystem.js', 'DifficultyManager.js', 'ComboSystem.js', 'AssetLoader.js', 'CollisionManager.js', 'PauseManager.js'],
    pattern: /\.js$/
  },
  'src/ui': {
    required: [],
    optional: ['Minimap.js', 'MobileControls.js', 'VisualEffects.js', 'HealthBar.js', 'DamageText.js', 'HUDManager.js'],
    pattern: /\.js$/
  },
  'src/utils': {
    required: [],
    optional: ['Constants.js', 'GameConfig.js', 'MathHelpers.js', 'EntityFactories.js'],
    pattern: /\.js$/
  }
};

// Import rules: chi può importare da dove
const IMPORT_RULES = {
  'scenes': ['entities', 'managers', 'ui', 'utils'],
  'entities': ['utils', 'entities/weapons'],
  'managers': ['utils'],
  'ui': ['utils'],
  'utils': []
};

// File che NON dovrebbero esistere nella root di src/
const FORBIDDEN_IN_SRC_ROOT = [
  'WaveManager.js', 'AudioManager.js', 'AchievementSystem.js', 
  'DifficultyManager.js', 'ComboSystem.js', 'Minimap.js',
  'MobileControls.js', 'VisualEffects.js', 'Level.js', 
  'MainMenu.js', 'GameOver.js'
];

// ============================================
// FUNZIONI DI VALIDAZIONE
// ============================================

class ArchitectureValidator {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.issues = [];
    this.warnings = [];
    this.stats = {
      filesChecked: 0,
      foldersChecked: 0,
      issuesFound: 0,
      warningsFound: 0
    };
  }

  // Controlla se un file/cartella esiste
  exists(relativePath) {
    return fs.existsSync(path.join(this.projectRoot, relativePath));
  }

  // Legge il contenuto di una cartella
  readDir(relativePath) {
    const fullPath = path.join(this.projectRoot, relativePath);
    if (!fs.existsSync(fullPath)) return [];
    return fs.readdirSync(fullPath);
  }

  // Legge il contenuto di un file
  readFile(relativePath) {
    const fullPath = path.join(this.projectRoot, relativePath);
    if (!fs.existsSync(fullPath)) return null;
    return fs.readFileSync(fullPath, 'utf8');
  }

  // Aggiunge un issue
  addIssue(category, message, severity = 'error') {
    this.issues.push({ category, message, severity });
    this.stats.issuesFound++;
  }

  // Aggiunge un warning
  addWarning(category, message) {
    this.warnings.push({ category, message });
    this.stats.warningsFound++;
  }

  // ============================================
  // VALIDAZIONE STRUTTURA DIRECTORY
  // ============================================
  
  validateDirectoryStructure() {
    console.log('📁 Validating directory structure...');
    
    for (const [dirPath, config] of Object.entries(EXPECTED_STRUCTURE)) {
      this.stats.foldersChecked++;
      
      // Controlla se la cartella esiste
      if (!this.exists(dirPath)) {
        this.addIssue('STRUCTURE', `Missing directory: ${dirPath}`);
        continue;
      }

      const files = this.readDir(dirPath);
      
      // Controlla file required
      for (const required of config.required) {
        if (!files.includes(required)) {
          this.addIssue('STRUCTURE', `Missing required file: ${dirPath}/${required}`);
        }
      }
      
      // Controlla file sconosciuti (non in required né optional)
      const allKnown = [...config.required, ...config.optional, 'README.md'];
      for (const file of files) {
        this.stats.filesChecked++;
        if (!allKnown.includes(file) && config.pattern.test(file)) {
          // È un file .js non riconosciuto
          if (fs.statSync(path.join(this.projectRoot, dirPath, file)).isFile()) {
            this.addWarning('STRUCTURE', `Unknown file in ${dirPath}: ${file}`);
          }
        }
      }
    }
  }

  // ============================================
  // VALIDAZIONE FILE NELLA ROOT DI SRC
  // ============================================
  
  validateSrcRoot() {
    console.log('🔍 Validating src/ root...');
    
    const srcFiles = this.readDir('src');
    
    for (const file of srcFiles) {
      const fullPath = path.join(this.projectRoot, 'src', file);
      
      // Se è un file (non cartella)
      if (fs.statSync(fullPath).isFile()) {
        if (FORBIDDEN_IN_SRC_ROOT.includes(file)) {
          this.addIssue('STRUCTURE', `File should not be in src/ root: ${file} (should be in appropriate subfolder)`);
        } else if (file.endsWith('.js')) {
          this.addWarning('STRUCTURE', `Unexpected JS file in src/ root: ${file}`);
        }
      }
    }
  }

  // ============================================
  // VALIDAZIONE IMPORTS
  // ============================================
  
  validateImports() {
    console.log('📦 Validating imports...');
    
    const jsFiles = this.getAllJsFiles('src');
    
    for (const filePath of jsFiles) {
      const content = this.readFile(filePath);
      if (!content) continue;
      
      const imports = this.extractImports(content);
      const fileCategory = this.getFileCategory(filePath);
      
      for (const imp of imports) {
        this.validateSingleImport(filePath, imp, fileCategory);
      }
    }
  }

  // Estrae tutti gli import da un file
  extractImports(content) {
    const imports = [];
    const importRegex = /import\s+.*\s+from\s+['"](.*)['"]/g;
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }
    
    return imports;
  }

  // Ottiene la categoria di un file (scenes, entities, etc.)
  getFileCategory(filePath) {
    if (filePath.includes('scenes')) return 'scenes';
    if (filePath.includes('entities')) return 'entities';
    if (filePath.includes('managers')) return 'managers';
    if (filePath.includes('ui')) return 'ui';
    if (filePath.includes('utils')) return 'utils';
    return 'unknown';
  }

  // Valida un singolo import
  validateSingleImport(filePath, importPath, fileCategory) {
    // Ignora import da librerie esterne (phaser, etc.)
    if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
      return;
    }
    
    // Controlla path vecchi che non dovrebbero esistere
    const oldPaths = ['./Scene/', './Enemies/', './Bosses/'];
    for (const oldPath of oldPaths) {
      if (importPath.includes(oldPath)) {
        this.addIssue('IMPORTS', `Old import path in ${filePath}: ${importPath}`);
      }
    }
  }

  // Ottiene tutti i file JS ricorsivamente
  getAllJsFiles(dir) {
    const results = [];
    const fullDir = path.join(this.projectRoot, dir);
    
    if (!fs.existsSync(fullDir)) return results;
    
    const items = fs.readdirSync(fullDir);
    
    for (const item of items) {
      const fullPath = path.join(fullDir, item);
      const relativePath = path.join(dir, item);
      
      if (fs.statSync(fullPath).isDirectory()) {
        results.push(...this.getAllJsFiles(relativePath));
      } else if (item.endsWith('.js')) {
        results.push(relativePath);
      }
    }
    
    return results;
  }

  // ============================================
  // VALIDAZIONE CONTENUTO FILE
  // ============================================
  
  validateFileContent() {
    console.log('📝 Validating file content...');
    
    // Controlla che Level.js non sia troppo grande
    const levelContent = this.readFile('src/scenes/Level.js');
    if (levelContent) {
      const lineCount = levelContent.split('\n').length;
      if (lineCount > 1500) {
        this.addWarning('CONTENT', `Level.js is too large (${lineCount} lines). Target: < 500 lines`);
      } else if (lineCount > 500) {
        this.addWarning('CONTENT', `Level.js could be smaller (${lineCount} lines). Target: < 500 lines`);
      }
    }
    
    // Controlla che main.js usi i path corretti
    const mainContent = this.readFile('main.js');
    if (mainContent) {
      if (mainContent.includes('./src/Level') && !mainContent.includes('./src/scenes/Level')) {
        this.addIssue('IMPORTS', 'main.js uses old import path for Level');
      }
      if (mainContent.includes('./src/MainMenu') && !mainContent.includes('./src/scenes/MainMenu')) {
        this.addIssue('IMPORTS', 'main.js uses old import path for MainMenu');
      }
    }
  }

  // ============================================
  // VALIDAZIONE COERENZA CON ARCHITECTURE.MD
  // ============================================
  
  validateAgainstArchitecture() {
    console.log('📐 Validating against architecture.md...');
    
    // Verifica che le cartelle principali esistano
    const requiredFolders = ['src/scenes', 'src/entities', 'src/managers', 'src/ui', 'src/utils'];
    for (const folder of requiredFolders) {
      if (!this.exists(folder)) {
        this.addIssue('ARCHITECTURE', `Missing required folder from architecture: ${folder}`);
      }
    }
    
    // Verifica sottocartelle entities
    const entitySubfolders = ['enemies', 'weapons', 'items'];
    for (const sub of entitySubfolders) {
      if (!this.exists(`src/entities/${sub}`)) {
        this.addIssue('ARCHITECTURE', `Missing entity subfolder: src/entities/${sub}`);
      }
    }
    
    // Verifica bosses
    if (!this.exists('src/entities/enemies/bosses')) {
      this.addIssue('ARCHITECTURE', 'Missing bosses folder: src/entities/enemies/bosses');
    }
  }

  // ============================================
  // RUN ALL VALIDATIONS
  // ============================================
  
  validate() {
    console.log('\n🚀 Starting Architecture Validation...\n');
    console.log('='.repeat(50));
    
    this.validateDirectoryStructure();
    this.validateSrcRoot();
    this.validateImports();
    this.validateFileContent();
    this.validateAgainstArchitecture();
    
    console.log('='.repeat(50));
    console.log('\n✅ Validation complete!\n');
    
    return {
      issues: this.issues,
      warnings: this.warnings,
      stats: this.stats
    };
  }

  // ============================================
  // GENERATE REPORT
  // ============================================
  
  generateReport() {
    const result = this.validate();
    const timestamp = new Date().toISOString().split('T')[0];
    
    let report = `# 📋 TODO - Architecture Validation Report

> **Generated:** ${timestamp}
> **Status:** ${result.issues.length === 0 ? '✅ All checks passed' : '⚠️ Issues found'}

---

## 📊 Summary

| Metric | Value |
|--------|-------|
| Files Checked | ${result.stats.filesChecked} |
| Folders Checked | ${result.stats.foldersChecked} |
| Issues Found | ${result.stats.issuesFound} |
| Warnings Found | ${result.stats.warningsFound} |

---

`;

    // Issues (errori)
    if (result.issues.length > 0) {
      report += `## ❌ Issues (Must Fix)\n\n`;
      
      const issuesByCategory = this.groupBy(result.issues, 'category');
      
      for (const [category, items] of Object.entries(issuesByCategory)) {
        report += `### ${category}\n\n`;
        for (const item of items) {
          report += `- [ ] ${item.message}\n`;
        }
        report += '\n';
      }
    } else {
      report += `## ✅ No Issues Found\n\nArchitecture is coherent!\n\n`;
    }

    // Warnings
    if (result.warnings.length > 0) {
      report += `## ⚠️ Warnings (Should Review)\n\n`;
      
      const warningsByCategory = this.groupBy(result.warnings, 'category');
      
      for (const [category, items] of Object.entries(warningsByCategory)) {
        report += `### ${category}\n\n`;
        for (const item of items) {
          report += `- [ ] ${item.message}\n`;
        }
        report += '\n';
      }
    }

    // Next steps
    report += `---

## 🎯 Next Steps

`;
    
    if (result.issues.length > 0) {
      report += `1. Fix all issues marked with ❌
2. Review warnings marked with ⚠️
3. Run validation again: \`node validateArchitecture.js\`
`;
    } else if (result.warnings.length > 0) {
      report += `1. Review warnings marked with ⚠️
2. Consider refactoring suggestions
3. Architecture is functional but could be improved
`;
    } else {
      report += `1. ✅ Architecture is clean!
2. Continue development following the patterns
3. Run validation periodically to maintain quality
`;
    }

    report += `
---

## 📁 Current Structure

\`\`\`
src/
├── scenes/         ✅
├── entities/
│   ├── enemies/    ✅
│   │   └── bosses/ ✅
│   ├── weapons/    ✅
│   ├── items/      ✅
│   └── effects/    ✅
├── managers/       ✅
├── ui/             ✅
└── utils/          ✅
\`\`\`

---

*Report generated by validateArchitecture.js*
`;

    return report;
  }

  // Helper: raggruppa per chiave
  groupBy(array, key) {
    return array.reduce((result, item) => {
      const group = item[key];
      if (!result[group]) result[group] = [];
      result[group].push(item);
      return result;
    }, {});
  }

  // Salva il report su file
  saveReport(filename = 'TODO.md') {
    const report = this.generateReport();
    const fullPath = path.join(this.projectRoot, filename);
    fs.writeFileSync(fullPath, report, 'utf8');
    console.log(`📄 Report saved to: ${filename}`);
    return report;
  }
}

// ============================================
// MAIN EXECUTION
// ============================================

function main() {
  // Determina la root del progetto
  const projectRoot = process.cwd();
  
  console.log(`\n🎮 KNIGHT SHOOTER - Architecture Validator`);
  console.log(`📂 Project root: ${projectRoot}\n`);
  
  const validator = new ArchitectureValidator(projectRoot);
  validator.saveReport('TODO.md');
  
  // Stampa summary
  const stats = validator.stats;
  console.log(`\n📊 Final Stats:`);
  console.log(`   Files: ${stats.filesChecked}`);
  console.log(`   Folders: ${stats.foldersChecked}`);
  console.log(`   Issues: ${stats.issuesFound}`);
  console.log(`   Warnings: ${stats.warningsFound}`);
  
  if (stats.issuesFound > 0) {
    console.log(`\n⚠️  Found ${stats.issuesFound} issues. Check TODO.md for details.`);
    process.exit(1);
  } else {
    console.log(`\n✅ Architecture validation passed!`);
    process.exit(0);
  }
}

// Esegui se chiamato direttamente
if (require.main === module) {
  main();
}

module.exports = { ArchitectureValidator };
