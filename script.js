/**
 * Advanced Google Hacking Research Project
 * AI-Powered Google Dork Generator & Risk Analyzer
 * VSB-TU Ostrava - 2025
 */

// ========== Global State ==========
let currentDork = '';
let currentRiskData = null;
let radarChart = null;
let generationHistory = [];

// Load history from localStorage
if (localStorage.getItem('dorkHistory')) {
    generationHistory = JSON.parse(localStorage.getItem('dorkHistory'));
}

// ========== AI Dork Generation Engine ==========

/**
 * Intelligent pattern-based dork generator
 * Analyzes natural language input and generates optimized Google Dorks
 */
function generateDork() {
    const input = document.getElementById('aiInput').value.trim();

    if (!input) {
        alert('Please describe what you want to find.');
        return;
    }

    // Show loading state
    const generateBtn = document.querySelector('.btn-generate');
    const originalHTML = generateBtn.innerHTML;
    generateBtn.innerHTML = '<span class="btn-icon">⏳</span> Generating...';
    generateBtn.disabled = true;

    // Simulate AI processing delay for realistic effect
    setTimeout(() => {
        const dork = intelligentDorkGeneration(input);
        const explanation = generateExplanation(input, dork);
        const refinements = generateRefinements(dork);

        // Display generated dork
        displayGeneratedDork(dork, explanation, refinements);

        // Analyze risk automatically
        analyzeGeneratedDork(dork);

        // Add to history
        addToHistory(input, dork);

        // Reset button
        generateBtn.innerHTML = originalHTML;
        generateBtn.disabled = false;
    }, 800);
}

/**
 * Core AI generation logic using pattern matching and NLP techniques
 */
function intelligentDorkGeneration(input) {
    const inputLower = input.toLowerCase();
    let dorkParts = [];

    // === Database Pattern Recognition ===
    if (inputLower.match(/database|mysql|postgresql|sql|db/)) {
        if (inputLower.match(/backup/)) {
            dorkParts.push('filetype:sql');
            dorkParts.push('intext:"INSERT INTO"');
            if (inputLower.match(/password|credential/)) {
                dorkParts.push('intext:"password"');
            }
        } else if (inputLower.match(/dump|export/)) {
            dorkParts.push('filetype:sql');
            dorkParts.push('"-- MySQL dump"');
        } else {
            dorkParts.push('filetype:sql');
            dorkParts.push('intext:"CREATE TABLE"');
        }
    }

    // === Configuration Files ===
    if (inputLower.match(/config|configuration|env|environment/)) {
        if (inputLower.match(/\.env|environment/)) {
            dorkParts.push('filetype:env');
            if (inputLower.match(/password|secret|key|api/)) {
                dorkParts.push('intext:"DB_PASSWORD"');
                dorkParts.push('intext:"API_KEY"');
            }
        } else {
            dorkParts.push('ext:conf');
            dorkParts.push('intext:"password"');
        }
    }

    // === Admin Panels ===
    if (inputLower.match(/admin|administrator|control panel|dashboard/)) {
        if (inputLower.match(/login|sign in|authentication/)) {
            dorkParts.push('inurl:admin');
            dorkParts.push('intitle:login');
            if (inputLower.match(/php/)) {
                dorkParts.push('filetype:php');
            }
        } else {
            dorkParts.push('inurl:admin');
            dorkParts.push('intitle:"admin panel"');
        }
    }

    // === Git Repositories ===
    if (inputLower.match(/git|repository|repo|version control/)) {
        dorkParts.push('inurl:"/.git"');
        dorkParts.push('intitle:"Index of"');
    }

    // === Directory Listings ===
    if (inputLower.match(/directory|folder|index of|listing/)) {
        dorkParts.push('intitle:"Index of"');
        dorkParts.push('"Parent Directory"');
        if (inputLower.match(/backup/)) {
            dorkParts.push('inurl:backup');
        }
    }

    // === Credentials & Passwords ===
    if (inputLower.match(/password|credential|login|auth/) && dorkParts.length === 0) {
        dorkParts.push('filetype:log');
        dorkParts.push('intext:"password"');
        dorkParts.push('intext:"username"');
    }

    // === API Keys ===
    if (inputLower.match(/api.*key|token|secret.*key/)) {
        dorkParts.push('filetype:env');
        dorkParts.push('"API_KEY"');
        dorkParts.push('"SECRET_KEY"');
    }

    // === Log Files ===
    if (inputLower.match(/log.*file|error.*log|access.*log/)) {
        dorkParts.push('filetype:log');
        if (inputLower.match(/error/)) {
            dorkParts.push('intext:"error"');
        }
        if (inputLower.match(/password|credential/)) {
            dorkParts.push('intext:"password"');
        }
    }

    // === PDF Documents ===
    if (inputLower.match(/pdf|document|file/) && inputLower.match(/confidential|private|sensitive/)) {
        dorkParts.push('filetype:pdf');
        dorkParts.push('intext:"confidential"');
    }

    // === Security Cameras ===
    if (inputLower.match(/camera|webcam|cctv|surveillance/)) {
        dorkParts.push('inurl:"view/index.shtml"');
        dorkParts.push('intitle:"Live View"');
    }

    // === Server Info ===
    if (inputLower.match(/server.*info|phpinfo|apache.*status/)) {
        dorkParts.push('intitle:"phpinfo()"');
        dorkParts.push('"PHP Version"');
    }

    // === Site-specific targeting ===
    if (inputLower.match(/government|\.gov/)) {
        dorkParts.push('site:.gov');
    } else if (inputLower.match(/education|university|\.edu/)) {
        dorkParts.push('site:.edu');
    } else if (inputLower.match(/company|corporate|\.com/)) {
        // Specific domain would be added
    }

    // === Backup Files ===
    if (inputLower.match(/backup/) && dorkParts.length === 0) {
        dorkParts.push('ext:bak');
        dorkParts.push('inurl:backup');
    }

    // === Excel/Spreadsheet Files ===
    if (inputLower.match(/excel|spreadsheet|xls|email.*list/)) {
        dorkParts.push('filetype:xls');
        if (inputLower.match(/email/)) {
            dorkParts.push('inurl:"email"');
        }
    }

    // If no patterns matched, create a generic search
    if (dorkParts.length === 0) {
        // Extract key terms
        const keywords = extractKeywords(inputLower);
        if (keywords.length > 0) {
            keywords.forEach(kw => {
                dorkParts.push(`"${kw}"`);
            });
        } else {
            dorkParts.push('intitle:"' + input.substring(0, 30) + '"');
        }
    }

    // Join parts intelligently
    return dorkParts.join(' ');
}

