/**
 * Advanced Google Hacking Research Project
 * Dork Security Lab - Interactive Tool
 * VSB-TU Ostrava - 2025
 */

// ========== Dorks Database ==========
const dorksDatabase = [
    {
        id: 1,
        title: "MySQL Database Dumps",
        category: "database",
        dork: 'filetype:sql "INSERT INTO" "password"',
        description: "Finds exposed SQL database dump files containing user tables with password fields.",
        risk: { score: 3.95, level: "critical" },
        findings: [
            "Complete database backups with user credentials",
            "Password hashes (often MD5 or plaintext)",
            "Email addresses and personal information",
            "Approximately 45,000 potential results globally"
        ],
        recommendations: [
            "Immediately remove all SQL files from web-accessible directories",
            "Implement authentication for backup storage locations",
            "Use robots.txt to disallow indexing of backup paths",
            "Rotate all exposed credentials immediately",
            "Implement database encryption at rest"
        ],
        sampleResults: [
            {
                url: "example-site.com/backups/database_2024.sql",
                title: "Database Backup - SQL Dump",
                snippet: "INSERT INTO `users` VALUES (1,'admin','5f4dcc3b5aa765d...')"
            },
            {
                url: "old-server.net/sql/users_backup.sql",
                title: "User Database Export",
                snippet: "CREATE TABLE `users` (`username` varchar(50), `password`..."
            }
        ]
    },
    {
        id: 2,
        title: "PostgreSQL Backups",
        category: "database",
        dork: 'filetype:sql "PostgreSQL database dump"',
        description: "Locates PostgreSQL database backup files that may contain sensitive data.",
        risk: { score: 3.65, level: "critical" },
        findings: [
            "PostgreSQL database structures and data",
            "Table schemas and relationships",
            "Potential credentials and API keys",
            "Approximately 12,000 results"
        ],
        recommendations: [
            "Store backups outside document root",
            "Encrypt backup files",
            "Implement access controls",
            "Monitor for indexed backup files"
        ],
        sampleResults: [
            {
                url: "backup.company.com/dumps/prod_db.sql",
                title: "Production Database Backup",
                snippet: "-- PostgreSQL database dump -- Database: production..."
            }
        ]
    },
    {
        id: 3,
        title: "MongoDB Exposed Dumps",
        category: "database",
        dork: 'filetype:json "db.collection" "password"',
        description: "Finds MongoDB JSON exports containing user data and credentials.",
        risk: { score: 3.55, level: "critical" },
        findings: [
            "NoSQL database exports",
            "User collections with authentication data",
            "Application configuration data",
            "~8,500 results worldwide"
        ],
        recommendations: [
            "Never expose JSON database dumps publicly",
            "Use authentication for admin interfaces",
            "Implement proper CORS policies"
        ],
        sampleResults: []
    },
    {
        id: 4,
        title: "Environment Configuration Files",
        category: "credentials",
        dork: 'filetype:env "DB_PASSWORD"',
        description: "Discovers .env files containing database credentials, API keys, and secrets.",
        risk: { score: 3.85, level: "critical" },
        findings: [
            "Database connection strings with credentials",
            "API keys and secret tokens",
            "Third-party service credentials",
            "Approximately 18,500 exposed files"
        ],
        recommendations: [
            "Never commit .env files to version control",
            "Add .env to .gitignore immediately",
            "Use environment variable management systems",
            "Rotate all exposed credentials",
            "Implement secrets scanning in CI/CD"
        ],
        sampleResults: [
            {
                url: "dev-server.example.com/.env",
                title: ".env - Environment Configuration",
                snippet: "DB_HOST=127.0.0.1 DB_PASSWORD=P@ssw0rd123 API_KEY=sk_live..."
            },
            {
                url: "api.startup.io/.env.backup",
                title: ".env.backup",
                snippet: "AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE..."
            }
        ]
    },
    {
        id: 5,
        title: "API Keys and Tokens",
        category: "credentials",
        dork: '"api_key" OR "apikey" filetype:json',
        description: "Searches for JSON files containing exposed API keys and authentication tokens.",
        risk: { score: 3.45, level: "high" },
        findings: [
            "Third-party API keys (AWS, Stripe, Google, etc.)",
            "JWT secrets and tokens",
            "OAuth credentials",
            "~25,000 results"
        ],
        recommendations: [
            "Use secrets management systems (Vault, AWS Secrets Manager)",
            "Implement API key rotation policies",
            "Never hardcode credentials in config files",
            "Use environment variables for sensitive data"
        ],
        sampleResults: []
    },
    {
        id: 6,
        title: "Apache/Nginx Config Files",
        category: "config",
        dork: 'ext:conf OR ext:cnf intext:"password"',
        description: "Finds web server configuration files that may contain credentials or sensitive paths.",
        risk: { score: 2.95, level: "medium" },
        findings: [
            "Server configuration details",
            "Basic auth credentials",
            "SSL certificate paths",
            "Internal network information"
        ],
        recommendations: [
            "Protect configuration files with proper permissions",
            "Never expose config files via web server",
            "Use .htaccess to deny access to .conf files"
        ],
        sampleResults: []
    },
    {
        id: 7,
        title: "PHP Configuration Disclosure",
        category: "config",
        dork: 'intitle:"phpinfo()" "PHP Version"',
        description: "Identifies exposed phpinfo() pages revealing server configuration details.",
        risk: { score: 2.65, level: "medium" },
        findings: [
            "PHP version and modules",
            "Server paths and configuration",
            "Environment variables",
            "~52,000 exposed pages"
        ],
        recommendations: [
            "Remove all phpinfo() files from production",
            "Disable phpinfo() in production environments",
            "Restrict access to diagnostic pages"
        ],
        sampleResults: [
            {
                url: "test-server.com/info.php",
                title: "PHP Version 7.4.3 - phpinfo()",
                snippet: "PHP Version 7.4.3 System: Linux server 4.15.0..."
            }
        ]
    },
    {
        id: 8,
        title: "Admin Login Panels",
        category: "admin",
        dork: 'inurl:admin intitle:login filetype:php',
        description: "Enumerates administrative login pages for potential brute force attacks.",
        risk: { score: 3.25, level: "high" },
        findings: [
            "Administrative authentication endpoints",
            "CMS admin panels",
            "Custom admin interfaces",
            "~892,000 results globally"
        ],
        recommendations: [
            "Implement multi-factor authentication",
            "Use IP whitelisting for admin access",
            "Implement rate limiting on login endpoints",
            "Rename default admin URLs",
            "Monitor for brute force attempts"
        ],
        sampleResults: [
            {
                url: "company-site.com/admin/login.php",
                title: "Administrator Login Panel",
                snippet: "Please enter your administrator credentials to access..."
            }
        ]
    },
    {
        id: 9,
        title: "WordPress Admin Access",
        category: "admin",
        dork: 'inurl:wp-login.php OR inurl:wp-admin',
        description: "Locates WordPress admin login pages across the internet.",
        risk: { score: 2.85, level: "medium" },
        findings: [
            "WordPress installations",
            "Admin login pages",
            "Potential for brute force attacks",
            "Millions of results"
        ],
        recommendations: [
            "Use strong passwords and 2FA",
            "Limit login attempts with plugins",
            "Hide admin URL with security plugins",
            "Keep WordPress updated"
        ],
        sampleResults: []
    },
    {
        id: 10,
        title: "Directory Listings",
        category: "directory",
        dork: 'intitle:"Index of /" "Parent Directory"',
        description: "Finds web servers with directory listing enabled, exposing file structure.",
        risk: { score: 2.50, level: "low" },
        findings: [
            "Server file and directory structure",
            "Exposed backup files",
            "Source code files",
            "Over 1 million results"
        ],
        recommendations: [
            "Disable directory listing in web server config",
            "Apache: Add 'Options -Indexes' to .htaccess",
            "Nginx: Set 'autoindex off' in configuration",
            "Implement authentication for sensitive directories"
        ],
        sampleResults: [
            {
                url: "unsecured-server.com/uploads/",
                title: "Index of /uploads",
                snippet: "[Parent Directory] - documents/ - backups/ - config.php"
            }
        ]
    },
    {
        id: 11,
        title: "Git Repository Exposure",
        category: "directory",
        dork: 'inurl:"/.git" intitle:"Index of"',
        description: "Discovers exposed .git directories containing complete source code history.",
        risk: { score: 3.85, level: "critical" },
        findings: [
            "Complete Git repository with history",
            "Source code and commit messages",
            "Developer names and emails",
            "Potentially hardcoded secrets in history",
            "~7,200 exposed repositories"
        ],
        recommendations: [
            "Never deploy .git directories to production",
            "Add .git to web server deny rules",
            "Use .gitignore for sensitive files",
            "Scan repositories for secrets before deployment"
        ],
        sampleResults: [
            {
                url: "website.com/.git/",
                title: "Index of /.git",
                snippet: "[Parent Directory] - config - HEAD - objects/ - refs/"
            }
        ]
    },
    {
        id: 12,
        title: "Log Files with Credentials",
        category: "credentials",
        dork: 'filetype:log intext:"password" OR intext:"username"',
        description: "Searches for log files that may contain leaked credentials or error messages.",
        risk: { score: 3.15, level: "high" },
        findings: [
            "Application error logs",
            "Debug output with credentials",
            "Authentication failure logs",
            "~35,000 results"
        ],
        recommendations: [
            "Never log sensitive information",
            "Implement log sanitization",
            "Restrict access to log directories",
            "Rotate and delete old logs"
        ],
        sampleResults: []
    },
    {
        id: 13,
        title: "SSH Private Keys",
        category: "credentials",
        dork: 'filetype:pem "PRIVATE KEY"',
        description: "Finds exposed SSH private key files that can grant server access.",
        risk: { score: 3.95, level: "critical" },
        findings: [
            "RSA/DSA private keys",
            "SSH authentication credentials",
            "Server access tokens",
            "~3,200 exposed keys"
        ],
        recommendations: [
            "Never expose private keys publicly",
            "Use SSH key passphrase protection",
            "Rotate exposed keys immediately",
            "Implement certificate-based auth"
        ],
        sampleResults: []
    },
    {
        id: 14,
        title: "Oracle Database Backups",
        category: "database",
        dork: 'filetype:dmp intext:"oracle"',
        description: "Locates Oracle database dump files containing enterprise data.",
        risk: { score: 3.70, level: "critical" },
        findings: [
            "Oracle database exports",
            "Enterprise data structures",
            "Business-critical information",
            "~2,800 results"
        ],
        recommendations: [
            "Encrypt database backups",
            "Store backups in secure locations",
            "Implement access controls",
            "Monitor backup access logs"
        ],
        sampleResults: []
    },
    {
        id: 15,
        title: "Joomla Admin Panels",
        category: "admin",
        dork: 'inurl:"/administrator" "Joomla"',
        description: "Identifies Joomla CMS administrative login interfaces.",
        risk: { score: 2.95, level: "medium" },
        findings: [
            "Joomla admin login pages",
            "CMS version information",
            "Potential outdated installations",
            "~580,000 results"
        ],
        recommendations: [
            "Use strong admin passwords",
            "Enable two-factor authentication",
            "Keep Joomla updated",
            "Rename default admin URL"
        ],
        sampleResults: []
    },
    {
        id: 16,
        title: "Backup Archives",
        category: "directory",
        dork: 'intitle:"Index of" (backup OR bak) ext:zip OR ext:rar',
        description: "Finds exposed backup archive files in directory listings.",
        risk: { score: 3.35, level: "high" },
        findings: [
            "Website backup archives",
            "Database backup files",
            "Source code backups",
            "~125,000 results"
        ],
        recommendations: [
            "Never store backups in web-accessible locations",
            "Use password-protected archives",
            "Implement proper access controls",
            "Regular backup cleanup"
        ],
        sampleResults: []
    },
    {
        id: 17,
        title: "Web.config Exposure",
        category: "config",
        dork: 'ext:config "connectionString"',
        description: "Finds ASP.NET configuration files with database connection strings.",
        risk: { score: 3.55, level: "critical" },
        findings: [
            "Database connection strings",
            "Application settings",
            "Authentication credentials",
            "~15,000 exposed files"
        ],
        recommendations: [
            "Encrypt connection strings in web.config",
            "Use IIS request filtering to block .config access",
            "Store sensitive config outside web root",
            "Implement file system permissions"
        ],
        sampleResults: []
    },
    {
        id: 18,
        title: "Confidential PDF Documents",
        category: "documents",
        dork: 'filetype:pdf intext:"confidential" OR intext:"internal use only"',
        description: "Searches for PDF documents marked as confidential or internal.",
        risk: { score: 3.25, level: "high" },
        findings: [
            "Confidential business documents",
            "Internal memos and reports",
            "Strategic planning documents",
            "~890,000 results"
        ],
        recommendations: [
            "Implement document classification system",
            "Use password protection for sensitive PDFs",
            "Regular audits of published documents",
            "Employee training on document handling"
        ],
        sampleResults: [
            {
                url: "corporate-site.com/docs/Q4_Report_CONFIDENTIAL.pdf",
                title: "[PDF] Q4 Financial Report - CONFIDENTIAL",
                snippet: "CONFIDENTIAL - For Internal Use Only. Q4 2024 Revenue: $45.2M"
            }
        ]
    },
    {
        id: 19,
        title: "Excel Spreadsheets with Emails",
        category: "documents",
        dork: 'filetype:xls intext:"email" OR filetype:xlsx intext:"@"',
        description: "Finds Excel files containing email addresses and contact information.",
        risk: { score: 2.85, level: "medium" },
        findings: [
            "Email address lists",
            "Contact databases",
            "Customer information",
            "~250,000 results"
        ],
        recommendations: [
            "Protect customer data with authentication",
            "Implement data loss prevention (DLP)",
            "Regular privacy audits",
            "GDPR compliance measures"
        ],
        sampleResults: []
    },
    {
        id: 20,
        title: "PowerPoint Presentations",
        category: "documents",
        dork: 'filetype:ppt OR filetype:pptx intext:"proprietary"',
        description: "Locates PowerPoint presentations containing proprietary information.",
        risk: { score: 2.65, level: "medium" },
        findings: [
            "Business strategy presentations",
            "Product roadmaps",
            "Technical architecture diagrams",
            "~180,000 results"
        ],
        recommendations: [
            "Review presentations before publishing",
            "Use watermarks for sensitive slides",
            "Implement access controls",
            "Regular content audits"
        ],
        sampleResults: []
    },
    {
        id: 21,
        title: "Security Cameras",
        category: "iot",
        dork: 'inurl:"/view/index.shtml" OR inurl:"viewerframe?mode="',
        description: "Discovers publicly accessible IP security cameras and webcams.",
        risk: { score: 3.45, level: "high" },
        findings: [
            "Unsecured IP cameras",
            "Live video streams",
            "Home and office surveillance",
            "~85,000 accessible cameras"
        ],
        recommendations: [
            "Change default camera passwords",
            "Disable remote access if not needed",
            "Use VPN for camera access",
            "Regular firmware updates",
            "Implement network segmentation"
        ],
        sampleResults: [
            {
                url: "camera.example-home.com/view/index.shtml",
                title: "Network Camera - Live View",
                snippet: "Panasonic Network Camera - Front Entrance [Live Stream]"
            }
        ]
    },
    {
        id: 22,
        title: "Network Printers",
        category: "iot",
        dork: 'intitle:"Printer" inurl:"/general/status.html"',
        description: "Finds network printers with web interfaces exposed to the internet.",
        risk: { score: 2.55, level: "medium" },
        findings: [
            "Printer status pages",
            "Print job history",
            "Network configuration",
            "~45,000 exposed printers"
        ],
        recommendations: [
            "Restrict printer web interface access",
            "Use network segmentation",
            "Disable unnecessary services",
            "Regular security updates"
        ],
        sampleResults: []
    },
    {
        id: 23,
        title: "AWS S3 Buckets",
        category: "cloud",
        dork: 'site:s3.amazonaws.com intitle:"Index of /"',
        description: "Discovers publicly accessible Amazon S3 storage buckets.",
        risk: { score: 3.75, level: "critical" },
        findings: [
            "Publicly accessible cloud storage",
            "Backup files and data dumps",
            "Application assets",
            "~320,000 open buckets"
        ],
        recommendations: [
            "Review and restrict S3 bucket permissions",
            "Enable S3 bucket encryption",
            "Use AWS Config for compliance monitoring",
            "Implement bucket policies",
            "Enable access logging"
        ],
        sampleResults: [
            {
                url: "s3.amazonaws.com/company-backups/",
                title: "Index of /company-backups",
                snippet: "[Parent Directory] - database-backup-2024.sql - users.csv"
            }
        ]
    },
    {
        id: 24,
        title: "Azure Blob Storage",
        category: "cloud",
        dork: 'site:blob.core.windows.net',
        description: "Locates exposed Microsoft Azure Blob Storage containers.",
        risk: { score: 3.65, level: "critical" },
        findings: [
            "Public Azure storage containers",
            "Application data and backups",
            "Uploaded files and media",
            "~95,000 public containers"
        ],
        recommendations: [
            "Set container access level to private",
            "Use Shared Access Signatures (SAS)",
            "Enable Azure Storage encryption",
            "Regular access audits",
            "Implement Azure Policy"
        ],
        sampleResults: []
    }
];

