<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
$path = __DIR__ . '/say.txt';
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $text = is_file($path) ? file_get_contents($path) : '';
    echo json_encode(array('ok' => true, 'text' => (string) $text));
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(array('ok' => false, 'error' => 'GET or POST.'));
    exit;
}
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data) || !array_key_exists('text', $data) || !is_string($data['text'])) {
    http_response_code(400);
    echo json_encode(array('ok' => false, 'error' => 'text string required.'));
    exit;
}
$text = $data['text'];
if (strlen($text) > 2000) {
    $text = substr($text, 0, 2000);
}
if (file_put_contents($path, $text, LOCK_EX) === false) {
    http_response_code(500);
    echo json_encode(array('ok' => false, 'error' => 'Could not write say.txt.'));
    exit;
}
echo json_encode(array('ok' => true, 'bytes' => strlen($text)));