/**
 * Extract relevant keywords from input
 */
function extractKeywords(text) {
    const stopWords = ['find', 'search', 'locate', 'discover', 'show', 'get', 'looking', 'for', 'the', 'a', 'an', 'with', 'and', 'or', 'in', 'on', 'at', 'to', 'from'];
    const words = text.split(/\s+/);
    return words.filter(w => w.length > 3 && !stopWords.includes(w)).slice(0, 3);
}

/**
 * Generate human-readable explanation of the dork
 */
function generateExplanation(input, dork) {
    const parts = [];

    if (dork.includes('filetype:') || dork.includes('ext:')) {
        const fileType = dork.match(/(?:filetype|ext):(\w+)/);
        if (fileType) {
            parts.push(`Searches specifically for ${fileType[1].toUpperCase()} files`);
        }
    }

    if (dork.includes('intitle:')) {
        parts.push('Targets page titles for precise matching');
    }

    if (dork.includes('inurl:')) {
        parts.push('Filters results by URL structure');
    }

    if (dork.includes('intext:')) {
        parts.push('Searches within page content');
    }

    if (dork.includes('site:')) {
        const site = dork.match(/site:([\w.]+)/);
        if (site) {
            parts.push(`Limited to ${site[1]} domains`);
        }
    }

    if (parts.length === 0) {
        parts.push('Performs a targeted search based on your criteria');
    }

    return parts.join('. ') + '.';
}

/**
 * Generate refinement suggestions
 */
function generateRefinements(dork) {
    const refinements = [];

    if (!dork.includes('site:')) {
        refinements.push({ label: 'Limit to .gov sites', dork: dork + ' site:.gov' });
        refinements.push({ label: 'Limit to .edu sites', dork: dork + ' site:.edu' });
    }

    if (!dork.includes('inurl:')) {
        refinements.push({ label: 'Add /admin/ path', dork: dork + ' inurl:admin' });
    }

    if (!dork.includes('filetype:pdf') && !dork.includes('filetype:doc')) {
        refinements.push({ label: 'Only PDF files', dork: dork + ' filetype:pdf' });
    }

    return refinements.slice(0, 4);
}

// ========== Display Functions ==========

/**
 * Display the generated dork with animation
 */