// ========== Global State ==========
let currentCategory = 'all';
let currentDork = null;

// ========== Category Filtering ==========
function filterCategory(category) {
    currentCategory = category;

    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.category-btn').classList.add('active');

    // Render filtered dorks
    renderDorksList();
}

// ========== Render Dorks List ==========
function renderDorksList() {
    const container = document.getElementById('dorksList');
    const filteredDorks = currentCategory === 'all'
        ? dorksDatabase
        : dorksDatabase.filter(d => d.category === currentCategory);

    container.innerHTML = filteredDorks.map(dork => `
        <div class="dork-card">
            <div class="dork-card-header">
                <div>
                    <div class="dork-card-title">${dork.title}</div>
                </div>
                <span class="dork-card-category">${formatCategory(dork.category)}</span>
            </div>
            <div class="dork-card-query">${escapeHtml(dork.dork)}</div>
            <div class="dork-card-description">${dork.description}</div>
            <div class="dork-card-footer">
                <div class="dork-risk-badge ${dork.risk.level}">
                    ${getRiskIcon(dork.risk.level)} ${dork.risk.level.toUpperCase()} (${dork.risk.score}/4.0)
                </div>
                <button class="dork-analyze-btn" onclick="openDorkAnalysis(${dork.id})">
                    Analyze →
                </button>
            </div>
        </div>
    `).join('');
}

