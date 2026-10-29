<?php
/**
 * Dictio translation proxy for /910/translate.php.
 *
 * No API key lives in this file. The test engine is MyMemory (no key).
 * Google Cloud Translation is intentionally not called.
 *
 * Optional, server-side only (never put these in the HTML):
 *   DICTIO_MYMEMORY_EMAIL  a contact email. MyMemory raises the free
 *                          quota from about 5,000 to about 50,000
 *                          characters a day when this is set.
 *
 * Limits of the anonymous test engine:
 *   - about 5,000 characters per day per IP
 *   - 500 characters / 500 bytes maximum per request
 *   - this script chunks at 450 bytes
 *   - passages over 4,500 characters are refused
 *   - rare ISO codes may return "no content"
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

const ENGINE_NAME = 'MyMemory';
const ENGINE_LABEL = 'test translation engine';
const MAX_CHARS = 4500;
const CHUNK_BYTES = 450;
const UPSTREAM = 'https://api.mymemory.translated.net/get';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    respond(['ok' => false, 'error' => 'Send a POST body: {"text","source","target"}']);
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$host = $_SERVER['HTTP_HOST'] ?? '';
if ($origin !== '' && $host !== '' && stripos($origin, '://' . $host) === false) {
    http_response_code(403);
    respond(['ok' => false, 'error' => 'This proxy only accepts requests from this site.']);
}

$raw = file_get_contents('php://input');
$body = json_decode($raw === false ? '' : $raw, true);
if (!is_array($body)) {
    http_response_code(400);
    respond(['ok' => false, 'error' => 'The body has to be JSON.']);
}

$text = $body['text'] ?? '';
$source = isset($body['source']) ? (string) $body['source'] : 'auto';
$target = isset($body['target']) ? (string) $body['target'] : '';

if (!is_string($text) || trim($text) === '') {
    http_response_code(400);
    respond(['ok' => false, 'error' => 'Paste some text first.']);
}
if (char_len($text) > MAX_CHARS) {
    http_response_code(400);
    respond([
        'ok' => false,
        'error' => 'This passage is ' . char_len($text) . ' characters. The test translation engine allows about 5,000 characters a day and 500 per request. Keep this test under ' . MAX_CHARS . ' characters.',
    ]);
}
if (!valid_code($target)) {
    http_response_code(400);
    respond(['ok' => false, 'error' => 'Pick a target language.']);
}
if ($source !== 'auto' && !valid_code($source)) {
    http_response_code(400);
    respond(['ok' => false, 'error' => 'Pick a source language or leave it on auto-detect.']);
}
if ($source !== 'auto' && same_lang($source, $target)) {
    http_response_code(400);
    respond(['ok' => false, 'error' => 'Source and target are the same language. Pick a different target.']);
}

$email = getenv('DICTIO_MYMEMORY_EMAIL') ?: '';
if ($email !== '' && filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    $email = '';
}

$groups = plan_chunks($text, CHUNK_BYTES);
$flatCount = 0;
foreach ($groups as $group) {
    $flatCount += count($group);
}
if ($flatCount > 16) {
    http_response_code(400);
    respond(['ok' => false, 'error' => 'That passage needs too many requests for the test translation engine. Shorten it.']);
}

$detected = null;
$pairSource = $source === 'auto' ? 'Autodetect' : $source;
$outParas = [];

foreach ($groups as $group) {
    $pieces = [];
    foreach ($group as $chunk) {
        if (strlen($chunk) > 480) {
            http_response_code(500);
            respond(['ok' => false, 'error' => 'The chunker built a piece over the test engine limit.']);
        }
        $translated = call_mymemory($chunk, $pairSource, $target, $email, $detected);
        if (isset($translated['error'])) {
            $code = !empty($translated['limited']) ? 429 : 502;
            http_response_code($code);
            respond(['ok' => false, 'error' => $translated['error'], 'engine' => ENGINE_NAME, 'engineLabel' => ENGINE_LABEL]);
        }
        if ($detected === null && !empty($translated['detected'])) {
            $detected = $translated['detected'];
            if (same_lang($detected, $target)) {
                http_response_code(400);
                respond(['ok' => false, 'error' => 'This text already looks like the target language. Pick a different target.']);
            }
            if (valid_code($detected)) {
                $pairSource = $detected;
            }
        }
        $pieces[] = $translated['text'];
    }
    $outParas[] = implode(' ', $pieces);
}

respond([
    'ok' => true,
    'translation' => implode("\n\n", $outParas),
    'engine' => ENGINE_NAME,
    'engineLabel' => ENGINE_LABEL,
    'detectedSource' => $detected,
    'chunks' => $flatCount,
    'via' => 'proxy',
]);

function respond(array $payload): void
{
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function valid_code(string $code): bool
{
    return (bool) preg_match('/^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})?$/', $code);
}

function same_lang(string $a, string $b): bool
{
    $a = strtolower($a);
    $b = strtolower($b);
    if ($a === $b) {
        return true;
    }
    if (strpos($a, '-') !== false || strpos($b, '-') !== false) {
        return false;
    }
    return explode('-', $a)[0] === explode('-', $b)[0];
}

function char_len(string $s): int
{
    if (function_exists('mb_strlen')) {
        return mb_strlen($s, 'UTF-8');
    }
    $n = preg_match_all('/./u', $s, $m);
    return $n === false ? strlen($s) : $n;
}

function plan_chunks(string $text, int $max): array
{
    $paragraphs = preg_split("/\n{2,}/", trim($text)) ?: [];
    $groups = [];
    foreach ($paragraphs as $paragraph) {
        $paragraph = trim($paragraph);
        if ($paragraph === '') {
            continue;
        }
        $groups[] = pack_paragraph($paragraph, $max);
    }
    return $groups;
}

function pack_paragraph(string $paragraph, int $max): array
{
    if (strlen($paragraph) <= $max) {
        return [$paragraph];
    }
    $sentences = split_sentences($paragraph);
    $out = [];
    $cur = '';
    foreach ($sentences as $sentence) {
        if (strlen($sentence) > $max) {
            if ($cur !== '') {
                $out[] = $cur;
                $cur = '';
            }
            foreach (hard_wrap($sentence, $max) as $piece) {
                $out[] = $piece;
            }
            continue;
        }
        $next = $cur === '' ? $sentence : $cur . ' ' . $sentence;
        if (strlen($next) <= $max) {
            $cur = $next;
        } else {
            if ($cur !== '') {
                $out[] = $cur;
            }
            $cur = $sentence;
        }
    }
    if ($cur !== '') {
        $out[] = $cur;
    }
    return $out;
}

function split_sentences(string $text): array
{
    $ok = preg_match_all('/.+?(?:[.!?。！？](?=\s|$)|$)/su', $text, $m);
    if (!$ok || empty($m[0])) {
        return [$text];
    }
    $parts = [];
    foreach ($m[0] as $part) {
        $part = trim($part);
        if ($part !== '') {
            $parts[] = $part;
        }
    }
    return $parts ?: [$text];
}

function hard_wrap(string $s, int $max): array
{
    $out = [];
    while ($s !== '') {
        if (strlen($s) <= $max) {
            $out[] = $s;
            break;
        }
        $cut = take_prefix_len($s, $max);
        $window = substr($s, 0, $cut);
        $space = strrpos($window, ' ');
        if ($space !== false && $space > 40) {
            $cut = $space;
        }
        if ($cut < 1) {
            $cut = 1;
        }
        $piece = trim(substr($s, 0, $cut));
        if ($piece !== '') {
            $out[] = $piece;
        }
        $s = trim(substr($s, $cut));
    }
    return $out;
}

function take_prefix_len(string $s, int $max): int
{
    $cut = min($max, strlen($s));
    if ($cut >= strlen($s)) {
        return strlen($s);
    }
    while ($cut > 0 && (ord($s[$cut]) & 0xC0) === 0x80) {
        $cut--;
    }
    return max(1, $cut);
}

/**
 * @return array{text?:string,detected?:string,error?:string,limited?:bool}
 */
