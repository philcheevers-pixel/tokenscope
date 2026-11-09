<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(array('ok' => false, 'error' => 'POST only.'));
    exit;
}
$dir = __DIR__ . '/backups';
if (!is_dir($dir) && !mkdir($dir, 0755, true)) {
    http_response_code(500);
    echo json_encode(array('ok' => false, 'error' => 'Could not create backups directory.'));
    exit;
}
$deny = $dir . '/.htaccess';
if (!is_file($deny)) {
    @file_put_contents($deny, "Require all denied\n");
}
$src = __DIR__ . '/tasks.json';
if (!is_file($src)) {
    http_response_code(500);
    echo json_encode(array('ok' => false, 'error' => 'tasks.json missing.'));
    exit;
}
$lock = __DIR__ . '/tasks.lock';
$tries = 0;
while (!@mkdir($lock)) {
    $tries++;
    if ($tries > 40) {
        if (is_dir($lock) && (time() - (int) @filemtime($lock)) > 180) {
            @rmdir($lock);
            continue;
        }
        http_response_code(409);
        echo json_encode(array('ok' => false, 'error' => 'Lock busy.'));
        exit;
    }
    usleep(50000);
}
try {
    $stamp = gmdate('Ymd-His');
    $dest = $dir . '/tasks-' . $stamp . '.json';
    if (!copy($src, $dest)) {
        http_response_code(500);
        echo json_encode(array('ok' => false, 'error' => 'Copy failed.'));
        exit;
    }
    $files = glob($dir . '/tasks-*.json');
    rsort($files);
    foreach (array_slice($files, 40) as $old) {
        @unlink($old);
    }
    echo json_encode(array('ok' => true, 'file' => basename($dest), 'kept' => min(40, count($files))));
} finally {
    @rmdir($lock);
}