// ========== Open Dork Analysis Panel ==========
function openDorkAnalysis(dorkId) {
    const dork = dorksDatabase.find(d => d.id === dorkId);
    if (!dork) return;

    currentDork = dork;

    // Build analysis panel content
    const panelContent = document.getElementById('panelContent');
    const panelTitle = document.getElementById('panelTitle');

    panelTitle.textContent = dork.title;

    panelContent.innerHTML = `
        <div class="risk-score-display">
            <div class="score-circle ${dork.risk.level}">
                <div class="score-number">${dork.risk.score}</div>
                <div class="score-max">/4.0</div>
            </div>
            <div class="score-label">${dork.risk.level} Risk</div>
        </div>

        <div style="background: var(--bg-card); padding: var(--spacing-md); border-radius: var(--radius-md); margin-bottom: var(--spacing-lg); border-left: 3px solid var(--primary-color);">
            <h4 style="margin-bottom: var(--spacing-sm); color: var(--primary-color);">Google Dork</h4>
            <code style="font-size: 1rem; color: var(--primary-color); word-break: break-all;">${escapeHtml(dork.dork)}</code>
        </div>

        <div class="findings-section">
            <h4>🎯 What This Dork Finds</h4>
            <ul class="findings-list">
                ${dork.findings.map(finding => `<li>${finding}</li>`).join('')}
            </ul>
        </div>

        ${dork.sampleResults && dork.sampleResults.length > 0 ? `
            <div class="sample-results">
                <h4>📋 Sample Results</h4>
                ${dork.sampleResults.map(result => `
                    <div class="sample-result">
                        <div class="sample-result-url">${escapeHtml(result.url)}</div>
                        <div class="sample-result-title">${escapeHtml(result.title)}</div>
                        <div class="sample-result-snippet">${escapeHtml(result.snippet)}</div>
                    </div>
                `).join('')}
            </div>
        ` : ''}

        <div class="recommendations-section">
            <h4>🛡️ Defense & Mitigation</h4>
            <ul class="recommendations-list">
                ${dork.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        </div>
    `;

    // Open panel
    document.getElementById('analysisPanel').classList.add('open');
    document.getElementById('panelOverlay').classList.add('active');
}

