<?php

/**
 * Generate a clean, one-page PDF CV from the portfolio content.
 * Run: php tools/generate-cv.php
 */
$output = __DIR__.'/../public/assets/files/Dimple-Kate-Bodonia-CV.pdf';

if (! is_dir(dirname($output))) {
    mkdir(dirname($output), 0775, true);
}

$escape = static function (string $text): string {
    $text = strtr($text, [
        '—' => '-',
        '–' => '-',
        '·' => '|',
        '’' => "'",
        '‘' => "'",
        '“' => '"',
        '”' => '"',
    ]);

    $text = preg_replace('/[^\x20-\x7E]/', '', $text) ?? $text;

    return str_replace(['\\', '(', ')'], ['\\\\', '\\(', '\\)'], $text);
};

$commands = [];
$add = static function (string $command) use (&$commands): void {
    $commands[] = $command;
};

$text = static function (float $x, float $y, float $size, string $font, string $value, string $color = '0.08 0.12 0.18') use ($add, $escape): void {
    $add(sprintf(
        'BT %s rg /%s %.2f Tf %.2f %.2f Td (%s) Tj ET',
        $color,
        $font,
        $size,
        $x,
        $y,
        $escape($value)
    ));
};

$rect = static function (float $x, float $y, float $width, float $height, string $color) use ($add): void {
    $add(sprintf('%s rg %.2f %.2f %.2f %.2f re f', $color, $x, $y, $width, $height));
};

$line = static function (float $x1, float $y1, float $x2, float $y2, string $color, float $width = 0.8) use ($add): void {
    $add(sprintf('%s RG %.2f w %.2f %.2f m %.2f %.2f l S', $color, $width, $x1, $y1, $x2, $y2));
};

$wrap = static function (string $value, int $maxChars = 92): array {
    return explode("\n", wordwrap($value, $maxChars, "\n", true));
};

$sectionTitle = static function (string $title, float $y) use ($text, $line): void {
    $text(48, $y, 10, 'F2', strtoupper($title), '0.12 0.32 0.72');
    $line(48, $y - 5, 547, $y - 5, '0.80 0.86 0.94', 0.6);
};

$paragraph = static function (string $value, float $y, float $size = 9.2, int $maxChars = 95) use ($text, $wrap): float {
    foreach ($wrap($value, $maxChars) as $lineText) {
        $text(48, $y, $size, 'F1', $lineText, '0.16 0.20 0.27');
        $y -= $size * 1.55;
    }

    return $y;
};

// Page background
$rect(0, 0, 595, 842, '1 1 1');

// Header
$rect(0, 690, 595, 152, '0.024 0.043 0.082');
$rect(0, 686, 595, 4, '0.18 0.48 1');
$text(48, 794, 25, 'F2', 'DIMPLE KATE B. BODONIA', '1 1 1');
$text(48, 771, 10.5, 'F1', 'BS Information Technology Student · Web Developer', '0.70 0.84 1');
$text(48, 744, 8.8, 'F1', 'kbbersalona@gmail.com  ·  +63 995 524 3015  ·  Bangued, Abra, Philippines', '0.78 0.86 0.96');
$text(48, 728, 8.8, 'F1', 'github.com/DimpleKate  ·  facebook.com/dimvsx', '0.78 0.86 0.96');

// Profile
$y = 656;
$sectionTitle('Profile', $y);
$y -= 23;
$y = $paragraph(
    'Information Technology student with a strong interest in web development, UI design, and practical software solutions. Experienced in building academic and personal projects with PHP, Laravel, MySQL, and modern front-end tools. Known for a curious, detail-oriented approach and a willingness to learn quickly.',
    $y
);

// Education
$y -= 8;
$sectionTitle('Education', $y);
$y -= 23;

$text(48, $y, 9.8, 'F2', 'Bachelor of Science in Information Technology', '0.08 0.12 0.18');
$text(440, $y, 8.6, 'F1', '2023 — Present', '0.36 0.43 0.54');
$y -= 13;
$text(48, $y, 8.8, 'F1', 'Data Center College of the Philippines · Bangued, Abra', '0.36 0.43 0.54');
$y -= 15;
$y = $paragraph('Focused on software development, web technologies, and IT solutions through coursework and hands-on projects.', $y, 8.9, 100);

