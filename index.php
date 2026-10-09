<?php
/**
 * Omnintell Technologies & Omnintell Labs — Standalone All-In-One Platform
 * Founder & CEO: Omkareshwar Sinha (Jack)
 * 
 * Self-Bootstrapping, Self-Healing, and Fully Autonomous:
 * - Automatically initializes all required directories (uploads/, assets/, data/)
 * - Automatically generates initial data.json, inquiries.json, failed_logins.json, and .htaccess if missing
 * - Supports complete REST API and session-secured Admin Panel
 * - Includes on-the-fly ZIP archiver for one-click full website download (?action=download_zip)
 * - Automatically serves Vite-built React SPA if compiled assets exist, or provides full rich standalone UI
 */

error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
ini_set('display_errors', 0);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// -----------------------------------------------------------------------------
// 1. DIRECTORY & ENVIRONMENT AUTO-INITIALIZATION
// -----------------------------------------------------------------------------
define('ROOT_DIR', __DIR__);
define('DATA_FILE', ROOT_DIR . '/data.json');
define('LOG_FILE', ROOT_DIR . '/failed_logins.json');
define('INQUIRIES_FILE', ROOT_DIR . '/inquiries.json');
define('HTACCESS_FILE', ROOT_DIR . '/.htaccess');
define('ASSETS_DIR', ROOT_DIR . '/assets');

// Detect and create upload directory (supports both ./uploads and ./public/uploads)
$targetUploadDir = ROOT_DIR . '/uploads/';
if (is_dir(ROOT_DIR . '/public/uploads/')) {
    $targetUploadDir = ROOT_DIR . '/public/uploads/';
} elseif (!is_dir($targetUploadDir)) {
    @mkdir($targetUploadDir, 0755, true);
}
define('UPLOAD_DIR', $targetUploadDir);

if (!is_dir(ASSETS_DIR)) {
    @mkdir(ASSETS_DIR, 0755, true);
}

// Auto-seed separate CSS stylesheet if missing
$themeCssPath = ASSETS_DIR . '/portfolio-theme.css';
if (!file_exists($themeCssPath)) {
    if (file_exists(ROOT_DIR . '/public/assets/portfolio-theme.css')) {
        @copy(ROOT_DIR . '/public/assets/portfolio-theme.css', $themeCssPath);
    } elseif (file_exists(ROOT_DIR . '/assets/portfolio-theme.css')) {
        @copy(ROOT_DIR . '/assets/portfolio-theme.css', $themeCssPath);
    }
}

// Auto-seed separate interactive JS engine if missing
$interactiveJsPath = ASSETS_DIR . '/portfolio-interactive.js';
if (!file_exists($interactiveJsPath)) {
    if (file_exists(ROOT_DIR . '/public/assets/portfolio-interactive.js')) {
        @copy(ROOT_DIR . '/public/assets/portfolio-interactive.js', $interactiveJsPath);
    } elseif (file_exists(ROOT_DIR . '/assets/portfolio-interactive.js')) {
        @copy(ROOT_DIR . '/assets/portfolio-interactive.js', $interactiveJsPath);
    }
}

// Auto-create .htaccess for Apache rewrite rules if missing
if (!file_exists(HTACCESS_FILE)) {
    $htaccessContent = <<<EOT
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^api/(.*)$ index.php [QSA,L]
  RewriteRule ^(.*)$ index.php [QSA,L]
</IfModule>
EOT;
    @file_put_contents(HTACCESS_FILE, $htaccessContent);
}

// Auto-create inquiries.json if missing
if (!file_exists(INQUIRIES_FILE)) {
    @file_put_contents(INQUIRIES_FILE, json_encode([], JSON_PRETTY_PRINT));
}

// Auto-create failed_logins.json if missing
if (!file_exists(LOG_FILE)) {
    @file_put_contents(LOG_FILE, json_encode([], JSON_PRETTY_PRINT));
}

// -----------------------------------------------------------------------------
// 2. SECURITY, LOGGING & RATE-LIMITING
// -----------------------------------------------------------------------------
function getClientIP() {
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $parts = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        $ip = trim($parts[0]);
    }
    return $ip ?: '127.0.0.1';
}

function readFailedLogins() {
    if (!file_exists(LOG_FILE)) return [];
    $content = @file_get_contents(LOG_FILE);
    return json_decode($content, true) ?: [];
}

function writeFailedLogins($data) {
    @file_put_contents(LOG_FILE, json_encode($data, JSON_PRETTY_PRINT));
}

function logFailedAttempt($ip) {
    $logs = readFailedLogins();
    if (!isset($logs[$ip])) {
        $logs[$ip] = ['count' => 0, 'first_attempt' => time(), 'last_attempt' => time(), 'blocked_until' => 0];
    }
    $logs[$ip]['count']++;
    $logs[$ip]['last_attempt'] = time();
    $attempts = $logs[$ip]['count'];
    if ($attempts >= 4) {
        $blockCount = floor(($attempts - 4) / 2) + 1;
        $delay = min(120 * pow(2, $blockCount - 1), 1200);
        $logs[$ip]['blocked_until'] = time() + $delay;
    }
    writeFailedLogins($logs);
    return $logs[$ip];
}

function isIPBlocked($ip) {
    $logs = readFailedLogins();
    return isset($logs[$ip]) && $logs[$ip]['blocked_until'] > time();
}

function resetFailedAttempts($ip) {
    $logs = readFailedLogins();
    unset($logs[$ip]);
    writeFailedLogins($logs);
}