// ========== Close Analysis Panel ==========
function closeAnalysisPanel() {
    document.getElementById('analysisPanel').classList.remove('open');
    document.getElementById('panelOverlay').classList.remove('active');
}

// ========== Risk Calculation Engine (for reference, not used in current UI) ==========
function calculateRiskScore(query) {
    const queryLower = query.toLowerCase();

    let sensitivity = 1;
    let exploitability = 1;
    let prevalence = 1;
    let scope = 1;

    // Information Sensitivity Analysis
    if (queryLower.match(/(password|passwd|pwd|api_key|apikey|secret|private key|\.pem|db_password)/)) {
        sensitivity = 4;
    } else if (queryLower.match(/(config|\.env|database|\.sql|backup|confidential|private|admin|user|\.git)/)) {
        sensitivity = 3;
    } else if (queryLower.match(/(index of|directory|version|phpinfo|server-status)/)) {
        sensitivity = 2;
    }

    // Exploitability Analysis
    if ((queryLower.includes('filetype:sql') || queryLower.includes('ext:sql')) &&
        (queryLower.includes('password') || queryLower.includes('insert into'))) {
        exploitability = 4;
    } else if (queryLower.includes('.env') && queryLower.includes('db_password')) {
        exploitability = 4;
    } else if (queryLower.includes('.git') && queryLower.includes('index of')) {
        exploitability = 4;
    } else if (queryLower.includes('admin') && queryLower.includes('login')) {
        exploitability = 3;
    } else if (queryLower.match(/(phpinfo|backup|\.bak)/)) {
        exploitability = 3;
    } else if (queryLower.match(/(index of|config|version)/)) {
        exploitability = 2;
    }

    // Prevalence Analysis
    if (queryLower.includes('index of') && queryLower.includes('parent directory')) {
        prevalence = 4;
    } else if (queryLower.match(/(admin|login|phpinfo|filetype:pdf)/)) {
        prevalence = 3;
    } else if (queryLower.match(/(filetype:sql|\.env|filetype:log)/)) {
        prevalence = 2;
    }

    // Impact Scope Analysis
    if ((queryLower.includes('database') || queryLower.includes('.sql')) &&
        (queryLower.includes('password') || queryLower.includes('users'))) {
        scope = 4;
    } else if (queryLower.includes('.git') && queryLower.includes('index of')) {
        scope = 4;
    } else if (queryLower.match(/(admin|config|backup)/)) {
        scope = 3;
    } else if (queryLower.match(/(filetype:|inurl:)/)) {
        scope = 2;
    }

    const riskScore = (sensitivity * 0.35) + (exploitability * 0.30) + (prevalence * 0.15) + (scope * 0.15) + (4 * 0.05);

    let riskLevel = 'minimal';
    if (riskScore >= 3.51) riskLevel = 'critical';
    else if (riskScore >= 3.01) riskLevel = 'high';
    else if (riskScore >= 2.51) riskLevel = 'medium';
    else if (riskScore >= 1.76) riskLevel = 'low';

    return {
        score: riskScore.toFixed(2),
        level: riskLevel,
        factors: {
            sensitivity,
            exploitability,
            prevalence,
            scope
        }
    };
}