function displayGeneratedDork(dork, explanation, refinements) {
    currentDork = dork;

    const section = document.getElementById('generatedDorkSection');
    const dorkElement = document.getElementById('generatedDork');
    const explanationElement = document.getElementById('dorkExplanation');
    const refineButtons = document.getElementById('refineButtons');

    // Animate appearance
    section.classList.remove('hidden');
    setTimeout(() => section.classList.add('visible'), 10);

    // Type-out effect for dork
    dorkElement.textContent = '';
    let i = 0;
    const typeInterval = setInterval(() => {
        if (i < dork.length) {
            dorkElement.textContent += dork[i];
            i++;
        } else {
            clearInterval(typeInterval);
        }
    }, 20);

    // Set explanation
    explanationElement.textContent = explanation;

    // Add refinement buttons
    refineButtons.innerHTML = '';
    refinements.forEach(ref => {
        const btn = document.createElement('button');
        btn.className = 'refine-btn';
        btn.textContent = ref.label;
        btn.onclick = () => {
            document.getElementById('generatedDork').textContent = ref.dork;
            currentDork = ref.dork;
            analyzeGeneratedDork(ref.dork);
        };
        refineButtons.appendChild(btn);
    });
}

/**
 * Analyze the generated dork and display results
 */
function analyzeGeneratedDork(dork) {
    // Calculate risk
    const riskAssessment = calculateRiskScore(dork);
    currentRiskData = riskAssessment;

    // Generate simulated results
    const simulatedResults = generateSimulatedResults(dork);

    // Generate recommendations
    const recommendations = generateRecommendations(riskAssessment, dork);

    // Display everything
    displayAIResults(riskAssessment, simulatedResults, recommendations);
}

/**
 * Display AI analysis results
 */
function displayAIResults(assessment, simulatedResults, recommendations) {
    const resultsSection = document.getElementById('aiResults');
    resultsSection.classList.remove('hidden');
    setTimeout(() => resultsSection.classList.add('visible'), 10);

    // Update risk circle
    updateRiskCircle(assessment.overall);

    // Create/Update radar chart
    updateRadarChart(assessment.factors);

    // Update impact stats
    updateImpactStats(simulatedResults);

    // Display sample results
    displaySampleResults(simulatedResults.results);

    // Display recommendations
    displayAIRecommendations(recommendations);

    // Update history display
    displayHistory();
}

/**
 * Update risk score circle
 */
function updateRiskCircle(overall) {
    const circle = document.getElementById('scoreCircleAI');
    const value = document.getElementById('scoreValueAI');
    const label = document.getElementById('scoreLabelAI');

    value.textContent = overall.score;
    label.textContent = overall.level.charAt(0).toUpperCase() + overall.level.slice(1) + ' Risk';

    circle.className = 'score-circle-large ' + overall.level;

    // Animate value
    let current = 0;
    const target = parseFloat(overall.score);
    const increment = target / 30;
    const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(interval);
        }
        value.textContent = current.toFixed(2);
    }, 30);
}

/**
 * Create or update radar chart
 */
function updateRadarChart(factors) {
    const ctx = document.getElementById('riskRadarChart');

    const data = {
        labels: ['Sensitivity', 'Exploitability', 'Prevalence', 'Scope', 'Detectability'],
        datasets: [{
            label: 'Risk Factors',
            data: [
                factors.sensitivity.score,
                factors.exploitability.score,
                factors.prevalence.score,
                factors.scope.score,
                factors.detectability.score
            ],
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            borderColor: 'rgba(99, 102, 241, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(99, 102, 241, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(99, 102, 241, 1)',
            pointRadius: 5,
            pointHoverRadius: 7
        }]
    };

    const config = {
        type: 'radar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 4,
                    ticks: {
                        stepSize: 1,
                        color: '#9ca3af',
                        backdropColor: 'transparent'
                    },
                    grid: {
                        color: 'rgba(156, 163, 175, 0.2)'
                    },
                    pointLabels: {
                        color: '#e5e7eb',
                        font: {
                            size: 12
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.9)',
                    titleColor: '#e5e7eb',
                    bodyColor: '#9ca3af',
                    borderColor: 'rgba(99, 102, 241, 0.5)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            const labels = ['Sensitivity', 'Exploitability', 'Prevalence', 'Scope', 'Detectability'];
                            const factorNames = ['sensitivity', 'exploitability', 'prevalence', 'scope', 'detectability'];
                            const index = context.dataIndex;
                            const factorData = currentRiskData.factors[factorNames[index]];
                            return factorData.description;
                        }
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        }
    };

    if (radarChart) {
        radarChart.destroy();
    }

    radarChart = new Chart(ctx, config);
}

/**
 * Update impact statistics
 */