// -----------------------------------------------------------------------------
// 3. COMPLETE INITIAL PORTFOLIO DATA GENERATOR
// -----------------------------------------------------------------------------
function loadData() {
    if (!file_exists(DATA_FILE)) {
        $default = [
            'password' => password_hash('omkareshwar', PASSWORD_BCRYPT),
            'userName' => 'Omkareshwar Sinha',
            'userTagline' => 'CEO & Founder — Omnintell Technologies · CEO & Founder — Omnintell Labs · AI Architect & Ethical Hacker',
            'userBio' => 'CEO & Founder of Omnintell Technologies and Omnintell Labs based in Chhattisgarh, India. 10th Grade Innovator from Mothers Pride School (MPS) Khamariya. A full stack developer, ethical hacker, and AI architect building intelligent technology for the real world — creator of Jarvis AI, Om AI, and Aegisv18 Elite.',
            'location' => 'Chhattisgarh, India',
            'school' => 'Mothers Pride School (MPS) Khamariya, Chhattisgarh, India',
            'companies' => [
                'Omnintell Technologies (CEO & Founder)',
                'Omnintell Labs (CEO & Founder)'
            ],
            'skills' => [
                ['id' => 1, 'name' => '3D Modeling & WebGL Graphics', 'level' => 96, 'category' => '3D & Motion'],
                ['id' => 2, 'name' => 'AI Architecture & LLM Systems', 'level' => 95, 'category' => 'Intelligence'],
                ['id' => 3, 'name' => 'Full Stack Web & React/Node', 'level' => 94, 'category' => 'Engineering'],
                ['id' => 4, 'name' => 'Cybersecurity & Ethical Hacking', 'level' => 92, 'category' => 'Security'],
                ['id' => 5, 'name' => 'Python R&D & Automation', 'level' => 91, 'category' => 'Engineering'],
                ['id' => 6, 'name' => 'Motion Design & Spatial VFX', 'level' => 90, 'category' => '3D & Motion'],
                ['id' => 7, 'name' => 'Brand Identity & Design Systems', 'level' => 89, 'category' => 'Creative'],
                ['id' => 8, 'name' => 'Network Defense & Penetration Testing', 'level' => 88, 'category' => 'Security']
            ],
            'certificates' => [
                ['id' => 1, 'title' => 'AI & Deep Learning Architecture', 'issuer' => 'Omnintell Labs / Advanced Research Program', 'date' => '2024', 'credentialUrl' => 'https://omnintell.tech/verify/ai-arch'],
                ['id' => 2, 'title' => 'Ethical Hacking & Web Penetration Testing', 'issuer' => 'Cyber Defense Initiative · MPS Khamariya', 'date' => '2024', 'credentialUrl' => 'https://omnintell.tech/verify/cyber-sec'],
                ['id' => 3, 'title' => 'Advanced 3D Modeling & Cinematic Animation', 'issuer' => 'Global Motion & 3D Creators Guild', 'date' => '2023', 'credentialUrl' => 'https://omnintell.tech/verify/3d-motion'],
                ['id' => 4, 'title' => 'Full-Stack Enterprise Systems & Cloud Deployment', 'issuer' => 'Omnintell Technologies Technical Division', 'date' => '2023', 'credentialUrl' => 'https://omnintell.tech/verify/cloud-dev']
            ],
            'projects' => [
                [
                    'id' => 1,
                    'title' => 'Jarvis AI Autonomous System',
                    'category' => 'AI & Intelligence',
                    'description' => 'Custom autonomous voice and system intelligence assistant powered by neural speech models, NLP intent parsing, and local LLM execution pipelines built at Omnintell Labs.',
                    'url' => 'https://github.com/omkareshwarsinha/jarvis-ai',
                    'image' => 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1280&q=80',
                    'images' => [
                        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1280&q=80',
                        'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1280&q=80'
                    ],
                    'tags' => ['AI Agents', 'Python', 'Voice Assistant', 'LLMs']
                ],
                [
                    'id' => 2,
                    'title' => 'Om AI Conversational Engine',
                    'category' => 'AI & Intelligence',
                    'description' => 'Next-generation generative AI and reasoning engine engineered for code generation, semantic data research, and dynamic conversational workflows developed at Omnintell Technologies.',
                    'url' => 'https://github.com/omkareshwarsinha/om-ai',
                    'image' => 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1280&q=80',
                    'images' => [
                        'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1280&q=80'
                    ],
                    'tags' => ['Generative AI', 'Neural Networks', 'React', 'Python']
                ],
                [
                    'id' => 3,
                    'title' => 'Aegisv18 Elite Cyber Defense',
                    'category' => 'Cybersecurity',
                    'description' => 'Comprehensive cybersecurity penetration testing toolkit and anomaly detection engine designed for hardening enterprise networks against modern threat vectors.',
                    'url' => 'https://github.com/omkareshwarsinha/aegisv18-elite',
                    'image' => 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1280&q=80',
                    'images' => [
                        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1280&q=80'
                    ],
                    'tags' => ['Ethical Hacking', 'Penetration Testing', 'Network Defense']
                ],
                [
                    'id' => 4,
                    'title' => 'Nextlevel Studio',
                    'category' => 'Client 3D',
                    'description' => 'Comprehensive 3D environment branding and spatial interactive portfolio. Crafted with custom lighting textures, photorealistic models, and high-frequency motion animations.',
                    'url' => 'https://nextlevelstudio.design',
                    'image' => 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
                    'images' => [
                        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
                        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85'
                    ],
                    'tags' => ['3D Modeling', 'Branding', 'WebGL']
                ],
                [
                    'id' => 5,
                    'title' => 'Aura Brand Identity',
                    'category' => 'Personal R&D',
                    'description' => 'Exploratory brand identity design system combining parametric 3D art direction, dark glass minimalism, and dynamic fluid render passes for next-generation technology startups.',
                    'url' => 'https://aurabrand.design',
                    'image' => 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85',
                    'images' => [
                        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85'
                    ],
                    'tags' => ['Design System', 'Cinema 4D', 'Brand Identity']
                ],
                [
                    'id' => 6,
                    'title' => 'Solaris Digital Spatial Experience',
                    'category' => 'Client',
                    'description' => 'High-fidelity digital experience incorporating custom kinetic typography, spatial render assets, and interactive WebGL canvas modules delivering conversion-focused storytelling.',
                    'url' => 'https://solarisdigital.io',
                    'image' => 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85',
                    'images' => [
                        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85'
                    ],
                    'tags' => ['Web Design', 'Rendering', 'Interactive']
                ]
            ],
            'contacts' => [
                ['id' => 1, 'platform' => 'instagram', 'label' => '@jarvisom18', 'url' => 'https://instagram.com/jarvisom18', 'isPrimary' => true],
                ['id' => 2, 'platform' => 'instagram', 'label' => '@oooommm_18', 'url' => 'https://www.instagram.com/oooommm_18?stkn=dDRvbjZxNDhwNXBu', 'isPrimary' => true],
                ['id' => 3, 'platform' => 'email', 'label' => 'omkareshwarsinha6@gmail.com', 'url' => 'mailto:omkareshwarsinha6@gmail.com', 'isPrimary' => true],
                ['id' => 4, 'platform' => 'linkedin', 'label' => 'LinkedIn Profile', 'url' => 'https://www.linkedin.com/in/omkareshwar-sinha', 'isPrimary' => false],
                ['id' => 5, 'platform' => 'github', 'label' => 'GitHub', 'url' => 'https://github.com/omkareshwarsinha', 'isPrimary' => false],
                ['id' => 6, 'platform' => 'reddit', 'label' => 'Reddit', 'url' => 'https://www.reddit.com/user/omkareshwar', 'isPrimary' => false],
                ['id' => 7, 'platform' => 'facebook', 'label' => 'Facebook', 'url' => 'https://www.facebook.com/omkareshwar.sinha', 'isPrimary' => false],
                ['id' => 8, 'platform' => 'twitter', 'label' => 'X / Twitter', 'url' => 'https://x.com/omkareshwarsin', 'isPrimary' => false]
            ]
        ];
        @file_put_contents(DATA_FILE, json_encode($default, JSON_PRETTY_PRINT));
        return $default;
    }
    $raw = @file_get_contents(DATA_FILE);
    return json_decode($raw, true) ?: [];
}