// ========== Generate Findings ==========
function generateFindings(query) {
    const queryLower = query.toLowerCase();
    const findings = [];

    if (queryLower.includes('filetype:') || queryLower.includes('ext:')) {
        const match = queryLower.match(/(?:filetype|ext):(\w+)/);
        if (match) {
            findings.push(`Targets ${match[1].toUpperCase()} files specifically`);
        }
    }

    if (queryLower.includes('password')) {
        findings.push('Searches for password-related content');
    }

    if (queryLower.includes('database') || queryLower.includes('.sql')) {
        findings.push('Targets database files and backups');
    }

    if (queryLower.includes('admin')) {
        findings.push('Focuses on administrative interfaces');
    }

    if (queryLower.includes('config') || queryLower.includes('.env')) {
        findings.push('Searches for configuration files');
    }

    if (queryLower.includes('index of')) {
        findings.push('Identifies directory listings');
    }

    if (queryLower.includes('.git')) {
        findings.push('Looks for exposed Git repositories');
    }

    if (queryLower.includes('site:')) {
        const match = queryLower.match(/site:([\w.]+)/);
        if (match) {
            findings.push(`Limited to ${match[1]} domain`);
        }
    }

    if (findings.length === 0) {
        findings.push('Generic search query');
        findings.push('May return varied results');
    }

    return findings;
}

