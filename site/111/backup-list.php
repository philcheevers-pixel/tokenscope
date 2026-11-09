<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(array('ok' => false, 'error' => 'GET only.'));
    exit;
}
$dir = __DIR__ . '/backups';
$files = is_dir($dir) ? glob($dir . '/tasks-*.json') : array();
if (!$files) {
    $files = array();
}
rsort($files);
$out = array();
foreach (array_slice($files, 0, 20) as $path) {
    $out[] = array(
        'file' => basename($path),
        'bytes' => filesize($path),
        'mtime' => gmdate('c', filemtime($path))
    );
}
echo json_encode(array('ok' => true, 'backups' => $out, 'count' => count($files)));