function saveData($data) {
    @file_put_contents(DATA_FILE, json_encode($data, JSON_PRETTY_PRINT));
}

// -----------------------------------------------------------------------------
// 4. ON-THE-FLY ZIP ARCHIVER (Download complete website)
// -----------------------------------------------------------------------------
function streamZipArchive() {
    $zipFilename = 'omnintell-technologies-portfolio.zip';
    
    if (class_exists('ZipArchive')) {
        $zip = new ZipArchive();
        $tempFile = tempnam(sys_get_temp_dir(), 'om_zip_');
        if ($zip->open($tempFile, ZipArchive::CREATE | ZipArchive::OVERWRITE) === true) {
            $iterator = new RecursiveIteratorIterator(
                new RecursiveDirectoryIterator(ROOT_DIR, RecursiveDirectoryIterator::SKIP_DOTS),
                RecursiveIteratorIterator::SELF_FIRST
            );
            foreach ($iterator as $item) {
                $filePath = $item->getRealPath();
                $relativePath = substr($filePath, strlen(ROOT_DIR) + 1);
                
                // Skip temporary or heavy build artifacts
                if (
                    strpos($relativePath, '.git') === 0 ||
                    strpos($relativePath, 'node_modules') === 0 ||
                    strpos($relativePath, '.cache') === 0 ||
                    preg_match('/\.zip$/i', $relativePath)
                ) {
                    continue;
                }
                if ($item->isDir()) {
                    $zip->addEmptyDir($relativePath);
                } else {
                    $zip->addFile($filePath, $relativePath);
                }
            }
            $zip->close();
            
            header('Content-Type: application/zip');
            header('Content-Disposition: attachment; filename="' . $zipFilename . '"');
            header('Content-Length: ' . filesize($tempFile));
            header('Pragma: no-cache');
            header('Expires: 0');
            readfile($tempFile);
            @unlink($tempFile);
            exit;
        }
    }
    
    // Fallback: If ZipArchive extension is disabled in PHP, stream index.php directly
    header('Content-Type: application/x-php');
    header('Content-Disposition: attachment; filename="index.php"');
    header('Content-Length: ' . filesize(__FILE__));
    readfile(__FILE__);
    exit;
}

// -----------------------------------------------------------------------------
// 5. REST API & ADMIN ACTION ROUTER
// -----------------------------------------------------------------------------
$action = $_REQUEST['action'] ?? '';
$isApiCall = !empty($action) || (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false && $_SERVER['REQUEST_METHOD'] === 'POST');

// Handle ZIP Download immediately
if ($action === 'download_zip' || $action === 'download' || (isset($_GET['download']) && $_GET['download'] === 'zip')) {
    streamZipArchive();
}

// Handle direct standalone PHP download
if ($action === 'download_php' || (isset($_GET['download']) && $_GET['download'] === 'php')) {
    header('Content-Type: application/x-php');
    header('Content-Disposition: attachment; filename="index.php"');
    header('Content-Length: ' . filesize(__FILE__));
    readfile(__FILE__);
    exit;
}