// ========== Generate Recommendations ==========
function generateRecommendations(query) {
    const queryLower = query.toLowerCase();
    const recommendations = [];

    if (queryLower.match(/(password|api_key|secret)/)) {
        recommendations.push('Rotate all exposed credentials immediately');
        recommendations.push('Implement secrets management system (HashiCorp Vault, AWS Secrets Manager)');
    }

    if (queryLower.match(/(database|\.sql|backup)/)) {
        recommendations.push('Move all database backups outside web-accessible directories');
        recommendations.push('Implement authentication and encryption for backup storage');
    }

    if (queryLower.includes('index of')) {
        recommendations.push('Disable directory listing in web server configuration');
        recommendations.push('Apache: Add "Options -Indexes" to .htaccess');
        recommendations.push('Nginx: Set "autoindex off"');
    }

    if (queryLower.match(/(config|\.env|phpinfo)/)) {
        recommendations.push('Move configuration files outside document root');
        recommendations.push('Use .htaccess to deny access to sensitive files');
    }

    if (queryLower.includes('admin') && queryLower.includes('login')) {
        recommendations.push('Implement multi-factor authentication');
        recommendations.push('Use IP whitelisting for admin access');
        recommendations.push('Implement rate limiting on authentication endpoints');
    }

    if (queryLower.includes('.git')) {
        recommendations.push('Never deploy .git directories to production');
        recommendations.push('Add .git to web server deny rules');
    }

    recommendations.push('Use robots.txt and meta tags to prevent indexing');
    recommendations.push('Regularly audit your search engine footprint');
    recommendations.push('Monitor Google Search Console for indexed sensitive content');

    return recommendations.slice(0, 6);
}