function updateImpactStats(simulatedResults) {
    const resultCount = simulatedResults.count;
    const numericCount = parseInt(resultCount.replace(/[~,]/g, '')) || 0;

    // Animate result count
    animateCounter('estimatedResults', resultCount);

    // Calculate affected sites (rough estimate)
    const affectedSites = Math.floor(numericCount * 0.6);
    animateCounter('affectedSites', '~' + formatNumber(affectedSites));

    // Determine global reach
    let reach = 'Limited';
    if (numericCount > 500000) reach = 'Global';
    else if (numericCount > 100000) reach = 'Widespread';
    else if (numericCount > 10000) reach = 'Moderate';

    document.getElementById('globalReach').textContent = reach;
}

/**
 * Animate counter with numbers
 */
function animateCounter(elementId, finalValue) {
    const element = document.getElementById(elementId);
    const isNumeric = !isNaN(parseInt(finalValue.replace(/[~,]/g, '')));

    if (isNumeric) {
        const target = parseInt(finalValue.replace(/[~,]/g, ''));
        let current = 0;
        const increment = Math.ceil(target / 30);
        const prefix = finalValue.startsWith('~') ? '~' : '';

        const interval = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(interval);
            }
            element.textContent = prefix + formatNumber(current);
        }, 30);
    } else {
        element.textContent = finalValue;
    }
}

/**
 * Format number with commas
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Display sample results
 */
function displaySampleResults(results) {
    const container = document.getElementById('sampleResults');
    container.innerHTML = '';

    results.slice(0, 3).forEach((result, index) => {
        const item = document.createElement('div');
        item.className = 'sample-result-item';
        item.style.animationDelay = (index * 0.1) + 's';

        item.innerHTML = `
            <div class="result-url">${escapeHtml(result.url)}</div>
            <div class="result-title">${escapeHtml(result.title)}</div>
            <div class="result-snippet">${escapeHtml(result.snippet)}</div>
        `;

        container.appendChild(item);
    });
}

/**
 * Display AI recommendations
 */
function displayAIRecommendations(recommendations) {
    const container = document.getElementById('aiRecommendationsList');
    container.innerHTML = '';

    recommendations.forEach((rec, index) => {
        const item = document.createElement('div');
        item.className = 'ai-rec-item';
        item.style.animationDelay = (index * 0.1) + 's';

        item.innerHTML = `
            <div class="rec-icon">⚡</div>
            <div class="rec-content">
                <h5>${escapeHtml(rec.title)}</h5>
                <p>${escapeHtml(rec.description)}</p>
            </div>
        `;

        container.appendChild(item);
    });
}

// ========== History Management ==========

/**
 * Add generation to history
 */
function addToHistory(input, dork) {
    const entry = {
        input: input,
        dork: dork,
        timestamp: new Date().toISOString()
    };

    generationHistory.unshift(entry);

    // Keep only last 10
    if (generationHistory.length > 10) {
        generationHistory = generationHistory.slice(0, 10);
    }

    // Save to localStorage
    localStorage.setItem('dorkHistory', JSON.stringify(generationHistory));
}

/**
 * Display generation history
 */
function displayHistory() {
    const container = document.getElementById('historyList');
    container.innerHTML = '';

    if (generationHistory.length === 0) {
        container.innerHTML = '<p class="no-history">No generation history yet</p>';
        return;
    }

    generationHistory.forEach((entry, index) => {
        const item = document.createElement('div');
        item.className = 'history-item';

        const date = new Date(entry.timestamp);
        const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        item.innerHTML = `
            <div class="history-time">${timeStr}</div>
            <div class="history-content">
                <div class="history-input">${escapeHtml(entry.input)}</div>
                <div class="history-dork"><code>${escapeHtml(entry.dork)}</code></div>
            </div>
            <button class="history-reuse" onclick="reuseFromHistory(${index})" title="Reuse this dork">↻</button>
        `;

        container.appendChild(item);
    });
}

/**
 * Reuse a dork from history
 */
function reuseFromHistory(index) {
    const entry = generationHistory[index];
    document.getElementById('aiInput').value = entry.input;
    generateDork();
}

/**
 * Clear history
 */
function clearHistory() {
    if (confirm('Clear all generation history?')) {
        generationHistory = [];
        localStorage.removeItem('dorkHistory');
        displayHistory();
    }
}

// ========== Utility Functions ==========

/**
 * Set AI input from example
 */
function setAIInput(text) {
    document.getElementById('aiInput').value = text;
    document.getElementById('aiInput').focus();
}

/**
 * Clear AI input
 */
function clearAI() {
    document.getElementById('aiInput').value = '';
    document.getElementById('generatedDorkSection').classList.add('hidden');
    document.getElementById('aiResults').classList.add('hidden');
    currentDork = '';
}

/**
 * Copy dork to clipboard
 */