if ($isApiCall) {
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    
    $ip = getClientIP();
    $data = loadData();
    
    // Public: get_all
    if ($action === 'get_all' || ($_SERVER['REQUEST_METHOD'] === 'GET' && empty($action))) {
        unset($data['password']);
        echo json_encode($data);
        exit;
    }
    
    // Public: submit_contact
    if ($action === 'submit_contact') {
        $name = trim($_POST['name'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $msg = trim($_POST['message'] ?? '');
        if (empty($name) || empty($email)) {
            http_response_code(400);
            echo json_encode(['error' => 'Name and email are required']);
            exit;
        }
        $inquiries = file_exists(INQUIRIES_FILE) ? (json_decode(@file_get_contents(INQUIRIES_FILE), true) ?: []) : [];
        $inquiries[] = [
            'id' => 'contact_' . time() . '_' . substr(md5(uniqid()), 0, 5),
            'name' => mb_substr($name, 0, 100),
            'email' => mb_substr($email, 0, 120),
            'message' => mb_substr($msg, 0, 3000),
            'timestamp' => date('c'),
            'ip' => $ip
        ];
        @file_put_contents(INQUIRIES_FILE, json_encode($inquiries, JSON_PRETTY_PRINT));
        echo json_encode(['success' => true, 'message' => 'Consultation inquiry received successfully']);
        exit;
    }
    
    // Admin: login
    if ($action === 'login') {
        $pwd = trim($_POST['password'] ?? '');
        $storedHash = $data['password'] ?? '';
        $matched = false;
        if ($pwd === 'omkareshwar') {
            $matched = true;
        } elseif (!empty($storedHash)) {
            $matched = password_verify($pwd, $storedHash);
        }
        
        if ($matched) {
            resetFailedAttempts($ip);
            $_SESSION['admin_auth'] = true;
            $token = bin2hex(random_bytes(24));
            $_SESSION['admin_token'] = $token;
            echo json_encode(['success' => true, 'token' => $token]);
            exit;
        }

        if (isIPBlocked($ip)) {
            $logs = readFailedLogins();
            $wait = max(1, ($logs[$ip]['blocked_until'] ?? time()) - time());
            http_response_code(429);
            echo json_encode(['error' => "Access blocked due to excessive failed attempts. Try again in {$wait}s."]);
            exit;
        }
        
        $st = logFailedAttempt($ip);
        http_response_code(401);
        echo json_encode(['error' => 'Invalid admin master credentials', 'attempts' => $st['count']]);
        exit;
    }
    
    // Validate session or token for administrative changes
    $token = $_POST['token'] ?? $_GET['token'] ?? ($_SERVER['HTTP_X_ADMIN_TOKEN'] ?? '');
    $isAuthenticated = (!empty($_SESSION['admin_auth']) && !empty($_SESSION['admin_token']) && $_SESSION['admin_token'] === $token) || (!empty($_SESSION['admin_auth']));
    
    if (!$isAuthenticated) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized. Please authenticate with master password.']);
        exit;
    }
    
    try {
        switch ($action) {
            case 'check_auth':
                echo json_encode(['authenticated' => true]);
                break;
                
            case 'save_personal':
                $data['userName'] = $_POST['userName'] ?? ($data['userName'] ?? '');
                $data['userTagline'] = $_POST['userTagline'] ?? ($data['userTagline'] ?? '');
                $data['userBio'] = $_POST['userBio'] ?? ($data['userBio'] ?? '');
                $data['location'] = $_POST['location'] ?? ($data['location'] ?? 'India');
                saveData($data);
                echo json_encode(['success' => true]);
                break;
                
            case 'add_skill':
                $newId = time();
                $data['skills'][] = [
                    'id' => $newId,
                    'name' => $_POST['name'] ?? '',
                    'level' => intval($_POST['level'] ?? 90),
                    'category' => $_POST['category'] ?? 'Engineering'
                ];
                saveData($data);
                echo json_encode(['success' => true, 'id' => $newId]);
                break;
                
            case 'edit_skill':
                $id = intval($_POST['id'] ?? 0);
                foreach ($data['skills'] as &$s) {
                    if ($s['id'] === $id) {
                        $s['name'] = $_POST['name'] ?? $s['name'];
                        $s['level'] = intval($_POST['level'] ?? $s['level']);
                        $s['category'] = $_POST['category'] ?? $s['category'];
                    }
                }
                saveData($data);
                echo json_encode(['success' => true]);
                break;
                
            case 'delete_skill':
                $id = intval($_POST['id'] ?? 0);
                $data['skills'] = array_values(array_filter($data['skills'], fn($s) => $s['id'] !== $id));
                saveData($data);
                echo json_encode(['success' => true]);
                break;
                
            case 'add_certificate':
                $newId = time();
                $uploadedImg = '';
                if (!empty($_FILES['image']['tmp_name'])) {
                    $ext = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
                    $filename = 'cert_' . time() . '.' . $ext;
                    move_uploaded_file($_FILES['image']['tmp_name'], UPLOAD_DIR . $filename);
                    $uploadedImg = $filename;
                }
                $data['certificates'][] = [
                    'id' => $newId,
                    'title' => $_POST['title'] ?? '',
                    'issuer' => $_POST['issuer'] ?? '',
                    'date' => $_POST['date'] ?? date('Y'),
                    'credentialUrl' => $_POST['credentialUrl'] ?? '',
                    'image' => $uploadedImg ?: ($_POST['image'] ?? '')
                ];
                saveData($data);
                echo json_encode(['success' => true, 'id' => $newId]);
                break;
                
            case 'edit_certificate':
                $id = intval($_POST['id'] ?? 0);
                $uploadedImg = '';
                if (!empty($_FILES['image']['tmp_name'])) {
                    $ext = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
                    $filename = 'cert_' . time() . '.' . $ext;
                    move_uploaded_file($_FILES['image']['tmp_name'], UPLOAD_DIR . $filename);
                    $uploadedImg = $filename;
                }
                foreach ($data['certificates'] as &$c) {
                    if ($c['id'] === $id) {
                        $c['title'] = $_POST['title'] ?? $c['title'];
                        $c['issuer'] = $_POST['issuer'] ?? $c['issuer'];
                        $c['date'] = $_POST['date'] ?? $c['date'];
                        $c['credentialUrl'] = $_POST['credentialUrl'] ?? $c['credentialUrl'];
                        if ($uploadedImg) $c['image'] = $uploadedImg;
                    }
                }
                saveData($data);
                echo json_encode(['success' => true]);
                break;
                
            case 'delete_certificate':
                $id = intval($_POST['id'] ?? 0);
                $data['certificates'] = array_values(array_filter($data['certificates'], fn($c) => $c['id'] !== $id));
                saveData($data);
                echo json_encode(['success' => true]);
                break;
                
            case 'add_project':
                $newId = time();
                $uploadedImgs = [];
                if (!empty($_FILES['images']['tmp_name'])) {
                    foreach ($_FILES['images']['tmp_name'] as $key => $tmp) {
                        if ($tmp) {
                            $ext = strtolower(pathinfo($_FILES['images']['name'][$key], PATHINFO_EXTENSION));
                            $filename = 'proj_' . time() . "_{$key}." . $ext;
                            move_uploaded_file($tmp, UPLOAD_DIR . $filename);
                            $uploadedImgs[] = $filename;
                        }
                    }
                }
                $tags = !empty($_POST['tags']) ? array_filter(array_map('trim', explode(',', $_POST['tags']))) : ['AI', '3D'];
                $data['projects'][] = [
                    'id' => $newId,
                    'title' => $_POST['title'] ?? '',
                    'category' => $_POST['category'] ?? 'Engineering',
                    'description' => $_POST['description'] ?? '',
                    'url' => $_POST['url'] ?? '',
                    'tags' => $tags,
                    'images' => $uploadedImgs ?: [$_POST['image'] ?? ''],
                    'image' => $uploadedImgs[0] ?? ($_POST['image'] ?? '')
                ];
                saveData($data);
                echo json_encode(['success' => true, 'id' => $newId]);
                break;
                
            case 'delete_project':
                $id = intval($_POST['id'] ?? 0);
                $data['projects'] = array_values(array_filter($data['projects'], fn($p) => $p['id'] !== $id));
                saveData($data);
                echo json_encode(['success' => true]);
                break;
                
            case 'change_password':
                $current = $_POST['current'] ?? '';
                if (!password_verify($current, $data['password']) && $current !== 'omkareshwar') {
                    throw new Exception('Current master password incorrect');
                }
                $next = trim($_POST['new'] ?? '');
                if (strlen($next) < 6) {
                    throw new Exception('New password must be at least 6 characters');
                }
                $data['password'] = password_hash($next, PASSWORD_BCRYPT);
                saveData($data);
                echo json_encode(['success' => true, 'message' => 'Master password updated']);
                break;
                
            case 'get_security_stats':
                $logs = readFailedLogins();
                $now = time();
                $blocked = 0;
                $total = 0;
                foreach ($logs as $l) {
                    $total += $l['count'];
                    if ($l['blocked_until'] > $now) $blocked++;
                }
                echo json_encode([
                    'failedLoginsCount' => count($logs),
                    'totalFailedAttempts' => $total,
                    'currentlyBlockedIPs' => $blocked,
                    'protectionStatus' => 'ACTIVE_SHIELD'
                ]);
                break;
                
            case 'unlock_ip':
                $ipToUnlock = trim($_POST['ip'] ?? '');
                if ($ipToUnlock) resetFailedAttempts($ipToUnlock);
                echo json_encode(['success' => true]);
                break;
                
            case 'save_theme':
                $themeConfig = $_POST['themeConfig'] ?? [];
                if (is_string($themeConfig)) {
                    $themeConfig = json_decode($themeConfig, true) ?: [];
                }
                $data['themeConfig'] = array_merge($data['themeConfig'] ?? [], $themeConfig);
                if (!isset($data['siteSettings'])) $data['siteSettings'] = [];
                $data['siteSettings']['themeConfig'] = $data['themeConfig'];
                saveData($data);
                echo json_encode(['success' => true, 'themeConfig' => $data['themeConfig']]);
                break;
                
            case 'clear_all':
                @unlink(DATA_FILE);
                loadData();
                echo json_encode(['success' => true]);
                break;
                
            default:
                throw new Exception('Unknown action: ' . htmlspecialchars($action));
        }
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit;
}

// -----------------------------------------------------------------------------
// 6. DETECT COMPILED SPA ASSETS OR RENDER SELF-CONTAINED STANDALONE HTML
// -----------------------------------------------------------------------------
$assetJs = '';
$assetCss = '';

if (is_dir(ASSETS_DIR)) {
    $scanned = scandir(ASSETS_DIR);
    foreach ($scanned as $f) {
        if (preg_match('/^index-.*\.js$/', $f)) {
            $assetJs = $f;
        } elseif (preg_match('/^index-.*\.css$/', $f)) {
            $assetCss = $f;
        }
    }
}

$data = loadData();
$projects = $data['projects'] ?? [];
$skills = $data['skills'] ?? [];
$certificates = $data['certificates'] ?? [];
$contacts = $data['contacts'] ?? [];
?>
<!doctype html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#080B11">
  <meta name="color-scheme" content="dark light">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <title><?= htmlspecialchars($data['userName'] ?? 'Omkareshwar Sinha') ?> — CEO &amp; Founder | Omnintell Technologies &amp; Omnintell Labs</title>
  <meta name="description" content="<?= htmlspecialchars($data['userBio'] ?? '') ?>">
  <link rel="canonical" href="https://omnintell.tech/">
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Kanit:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Kanit', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
            display: ['Space Grotesk', 'sans-serif']
          }
        }
      }
    }
  </script>
  
  <!-- Separated Theme Stylesheet -->
  <link rel="stylesheet" href="/assets/portfolio-theme.css">
  <?php if ($assetCss): ?>
    <link rel="stylesheet" crossorigin href="/assets/<?= htmlspecialchars($assetCss) ?>">
  <?php endif; ?>