// ========== Generate Sample Results ==========
function generateSampleResults(query) {
    const queryLower = query.toLowerCase();

    if (queryLower.includes('password') && queryLower.includes('filetype:sql')) {
        return [
            {
                url: 'example-site.com/backups/database_backup.sql',
                title: 'Database Backup - SQL Dump File',
                snippet: 'INSERT INTO `users` VALUES (1,\'admin\',\'5f4dcc3b5aa765d...'
            },
            {
                url: 'old-server.net/sql/users.sql',
                title: 'users.sql - Full Database Export',
                snippet: 'CREATE TABLE `users` (`username` varchar(50), `password`...'
            }
        ];
    }

    if (queryLower.includes('.env')) {
        return [
            {
                url: 'dev-server.example.com/.env',
                title: '.env - Environment Configuration',
                snippet: 'DB_HOST=127.0.0.1 DB_PASSWORD=P@ssw0rd123 API_KEY=...'
            }
        ];
    }

    if (queryLower.includes('admin') && queryLower.includes('login')) {
        return [
            {
                url: 'company-site.com/admin/login.php',
                title: 'Administrator Login Panel',
                snippet: 'Please enter your administrator credentials...'
            }
        ];
    }

    return [];
}

// ========== Utility Functions ==========
function formatCategory(category) {
    const map = {
        'database': 'Database',
        'credentials': 'Credentials',
        'config': 'Config',
        'admin': 'Admin',
        'directory': 'Directory',
        'documents': 'Documents',
        'iot': 'IoT Devices',
        'cloud': 'Cloud Storage'
    };
    return map[category] || category;
}