function copyDork() {
    const dork = currentDork;

    navigator.clipboard.writeText(dork).then(() => {
        const icon = document.getElementById('copyIcon');
        icon.textContent = '✅';
        setTimeout(() => {
            icon.textContent = '📋';
        }, 2000);
    }).catch(err => {
        alert('Failed to copy to clipboard');
    });
}

/**
 * Escape HTML to prevent XSS
 */
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

// ========== Risk Analysis Engine (Reused from original) ==========

/**
 * Calculates comprehensive risk score based on query characteristics
 */
function calculateRiskScore(query) {
    const queryLower = query.toLowerCase();

    let sensitivity = 1;
    let exploitability = 1;
    let prevalence = 1;
    let scope = 1;
    let detectability = 4;

    // Information Sensitivity Analysis
    if (queryLower.includes('password') ||
        queryLower.includes('passwd') ||
        queryLower.includes('pwd') ||
        queryLower.includes('api_key') ||
        queryLower.includes('apikey') ||
        queryLower.includes('secret') ||
        queryLower.includes('private key') ||
        queryLower.includes('.pem') ||
        queryLower.includes('db_password') ||
        queryLower.includes('database_password')) {
        sensitivity = 4;
    }
    else if (queryLower.includes('config') ||
             queryLower.includes('.env') ||
             queryLower.includes('database') ||
             queryLower.includes('.sql') ||
             queryLower.includes('backup') ||
             queryLower.includes('confidential') ||
             queryLower.includes('private') ||
             queryLower.includes('admin') ||
             queryLower.includes('user') ||
             queryLower.includes('.git')) {
        sensitivity = 3;
    }
    else if (queryLower.includes('index of') ||
             queryLower.includes('directory') ||
             queryLower.includes('version') ||
             queryLower.includes('phpinfo') ||
             queryLower.includes('server-status')) {
        sensitivity = 2;
    }

    // Exploitability Analysis
    if ((queryLower.includes('filetype:sql') || queryLower.includes('ext:sql')) &&
        (queryLower.includes('password') || queryLower.includes('insert into'))) {
        exploitability = 4;
    }
    else if (queryLower.includes('.env') && queryLower.includes('db_password')) {
        exploitability = 4;
    }
    else if (queryLower.includes('.git') && queryLower.includes('index of')) {
        exploitability = 4;
    }
    else if (queryLower.includes('admin') && queryLower.includes('login')) {
        exploitability = 3;
    }
    else if (queryLower.includes('phpinfo')) {
        exploitability = 3;
    }
    else if (queryLower.includes('backup') || queryLower.includes('.bak')) {
        exploitability = 3;
    }
    else if (queryLower.includes('index of') ||
             queryLower.includes('config') ||
             queryLower.includes('version')) {
        exploitability = 2;
    }

    // Prevalence Analysis
    if (queryLower.includes('index of') && queryLower.includes('parent directory')) {
        prevalence = 4;
    }
    else if (queryLower.includes('admin') ||
             queryLower.includes('login') ||
             queryLower.includes('phpinfo') ||
             queryLower.includes('filetype:pdf')) {
        prevalence = 3;
    }
    else if (queryLower.includes('filetype:sql') ||
             queryLower.includes('.env') ||
             queryLower.includes('filetype:log')) {
        prevalence = 2;
    }

    // Impact Scope Analysis
    if ((queryLower.includes('database') || queryLower.includes('.sql')) &&
        (queryLower.includes('password') || queryLower.includes('users'))) {
        scope = 4;
    }
    else if (queryLower.includes('.git') && queryLower.includes('index of')) {
        scope = 4;
    }
    else if (queryLower.includes('admin') ||
             queryLower.includes('config') ||
             queryLower.includes('backup')) {
        scope = 3;
    }
    else if (queryLower.includes('filetype:') ||
             queryLower.includes('inurl:')) {
        scope = 2;
    }

    const riskScore = (sensitivity * 0.35) +
                      (exploitability * 0.30) +
                      (prevalence * 0.15) +
                      (scope * 0.15) +
                      (detectability * 0.05);

    let riskLevel = 'minimal';
    if (riskScore >= 3.51) riskLevel = 'critical';
    else if (riskScore >= 3.01) riskLevel = 'high';
    else if (riskScore >= 2.51) riskLevel = 'medium';
    else if (riskScore >= 1.76) riskLevel = 'low';

    const sensitivityDesc = getSensitivityDescription(sensitivity);
    const exploitDesc = getExploitabilityDescription(exploitability);
    const prevalenceDesc = getPrevalenceDescription(prevalence);
    const scopeDesc = getScopeDescription(scope);
    const detectDesc = 'Passive reconnaissance - no direct target interaction';

    return {
        overall: {
            score: riskScore.toFixed(2),
            level: riskLevel
        },
        factors: {
            sensitivity: {
                score: sensitivity,
                description: sensitivityDesc
            },
            exploitability: {
                score: exploitability,
                description: exploitDesc
            },
            prevalence: {
                score: prevalence,
                description: prevalenceDesc
            },
            scope: {
                score: scope,
                description: scopeDesc
            },
            detectability: {
                score: detectability,
                description: detectDesc
            }
        }
    };
}