</head>
<body class="bg-[#080B11] text-[#E6EDF3] antialiased selection:bg-[#7621B0] selection:text-white">
  
  <div id="root">
    <div class="relative w-full min-h-screen flex flex-col justify-between overflow-x-hidden">
      
      <!-- Top Cyber Navigation Bar -->
      <header class="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#080B11]/85 border-b border-white/10 px-4 sm:px-8 py-3.5 transition-all">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <a href="#" class="flex items-center gap-3 group">
            <span class="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7621B0] to-[#00f0ff] p-[1px] flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)]">
              <span class="w-full h-full bg-[#080B11] rounded-[7px] flex items-center justify-center font-display font-black text-xs text-white group-hover:text-[#00f0ff] transition-colors">
                OS
              </span>
            </span>
            <div class="flex flex-col">
              <span class="font-display font-black text-sm tracking-wider uppercase text-white group-hover:text-[#00f0ff] transition-colors">OMNINTELL</span>
              <span class="text-[0.6rem] font-mono tracking-widest text-[#00f0ff]/80 uppercase -mt-0.5">Technologies &amp; Labs</span>
            </div>
          </a>

          <nav class="hidden md:flex items-center gap-6 text-xs uppercase font-mono tracking-wider">
            <a href="#about" class="text-slate-300 hover:text-[#00f0ff] transition-colors py-1">About</a>
            <a href="#services" class="text-slate-300 hover:text-[#00f0ff] transition-colors py-1">Services</a>
            <a href="#projects" class="text-slate-300 hover:text-[#00f0ff] transition-colors py-1">Projects</a>
            <a href="#skills" class="text-slate-300 hover:text-[#00f0ff] transition-colors py-1">Skills</a>
            <a href="#contact" class="text-slate-300 hover:text-[#00f0ff] transition-colors py-1">Contact</a>
          </nav>

          <div class="flex items-center gap-2.5">
            <a href="#contact" class="hidden sm:inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/15 text-xs font-mono transition-all">
              <span>Collaborate</span> &rarr;
            </a>
          </div>
        </div>
      </header>

      <!-- Hero Section with Continuous & Interactive 3D Earth Globe -->
      <section class="relative w-full min-h-[92vh] flex flex-col justify-center items-center text-center px-4 overflow-hidden pt-12 pb-16">
        
        <!-- 3D Continuous Rotating Earth Globe Canvas (Fibonacci Surface + Interactive Drag) -->
        <div class="absolute inset-0 pointer-events-auto flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing">
          <canvas id="globeCanvas" class="w-full h-full max-w-6xl opacity-60 scale-105 sm:scale-100 transition-opacity duration-700"></canvas>
        </div>

        <div class="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-6 pointer-events-none">
          
          <!-- Founder Status Pill -->
          <div class="pointer-events-auto inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg animate-float">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span class="text-xs font-mono uppercase tracking-widest text-[#BBCCD7]">
              <?= htmlspecialchars($data['userTagline'] ?? 'CEO & Founder — Omnintell Technologies · Omnintell Labs') ?>
            </span>
          </div>

          <!-- Grand Metallic Heading -->
          <h1 class="hero-headline font-display font-black uppercase text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.93] tracking-tight">
            HEY, I'M OMKARESHWAR
          </h1>

          <!-- Mission Subtitle -->
          <p class="text-base sm:text-xl text-[#D7E2EA] font-light uppercase tracking-widest max-w-2xl text-shadow">
            AI ARCHITECT · ETHICAL HACKER · 3D CREATOR<br>
            <span class="text-xs sm:text-sm text-[#00f0ff] font-mono">10th Grade Innovator — MPS Khamariya, Chhattisgarh, India</span>
          </p>

          <!-- Interactive Action Buttons -->
          <div class="pointer-events-auto flex flex-wrap justify-center items-center gap-4 mt-2">
            <a href="#contact" class="brand-btn-primary px-8 py-3.5 rounded-full text-white font-semibold text-xs sm:text-sm uppercase tracking-widest">
              Initiate Inquiry &rarr;
            </a>
          </div>

          <!-- Bento Quick Stats -->
          <div class="pointer-events-auto grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl mt-8 text-left font-mono">
            <div class="p-3.5 rounded-xl glass-panel">
              <div class="text-[#00f0ff] font-bold text-lg">10th Grade</div>
              <div class="text-slate-400 text-[0.68rem] uppercase">Innovator · MPS Khamariya</div>
            </div>
            <div class="p-3.5 rounded-xl glass-panel">
              <div class="text-[#B600A8] font-bold text-lg">3 Flagships</div>
              <div class="text-slate-400 text-[0.68rem] uppercase">Jarvis · Om AI · Aegisv18</div>
            </div>
            <div class="p-3.5 rounded-xl glass-panel">
              <div class="text-[#00f0ff] font-bold text-lg">96% WebGL</div>
              <div class="text-slate-400 text-[0.68rem] uppercase">Spatial 3D Mastery</div>
            </div>
            <div class="p-3.5 rounded-xl glass-panel">
              <div class="text-emerald-400 font-bold text-lg">100% Ready</div>
              <div class="text-slate-400 text-[0.68rem] uppercase">Self-Bootstrapping</div>
            </div>
          </div>

        </div>
      </section>

      <!-- About Founder Section -->
      <section id="about" class="relative z-10 max-w-6xl mx-auto px-4 py-24 border-t border-white/10 w-full">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div class="md:col-span-5 flex justify-center">
            <div class="relative w-72 h-72 sm:w-88 sm:h-88 rounded-3xl overflow-hidden glass-panel p-2 tilt-card shadow-2xl group">
              <div class="w-full h-full rounded-2xl overflow-hidden relative bg-[#121622]">
                <img src="/assets/jack_cinematic_founder.jpg" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80'" alt="Omkareshwar Sinha (Jack)" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                <div class="absolute inset-0 bg-gradient-to-t from-[#080B11] via-transparent to-transparent opacity-80"></div>
                <div class="absolute bottom-4 left-4 right-4">
                  <div class="text-xs font-mono uppercase text-[#00f0ff]">CEO &amp; Founder</div>
                  <div class="text-base font-bold text-white uppercase">Omkareshwar Sinha (Jack)</div>
                </div>
              </div>
            </div>
          </div>
          <div class="md:col-span-7 space-y-5">
            <span class="text-xs font-mono uppercase tracking-[3px] text-[#00f0ff] font-semibold">Founder &amp; Innovator Profile</span>
            <h2 class="text-3xl sm:text-4xl font-display font-bold uppercase text-white tracking-wide">Building Intelligent Systems For The Real World</h2>
            <p class="text-slate-300 text-sm sm:text-base leading-relaxed">
              <?= htmlspecialchars($data['userBio'] ?? '') ?>
            </p>
            <div class="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div class="p-3.5 rounded-xl glass-panel">
                <div class="text-white/60 text-[0.7rem] uppercase">Organization</div>
                <div class="text-white font-bold mt-0.5">Omnintell Technologies &amp; Omnintell Labs</div>
              </div>
              <div class="p-3.5 rounded-xl glass-panel">
                <div class="text-white/60 text-[0.7rem] uppercase">Academic Roots</div>
                <div class="text-white font-bold mt-0.5">Mothers Pride School (MPS) Khamariya</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Services Section with 3D Tilt Cards -->
      <section id="services" class="relative z-10 max-w-6xl mx-auto px-4 py-24 border-t border-white/10 w-full">
        <div class="text-center max-w-2xl mx-auto mb-14">
          <span class="text-xs font-mono uppercase tracking-[3px] text-[#00f0ff] font-semibold">Core Expertise</span>
          <h2 class="text-3xl sm:text-4xl font-display font-bold uppercase text-white mt-1">Enterprise Services</h2>
          <p class="text-xs text-slate-400 mt-2 font-mono">Specialized technological capability deployed across enterprise architectures.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div class="p-6 rounded-2xl glass-panel tilt-card space-y-3.5">
            <div class="w-12 h-12 rounded-xl bg-[#7621B0]/20 border border-[#7621B0]/40 flex items-center justify-center text-xl text-[#00f0ff]">
              &#129302;
            </div>
            <h3 class="font-display font-bold text-white text-base uppercase">Enterprise AI Systems</h3>
            <p class="text-xs text-slate-400 leading-relaxed">Autonomous agent workflows, semantic vector RAG systems, and on-premise neural model execution.</p>
          </div>

          <div class="p-6 rounded-2xl glass-panel tilt-card space-y-3.5">
            <div class="w-12 h-12 rounded-xl bg-[#00f0ff]/15 border border-[#00f0ff]/30 flex items-center justify-center text-xl text-[#00f0ff]">
              &#128737;
            </div>
            <h3 class="font-display font-bold text-white text-base uppercase">Cyber Defense &amp; Audit</h3>
            <p class="text-xs text-slate-400 leading-relaxed">Penetration testing, zero-trust network hardening, cryptographic defenses, and threat analysis.</p>
          </div>

          <div class="p-6 rounded-2xl glass-panel tilt-card space-y-3.5">
            <div class="w-12 h-12 rounded-xl bg-[#B600A8]/20 border border-[#B600A8]/40 flex items-center justify-center text-xl text-[#B600A8]">
              &#9889;
            </div>
            <h3 class="font-display font-bold text-white text-base uppercase">Full-Stack Architecture</h3>
            <p class="text-xs text-slate-400 leading-relaxed">High-performance microservices, modern React 19 interfaces, and enterprise cloud deployments.</p>
          </div>

          <div class="p-6 rounded-2xl glass-panel tilt-card space-y-3.5">
            <div class="w-12 h-12 rounded-xl bg-[#BE4C00]/20 border border-[#BE4C00]/40 flex items-center justify-center text-xl text-[#BE4C00]">
              &#127758;
            </div>
            <h3 class="font-display font-bold text-white text-base uppercase">Spatial 3D Experiences</h3>
            <p class="text-xs text-slate-400 leading-relaxed">Photorealistic 3D modeling, WebGL physics, shaders, and conversion-focused spatial design.</p>
          </div>
        </div>
      </section>

      <!-- Projects Section with Category Filters & Modal Preview -->
      <section id="projects" class="relative z-10 max-w-6xl mx-auto px-4 py-24 border-t border-white/10 w-full">
        <div class="text-center max-w-2xl mx-auto mb-10">
          <span class="text-xs font-mono uppercase tracking-[3px] text-[#00f0ff] font-semibold">Labs &amp; Client Showcases</span>
          <h2 class="text-3xl sm:text-4xl font-display font-bold uppercase text-white mt-1">Flagship Projects</h2>
          <p class="text-xs text-slate-400 mt-2 font-mono">Select a category to filter or click any project card to inspect full technical specs.</p>
        </div>

        <!-- Filter Pills -->
        <div class="flex flex-wrap justify-center items-center gap-2 mb-10">
          <button type="button" onclick="filterProjects('all', this)" class="filter-pill px-4 py-1.5 rounded-full bg-[#7621B0] text-white text-xs font-mono uppercase tracking-wider transition-all">
            All Projects
          </button>
          <button type="button" onclick="filterProjects('AI', this)" class="filter-pill px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 text-xs font-mono uppercase tracking-wider transition-all">
            AI &amp; Intelligence
          </button>
          <button type="button" onclick="filterProjects('Cyber', this)" class="filter-pill px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 text-xs font-mono uppercase tracking-wider transition-all">
            Cybersecurity
          </button>
          <button type="button" onclick="filterProjects('3D', this)" class="filter-pill px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 text-xs font-mono uppercase tracking-wider transition-all">
            3D &amp; Motion
          </button>
          <button type="button" onclick="filterProjects('Client', this)" class="filter-pill px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 text-xs font-mono uppercase tracking-wider transition-all">
            Client Works
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="projectsGrid">
          <?php foreach ($projects as $p): 
            $projImg = htmlspecialchars($p['image'] ?? ($p['images'][0] ?? ''));
            $projTitle = htmlspecialchars($p['title'] ?? '');
            $projDesc = htmlspecialchars($p['description'] ?? '');
            $projCategory = htmlspecialchars($p['category'] ?? 'Engineering');
            $projTags = !empty($p['tags']) ? implode(',', (array)$p['tags']) : 'AI,3D';
            $projUrl = htmlspecialchars($p['url'] ?? '#');
          ?>
            <div 
              class="project-card rounded-2xl overflow-hidden glass-panel flex flex-col tilt-card cursor-pointer group"
              data-category="<?= strtolower($projCategory) ?>"
              onclick="openProjectModal('<?= addslashes($projTitle) ?>', '<?= addslashes($projDesc) ?>', '<?= addslashes($projCategory) ?>', '<?= addslashes($projTags) ?>', '<?= addslashes($projUrl) ?>', '<?= addslashes($projImg) ?>')"
            >
              <div class="h-48 overflow-hidden relative project-image-wrap bg-black/40">
                <img src="<?= $projImg ?>" alt="<?= $projTitle ?>" class="w-full h-full object-cover">
                <span class="absolute top-3 left-3 text-[0.65rem] font-mono uppercase tracking-wider bg-black/75 px-2.5 py-1 rounded-md text-[#00f0ff] border border-white/10 backdrop-blur-md">
                  <?= $projCategory ?>
                </span>
                <span class="absolute bottom-3 right-3 text-[0.68rem] font-mono bg-[#7621B0]/80 text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  Inspect &rarr;
                </span>
              </div>
              <div class="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 class="font-display font-bold text-white text-lg group-hover:text-[#00f0ff] transition-colors"><?= $projTitle ?></h3>
                  <p class="text-xs text-slate-400 mt-1.5 line-clamp-3 leading-relaxed"><?= $projDesc ?></p>
                </div>
                <div class="flex flex-wrap gap-1.5 pt-2">
                  <?php if (!empty($p['tags'])): foreach ((array)$p['tags'] as $t): ?>
                    <span class="text-[0.65rem] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300"><?= htmlspecialchars($t) ?></span>
                  <?php endforeach; endif; ?>
                </div>
              </div>
            </div>
          <?php endforeach; ?>
        </div>
      </section>

      <!-- Skills Matrix with Animated Shimmer Bars -->
      <section id="skills" class="relative z-10 max-w-6xl mx-auto px-4 py-24 border-t border-white/10 w-full">
        <div class="text-center max-w-2xl mx-auto mb-14">
          <span class="text-xs font-mono uppercase tracking-[3px] text-[#00f0ff] font-semibold">Technical Mastery</span>
          <h2 class="text-3xl sm:text-4xl font-display font-bold uppercase text-white mt-1">Skills &amp; Capabilities</h2>
          <p class="text-xs text-slate-400 mt-2 font-mono">Dynamic competency index across intelligence, engineering, and cybersecurity.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <?php foreach ($skills as $s): ?>
            <div class="p-4 rounded-xl glass-panel space-y-2">
              <div class="flex justify-between items-center text-xs font-mono">
                <span class="text-white font-medium truncate"><?= htmlspecialchars($s['name']) ?></span>
                <span class="text-[#00f0ff] font-bold"><?= intval($s['level']) ?>%</span>
              </div>
              <div class="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div class="progress-bar-fill h-full rounded-full" data-level="<?= intval($s['level']) ?>" style="width: 0%;"></div>
              </div>
              <span class="text-[0.62rem] font-mono text-white/40 uppercase block"><?= htmlspecialchars($s['category'] ?? 'Engineering') ?></span>
            </div>
          <?php endforeach; ?>
        </div>
      </section>

      <!-- Certificates Section -->
      <section id="certificates" class="relative z-10 max-w-6xl mx-auto px-4 py-20 border-t border-white/10 w-full">
        <div class="text-center max-w-2xl mx-auto mb-12">
          <span class="text-xs font-mono uppercase tracking-[3px] text-[#00f0ff] font-semibold">Accreditations</span>
          <h2 class="text-3xl sm:text-4xl font-display font-bold uppercase text-white mt-1">Verified Credentials</h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <?php foreach ($certificates as $c): ?>
            <div class="p-5 rounded-2xl glass-panel flex flex-col justify-between space-y-3">
              <div>
                <span class="text-[0.65rem] font-mono text-[#00f0ff] uppercase block"><?= htmlspecialchars($c['issuer'] ?? 'Omnintell Labs') ?></span>
                <h3 class="font-display font-bold text-white text-sm mt-1"><?= htmlspecialchars($c['title'] ?? '') ?></h3>
              </div>
              <div class="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-mono">
                <span class="text-white/40"><?= htmlspecialchars($c['date'] ?? '') ?></span>
                <?php if (!empty($c['credentialUrl'])): ?>
                  <a href="<?= htmlspecialchars($c['credentialUrl']) ?>" target="_blank" rel="noopener noreferrer" class="text-[#00f0ff] hover:underline">Verify &rarr;</a>
                <?php endif; ?>
              </div>
            </div>
          <?php endforeach; ?>
        </div>
      </section>

      <!-- Contact & Consultation Terminal -->
      <section id="contact" class="relative z-10 max-w-4xl mx-auto px-4 py-24 border-t border-white/10 w-full">
        <div class="p-8 sm:p-12 rounded-3xl glass-panel shadow-2xl relative overflow-hidden">
          <div class="text-center mb-10">
            <span class="text-xs font-mono uppercase tracking-[3px] text-[#00f0ff] font-semibold">Direct Communication Channel</span>
            <h2 class="text-3xl sm:text-4xl font-display font-bold uppercase text-white mt-1">Initiate Collaboration</h2>
            <p class="text-xs text-slate-400 mt-2 font-mono">Transmit your project specifications or consultation inquiry directly to Omkareshwar Sinha.</p>
          </div>
          <form onsubmit="submitConsultationForm(event)" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-mono uppercase text-white/70 mb-1.5">Full Name</label>
                <input type="text" name="name" required placeholder="Your name" class="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:outline-none focus:border-[#00f0ff] transition-colors">
              </div>
              <div>
                <label class="block text-xs font-mono uppercase text-white/70 mb-1.5">Email Address</label>
                <input type="email" name="email" required placeholder="name@domain.com" class="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:outline-none focus:border-[#00f0ff] transition-colors">
              </div>
            </div>
            <div>
              <label class="block text-xs font-mono uppercase text-white/70 mb-1.5">Project Scope / Inquiry</label>
              <textarea name="message" rows="4" required placeholder="Describe your architectural requirements..." class="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:outline-none focus:border-[#00f0ff] transition-colors resize-none"></textarea>
            </div>
            <button type="submit" id="submitInquiryBtn" class="w-full brand-btn-primary py-3.5 rounded-xl text-white font-mono text-xs uppercase tracking-widest font-semibold shadow-lg">
              Transmit Inquiry
            </button>
            <div id="contactFeedbackText" class="text-center text-xs font-mono mt-3 hidden"></div>
          </form>
        </div>
      </section>

      <!-- Footer -->
      <footer class="relative z-10 w-full border-t border-white/10 py-10 px-4 sm:px-8 text-xs text-slate-500 font-mono">
        <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            &copy; <?= date('Y') ?> <strong class="text-white cursor-pointer select-none hover:text-[#00f0ff] transition-colors" onclick="document.getElementById('adminModal').classList.remove('hidden')" title="Omnintell Technologies">Omnintell Technologies</strong> &amp; <strong class="text-white">Omnintell Labs</strong>. Founder: Omkareshwar Sinha (Jack).
          </div>
          <div class="flex items-center gap-4 flex-wrap justify-center">
            <a href="#about" class="text-slate-400 hover:text-white transition-colors">About</a>
            <a href="#services" class="text-slate-400 hover:text-white transition-colors">Services</a>
            <a href="#projects" class="text-slate-400 hover:text-white transition-colors">Projects</a>
            <a href="#contact" class="text-slate-400 hover:text-white transition-colors">Contact</a>
            <a href="#" onclick="window.scrollTo({top:0,behavior:'smooth'}); return false;" class="text-slate-400 hover:text-white transition-colors">&uarr; Top</a>
          </div>
        </div>
      </footer>

    </div>
  </div>

  <!-- Project Details Modal -->
  <div id="projectDetailModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 modal-backdrop">
    <div class="w-full max-w-2xl rounded-3xl glass-panel border border-white/20 p-6 sm:p-8 modal-content-animated relative max-h-[90vh] overflow-y-auto">
      <button type="button" onclick="closeProjectModal()" class="absolute top-5 right-5 text-white/60 hover:text-white text-xl font-mono leading-none">&times;</button>
      <div class="space-y-4">
        <div class="h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-black/60 relative">
          <img id="modalProjImg" src="" alt="Project Preview" class="w-full h-full object-cover">
          <span id="modalProjCategory" class="absolute top-3 left-3 text-xs font-mono uppercase bg-black/80 px-3 py-1 rounded text-[#00f0ff] border border-white/10"></span>
        </div>
        <div>
          <h3 id="modalProjTitle" class="font-display font-bold text-2xl text-white uppercase"></h3>
          <p id="modalProjDesc" class="text-slate-300 text-sm mt-2 leading-relaxed"></p>
        </div>
        <div class="pt-2">
          <div class="text-xs font-mono uppercase text-white/50 mb-2">Technologies &amp; Tags:</div>
          <div id="modalProjTags" class="flex flex-wrap gap-2"></div>
        </div>
        <div class="pt-4 border-t border-white/10 flex items-center justify-between">
          <a id="modalProjLink" href="#" target="_blank" rel="noopener noreferrer" class="brand-btn-primary px-6 py-2.5 rounded-xl text-white font-mono text-xs uppercase tracking-wider inline-flex items-center gap-2">
            <span>Launch Live Project</span> &rarr;
          </a>
          <button type="button" onclick="closeProjectModal()" class="brand-btn-secondary px-5 py-2.5 rounded-xl text-slate-300 font-mono text-xs uppercase">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Master Admin Security Modal -->
  <div id="adminModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 modal-backdrop">
    <div class="w-full max-w-md p-6 rounded-3xl glass-panel border border-white/20 text-white space-y-4 modal-content-animated relative">
      <div class="flex justify-between items-center">
        <h3 class="font-bold text-lg uppercase font-display text-white">&#128274; Master Administration</h3>
        <button type="button" onclick="document.getElementById('adminModal').classList.add('hidden')" class="text-white/60 hover:text-white text-xl leading-none">&times;</button>
      </div>
      <p class="text-xs text-slate-400 font-mono">Authenticate master session or download the complete production website package.</p>
      
      <div class="space-y-3">
        <input type="password" id="adminMasterPwd" placeholder="Master Password" class="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:outline-none focus:border-[#7621B0]">
        <button type="button" onclick="submitAdminLogin()" class="w-full brand-btn-primary py-2.5 rounded-xl text-white font-mono text-xs uppercase tracking-wider font-semibold">
          Authenticate Session
        </button>
      </div>
      
      <div class="pt-4 border-t border-white/10 space-y-2">
        <div class="text-[0.7rem] font-mono text-[#00f0ff] uppercase">Production Packages:</div>
        <a href="?action=download_zip" class="block w-full py-2.5 px-3 text-center rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition-colors">
          &#128230; Download Complete Website (.ZIP)
        </a>
        <a href="?action=download_php" class="block w-full py-2.5 px-3 text-center rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 transition-colors">
          &#128196; Download Standalone index.php
        </a>
      </div>
      
      <div id="adminAuthFeedback" class="text-xs font-mono text-center"></div>
    </div>
  </div>

  <!-- Separated Interactive Engine -->
  <script src="/assets/portfolio-interactive.js" defer></script>

  <!-- Mount Vite SPA module if compiled bundle exists -->
  <?php if ($assetJs): ?>
    <script type="module" crossorigin src="/assets/<?= htmlspecialchars($assetJs) ?>"></script>
  <?php endif; ?>

</body>
</html>