function getRiskIcon(level) {
    const icons = {
        'critical': '🔴',
        'high': '🟠',
        'medium': '🟡',
        'low': '🟢',
        'minimal': '⚪'
    };
    return icons[level] || '⚪';
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ========== Initialize on Page Load ==========
document.addEventListener('DOMContentLoaded', function() {
    // Render initial dorks list
    renderDorksList();

    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Initialize accordions
    initAccordions();

    // Initialize scroll spy for navigation
    initScrollSpy();
});

// ========== Scroll Spy for Active Navigation ==========
function initScrollSpy() {
    const sections = document.querySelectorAll('.section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

    if (sections.length === 0 || navLinks.length === 0) return;

    function updateActiveNav() {
        let current = '';
        const scrollPosition = window.scrollY + 150; // Offset for better detection

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        // Update nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    // Update on scroll
    window.addEventListener('scroll', updateActiveNav);

    // Update on load
    updateActiveNav();
}

// ========== Accordion Functionality ==========
function initAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const accordionItem = this.parentElement;
            const isActive = accordionItem.classList.contains('active');

            // Close all accordions
            const accordion = accordionItem.closest('.accordion');
            if (accordion) {
                accordion.querySelectorAll('.accordion-item').forEach(item => {
                    item.classList.remove('active');
                });
            }

            // Toggle current
            if (!isActive) {
                accordionItem.classList.add('active');
            }
        });
    });
}

// ========== Mobile Menu Functions ==========
function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const menuToggle = document.querySelector('.mobile-menu-toggle');

    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');

    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function closeMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const menuToggle = document.querySelector('.mobile-menu-toggle');

    navMenu.classList.remove('active');
    menuToggle.classList.remove('active');
    document.body.style.overflow = '';
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const navMenu = document.getElementById('navMenu');
    const menuToggle = document.querySelector('.mobile-menu-toggle');

    if (navMenu && menuToggle && !navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
        closeMobileMenu();
    }
});

// ========== Console Message ==========
console.log('%c Google Dork Security Lab ', 'background: #6366f1; color: white; font-size: 16px; font-weight: bold; padding: 10px;');
console.log('%c VSB-TU Ostrava | 2025 ', 'background: #00d9ff; color: #0a0e1a; font-size: 12px; padding: 5px;');
console.log('%c Educational Use Only ', 'color: #10b981; font-size: 11px; font-weight: bold;');