function getSensitivityDescription(score) {
    const descriptions = {
        1: 'Low - Public or non-sensitive information',
        2: 'Medium - Internal infrastructure details',
        3: 'High - Sensitive configuration or user data',
        4: 'Critical - Credentials, keys, or authentication data'
    };
    return descriptions[score] || descriptions[1];
}

function getExploitabilityDescription(score) {
    const descriptions = {
        1: 'Low - Information requires significant additional analysis',
        2: 'Medium - Moderate technical skill needed for exploitation',
        3: 'High - Direct exploitation pathway available',
        4: 'Critical - Immediate system access or data breach possible'
    };
    return descriptions[score] || descriptions[1];
}

function getPrevalenceDescription(score) {
    const descriptions = {
        1: 'Rare - Less than 100 results typically found',
        2: 'Uncommon - 100 to 10,000 results expected',
        3: 'Common - 10,000 to 100,000 results likely',
        4: 'Widespread - Over 100,000 results globally'
    };
    return descriptions[score] || descriptions[1];
}

function getScopeDescription(score) {
    const descriptions = {
        1: 'Individual - Single user or account affected',
        2: 'Limited - Multiple users or single system compromise',
        3: 'Organizational - Multiple systems or departments at risk',
        4: 'Enterprise - Complete infrastructure compromise potential'
    };
    return descriptions[score] || descriptions[1];
}

/**
 * Generates simulated search results based on query characteristics
 */