function call_mymemory(string $chunk, string $source, string $target, string $email, ?string $detected): array
{
    $params = [
        'q' => $chunk,
        'langpair' => $source . '|' . $target,
        'mt' => '1',
    ];
    if ($email !== '') {
        $params['de'] = $email;
    }
    $url = UPSTREAM . '?' . http_build_query($params);
    [$code, $body, $err] = http_get($url);
    if ($body === '') {
        return ['error' => 'Could not reach the test translation engine.' . ($err !== '' ? ' ' . $err : ''), 'limited' => false];
    }
    $data = json_decode($body, true);
    if (!is_array($data)) {
        return ['error' => 'The test translation engine returned something that was not JSON.', 'limited' => false];
    }
    $problem = mymemory_problem($data, $code);
    if ($problem !== null) {
        return $problem;
    }
    $translated = (string) ($data['responseData']['translatedText'] ?? '');
    $found = $data['responseData']['detectedLanguage'] ?? $detected;
    return [
        'text' => $translated,
        'detected' => is_string($found) ? $found : null,
    ];
}

/**
 * @return array{error:string,limited:bool}|null
 */
function mymemory_problem(array $data, int $httpCode): ?array
{
    $details = (string) ($data['responseDetails'] ?? '');
    $text = (string) ($data['responseData']['translatedText'] ?? '');
    $blob = $details . ' ' . $text;
    $status = (int) ($data['responseStatus'] ?? 0);
    $limited = !empty($data['quotaFinished'])
        || $httpCode === 429
        || (bool) preg_match('/MYMEMORY WARNING|YOU USED ALL|QUOTA|TOO MANY REQUESTS/i', $blob);

    if (preg_match('/QUERY LENGTH/i', $blob)) {
        return ['error' => 'The test translation engine rejected a chunk as too long (max 500 characters).', 'limited' => false];
    }
    if ($limited) {
        return ['error' => 'The test translation engine hit its daily limit (about 5,000 characters from this network). Try a shorter passage later.', 'limited' => true];
    }
    if ($status !== 200 || $httpCode >= 400) {
        if (preg_match('/INVALID SOURCE|INVALID TARGET|NO CONTENT|NOT SUPPORTED|IS AN INVALID/i', $blob)) {
            return ['error' => 'The test translation engine does not support that language pair. Pick a more common language.', 'limited' => false];
        }
        $msg = trim($details) !== '' ? trim($details) : 'The test translation engine failed.';
        return ['error' => $msg, 'limited' => false];
    }
    if (trim($text) === '') {
        return ['error' => 'The test translation engine returned an empty translation.', 'limited' => false];
    }
    return null;
}

/**
 * @return array{0:int,1:string,2:string}
 */
function http_get(string $url): array
{
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 25,
            CURLOPT_FOLLOWLOCATION => false,
        ]);
        $body = curl_exec($ch);
        $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $err = curl_error($ch);
        curl_close($ch);
        if ($body === false) {
            return [0, '', $err];
        }
        return [$code, (string) $body, ''];
    }

    $ctx = stream_context_create([
        'http' => ['timeout' => 25, 'ignore_errors' => true],
    ]);
    $body = @file_get_contents($url, false, $ctx);
    $code = 0;
    if (isset($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $m)) {
        $code = (int) $m[1];
    }
    if ($body === false) {
        return [0, '', 'The upstream request failed.'];
    }
    return [$code, (string) $body, ''];
}