$y -= 4;
$text(48, $y, 9.8, 'F2', 'General Academic Strand (GAS)', '0.08 0.12 0.18');
$text(455, $y, 8.6, 'F1', '2021 — 2023', '0.36 0.43 0.54');
$y -= 13;
$text(48, $y, 8.8, 'F1', 'Abra High School · Bangued, Abra · Graduated with honors', '0.36 0.43 0.54');
$y -= 24;

// Skills
$sectionTitle('Skills', $y);
$y -= 23;
$text(48, $y, 8.8, 'F2', 'Technical:', '0.08 0.12 0.18');
$text(106, $y, 8.8, 'F1', 'HTML5, CSS3, JavaScript, PHP, Laravel, Blade, MySQL, Tailwind CSS, Git & GitHub, Figma', '0.16 0.20 0.27');
$y -= 15;
$text(48, $y, 8.8, 'F2', 'Professional:', '0.08 0.12 0.18');
$text(118, $y, 8.8, 'F1', 'Communication, collaboration, time management, adaptability, attention to detail', '0.16 0.20 0.27');
$y -= 28;

// Projects
$sectionTitle('Selected Projects', $y);
$y -= 23;

$projects = [
    ['Technical Support Ticketing System', 'Web-based helpdesk for faculty and staff to report, track, and resolve IT issues at DCCP – Bangued Campus.', 'PHP, Laravel, MySQL, Tailwind CSS, Alpine.js'],
    ['Personal DTR', 'Private attendance workspace for tracking time in, breaks, and time out, with monthly reports and exports.', 'PHP, Laravel, MySQL, JavaScript'],
    ['Kusina ni Mama Reservation & Ordering System', 'Restaurant system for table reservations, advance orders, kitchen preparation, and POS transactions.', 'PHP, Laravel, MySQL, JavaScript'],
    ['Brew & Go', 'Coffee shop ordering and management system with customer ordering and an admin dashboard.', 'PHP, Laravel, MySQL, Bootstrap, JavaScript'],
];

foreach ($projects as $project) {
    $text(48, $y, 9.4, 'F2', $project[0], '0.08 0.12 0.18');
    $y -= 12;
    $y = $paragraph($project[1], $y, 8.7, 104);
    $text(48, $y + 2, 8.2, 'F1', $project[2], '0.18 0.40 0.78');
    $y -= 17;
}

// Certificates
$sectionTitle('Certificates', $y);
$y -= 22;

$certificates = [
    ['Online Safety Through Netiquette', 'DICT', 'July 2026'],
    ['Startup Now Cordillera', 'Professional Development', 'September 2026'],
    ['Introduction to Modern AI', 'Professional Development', 'October 2026'],
];

foreach ($certificates as $certificate) {
    $text(48, $y, 8.9, 'F2', $certificate[0], '0.08 0.12 0.18');
    $text(360, $y, 8.4, 'F1', $certificate[1].' · '.$certificate[2], '0.36 0.43 0.54');
    $y -= 15;
}

// Footer
$rect(0, 0, 595, 34, '0.024 0.043 0.082');
$text(48, 13, 8, 'F1', 'Dimple Kate B. Bodonia · Curriculum Vitae · Generated from the portfolio content', '0.72 0.82 0.94');

$stream = implode("\n", $commands);

$objects = [];
$objects[] = '<< /Type /Catalog /Pages 2 0 R >>';
$objects[] = '<< /Type /Pages /Kids [3 0 R] /Count 1 >>';
$objects[] = '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>';
$objects[] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
$objects[] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>';
$objects[] = '<< /Length '.strlen($stream)." >>\nstream\n".$stream."\nendstream";

$pdf = "%PDF-1.4\n";
$offsets = [0];

foreach ($objects as $index => $object) {
    $offsets[] = strlen($pdf);
    $pdf .= ($index + 1)." 0 obj\n".$object."\nendobj\n";
}

$xref = strlen($pdf);
$pdf .= "xref\n0 ".(count($objects) + 1)."\n";
$pdf .= "0000000000 65535 f \n";

for ($i = 1; $i <= count($objects); $i++) {
    $pdf .= sprintf("%010d 00000 n \n", $offsets[$i]);
}

$pdf .= "trailer\n<< /Size ".(count($objects) + 1)." /Root 1 0 R >>\n";
$pdf .= "startxref\n".$xref."\n%%EOF\n";

file_put_contents($output, $pdf);

echo 'Generated '.$output.' ('.strlen($pdf).' bytes)'.PHP_EOL;