function generateSimulatedResults(query) {
    const queryLower = query.toLowerCase();
    let resultCount = 'Unknown';
    const results = [];

    if (queryLower.includes('password') && queryLower.includes('filetype:sql')) {
        resultCount = '~45,000';
        results.push({
            url: 'https://example-site.com/backups/database_backup_2024.sql',
            title: 'Database Backup - SQL Dump File',
            snippet: '-- MySQL dump 10.13  Distrib 5.7.28... INSERT INTO `users` VALUES (1,\'admin\',\'5f4dcc3b5aa765d61d8327deb882cf99\'...'
        });
        results.push({
            url: 'https://old-site.net/old_database/users.sql',
            title: 'users.sql - Full Database Export',
            snippet: 'CREATE TABLE `users` (`id` int(11) NOT NULL AUTO_INCREMENT, `username` varchar(50), `password` varchar(255)...'
        });
        results.push({
            url: 'https://backup.another-domain.org/sql_backups/site_db.sql',
            title: 'Site Database SQL Backup | Another Domain',
            snippet: '-- Dumping data for table `admin_users` -- INSERT INTO `admin_users` VALUES (1,\'admin\',\'$2y$10$...'
        });
    }
    else if (queryLower.includes('index of') && queryLower.includes('parent directory')) {
        resultCount = '~1,240,000';
        results.push({
            url: 'https://unsecured-server.com/uploads/',
            title: 'Index of /uploads',
            snippet: '[Parent Directory] - documents/ - images/ - backups/ - config.php - database.sql - .env'
        });
        results.push({
            url: 'https://example.org/files/',
            title: 'Index of /files',
            snippet: '[Parent Directory] - admin/ - logs/ - private/ - backup.zip - credentials.txt'
        });
        results.push({
            url: 'https://web-server-123.net/www/',
            title: 'Index of /www',
            snippet: '[Parent Directory] - wp-config.php - .htaccess - wp-content/ - wp-admin/ - database_backup.sql'
        });
    }
    else if (queryLower.includes('admin') && queryLower.includes('login')) {
        resultCount = '~892,000';
        results.push({
            url: 'https://company-site.com/admin/login.php',
            title: 'Administrator Login Panel',
            snippet: 'Please enter your administrator credentials to access the control panel. Username: Password: [Login]'
        });
        results.push({
            url: 'https://shop-online.net/administrator/index.php',
            title: 'Admin Login - Shop Management',
            snippet: 'Secure Admin Area - Please authenticate to continue. Email: Password: Remember me [Sign In]'
        });
        results.push({
            url: 'https://portal.business-corp.com/admin_login',
            title: 'Business Corp - Admin Dashboard Login',
            snippet: 'Welcome to the administration panel. Enter your credentials below. User ID: Password: [Access Dashboard]'
        });
    }
    else if (queryLower.includes('.env') && queryLower.includes('db_password')) {
        resultCount = '~18,500';
        results.push({
            url: 'https://dev-server.example.com/.env',
            title: '.env - Environment Configuration',
            snippet: 'APP_NAME=Laravel APP_ENV=production APP_KEY=base64:... DB_CONNECTION=mysql DB_HOST=127.0.0.1 DB_PORT=3306 DB_DATABASE=production_db DB_USERNAME=admin DB_PASSWORD=P@ssw0rd123...'
        });
        results.push({
            url: 'https://api.startup-company.io/.env.backup',
            title: '.env.backup',
            snippet: 'DATABASE_URL=postgresql://user:password@localhost:5432/myapp JWT_SECRET=supersecret... AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE AWS_SECRET_ACCESS_KEY=...'
        });
    }
    else if (queryLower.includes('filetype:pdf') && queryLower.includes('confidential')) {
        resultCount = '~315,000';
        results.push({
            url: 'https://corporate-site.com/docs/financial_report_2024_CONFIDENTIAL.pdf',
            title: '[PDF] Financial Report 2024 - CONFIDENTIAL',
            snippet: 'CONFIDENTIAL - For Internal Use Only. Q4 2024 Financial Performance. Revenue: $45.2M. Profit Margin: 23.4%...'
        });
        results.push({
            url: 'https://lawfirm.net/cases/settlement_agreement_confidential.pdf',
            title: '[PDF] Settlement Agreement - Confidential',
            snippet: 'CONFIDENTIAL SETTLEMENT AGREEMENT. This agreement is entered into on... Party A agrees to pay $2.5M...'
        });
    }
    else if (queryLower.includes('.git') && queryLower.includes('index of')) {
        resultCount = '~7,200';
        results.push({
            url: 'https://website.com/.git/',
            title: 'Index of /.git',
            snippet: '[Parent Directory] - config - HEAD - description - hooks/ - info/ - objects/ - refs/ - logs/'
        });
        results.push({
            url: 'https://app.service-provider.io/.git/config',
            title: '.git/config',
            snippet: '[core] repositoryformatversion = 0 [remote "origin"] url = https://github.com/company/private-repo.git...'
        });
    }
    else if (queryLower.includes('phpinfo')) {
        resultCount = '~52,000';
        results.push({
            url: 'https://test-server.com/info.php',
            title: 'PHP Version 7.4.3 - phpinfo()',
            snippet: 'PHP Version 7.4.3. System: Linux server 4.15.0-112-generic... Server API: Apache 2.0 Handler. Configuration File Path: /etc/php/7.4/apache2...'
        });
        results.push({
            url: 'https://legacy.old-site.org/phpinfo.php',
            title: 'phpinfo() - Configuration Information',
            snippet: 'PHP Version 5.6.40. Loaded Configuration File: /etc/php5/apache2/php.ini. Server Root: /var/www...'
        });
    }
    else {
        resultCount = '~' + (Math.floor(Math.random() * 500) + 100) + ',000';
        results.push({
            url: 'https://example-website.com/page1',
            title: 'Example Result - Matching Query',
            snippet: 'This is a simulated search result that matches your Google Dork query. The actual results would depend on what is indexed by search engines.'
        });
        results.push({
            url: 'https://another-site.net/resource',
            title: 'Another Matching Result',
            snippet: 'Simulated result showing potential exposure. In real scenarios, these results could reveal sensitive information or vulnerable systems.'
        });
        results.push({
            url: 'https://third-example.org/data',
            title: 'Third Result Example',
            snippet: 'Additional simulated result demonstrating the type of information that might be discovered through this Google Dork.'
        });
    }

    return {
        count: resultCount,
        results: results
    };
}

/**
 * Generates mitigation recommendations based on risk assessment
 */
function generateRecommendations(assessment, query) {
    const recommendations = [];
    const queryLower = query.toLowerCase();

    if (queryLower.includes('password') || queryLower.includes('api_key') ||
        queryLower.includes('secret')) {
        recommendations.push({
            title: 'Immediate Credential Rotation',
            description: 'All exposed credentials must be immediately rotated. Implement a secrets management system (HashiCorp Vault, AWS Secrets Manager) to prevent future exposure.'
        });
        recommendations.push({
            title: 'Remove from Search Index',
            description: 'Use Google Search Console to request urgent removal of indexed pages containing credentials. Implement authentication to prevent crawler access.'
        });
    }

    if (queryLower.includes('database') || queryLower.includes('.sql') ||
        queryLower.includes('backup')) {
        recommendations.push({
            title: 'Secure Database Backups',
            description: 'Move all database backups outside web-accessible directories. Implement authentication and encryption for backup storage. Use robots.txt to disallow /backup/ paths.'
        });
        recommendations.push({
            title: 'Access Control Implementation',
            description: 'Implement IP whitelisting for administrative and backup directories. Require authentication for all sensitive file access.'
        });
    }

    if (queryLower.includes('index of') || queryLower.includes('directory')) {
        recommendations.push({
            title: 'Disable Directory Listing',
            description: 'Configure web server to prevent directory browsing. Apache: Add "Options -Indexes" to .htaccess. Nginx: Set "autoindex off" in configuration.'
        });
    }

    if (queryLower.includes('config') || queryLower.includes('.env') ||
        queryLower.includes('phpinfo')) {
        recommendations.push({
            title: 'Protect Configuration Files',
            description: 'Move configuration files outside document root. Implement strict file permissions (600/640). Use .htaccess to deny access to .env, .git, and config files.'
        });
    }

    if (queryLower.includes('admin') && queryLower.includes('login')) {
        recommendations.push({
            title: 'Secure Administrative Access',
            description: 'Implement IP whitelisting for admin panels. Use multi-factor authentication. Consider renaming admin URLs to non-standard paths.'
        });
        recommendations.push({
            title: 'Rate Limiting and Monitoring',
            description: 'Implement rate limiting on authentication endpoints. Monitor for brute force attempts. Use CAPTCHA after failed login attempts.'
        });
    }

    if (queryLower.includes('.git')) {
        recommendations.push({
            title: 'Remove Git Directories',
            description: 'Delete .git directories from production web servers. Never deploy version control metadata to production environments. Use .gitignore for sensitive files.'
        });
    }

    recommendations.push({
        title: 'Regular Security Audits',
        description: 'Perform monthly Google Dorking assessments against your own infrastructure. Use Google Search Console to monitor indexed content.'
    });

    recommendations.push({
        title: 'Robots.txt and Meta Tags',
        description: 'Implement comprehensive robots.txt to disallow sensitive paths. Use <meta name="robots" content="noindex"> for pages that should not be indexed.'
    });

    return recommendations.slice(0, 6);
}

// ========== Smooth Scrolling & Animations ==========
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            if (target) {
                target.style.opacity = '1';
                target.style.transform = 'translateY(0)';

                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation link highlighting
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-menu a');

    function highlightNavigation() {
        let scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavigation);
    highlightNavigation();

    // Add entrance animations to sections
    const observerOptions = {
        threshold: 0.05,
        rootMargin: '100px 0px 100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Fix for sections that are immediately visible or partially visible
    setTimeout(() => {
        document.querySelectorAll('.section').forEach(section => {
            const rect = section.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight + 200 && rect.bottom > -200;
            if (isVisible) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    }, 100);

    // Initialize interactive elements
    initAccordions();
    initTabs();
    initExpandableCards();
});

// ========== Interactive Elements ==========

/**
 * Initialize accordions
 */
function initAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const accordionItem = this.parentElement;
            const isActive = accordionItem.classList.contains('active');

            // Close all accordions in the same group
            const accordion = accordionItem.closest('.accordion');
            if (accordion) {
                accordion.querySelectorAll('.accordion-item').forEach(item => {
                    item.classList.remove('active');
                });
            }

            // Toggle current accordion
            if (!isActive) {
                accordionItem.classList.add('active');
            }
        });
    });
}

/**
 * Initialize tabs
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabContainer = this.closest('.tabs-container');
            const targetTab = this.getAttribute('data-tab');

            // Remove active class from all buttons and contents in this container
            tabContainer.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });
            tabContainer.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });

            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            const targetContent = tabContainer.querySelector(`#${targetTab}`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

/**
 * Initialize expandable cards
 */
function initExpandableCards() {
    const cardPreviews = document.querySelectorAll('.card-preview');

    cardPreviews.forEach(preview => {
        preview.addEventListener('click', function() {
            const card = this.parentElement;
            card.classList.toggle('expanded');
        });
    });
}

// ========== Console Welcome Message ==========
console.log('%c AI-Powered Google Dork Generator ', 'background: #6366f1; color: white; font-size: 16px; font-weight: bold; padding: 10px;');
console.log('%c VSB-TU Ostrava | 2025 ', 'background: #00d9ff; color: #0a0e1a; font-size: 12px; padding: 5px;');
console.log('%c This research project is for educational purposes only. ', 'color: #9ca3af; font-size: 11px;');
console.log('%c Always conduct security research ethically and with proper authorization. ', 'color: #10b981; font-size: 11px; font-weight: bold;');
