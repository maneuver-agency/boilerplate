<?php

/*** CONFIG ****/

$config = array(
  'sitename' => 'Prototype',
  'siteurl' => 'http://prototype.local.mnvr.be'
);

/**************/

ini_set('display_errors', 1);

define('DOCROOT', $_SERVER['DOCUMENT_ROOT']);
require_once('vendor/autoload.php');

// Setup Twig templating engine
$loader = new Twig_Loader_Filesystem(DOCROOT . '/templates');
$twig = new Twig_Environment($loader, array(
  'cache' => FALSE, //DOCROOT . '/cache',
));

// Simple routing
// See http://toroweb.org/ for a slightly more advanced way.
$uri = $_SERVER['REQUEST_URI'];
$file = 'index.twig';
if ($uri != '/') {
  $file = ltrim($uri, '/') . '.twig';
}
if (!file_exists(DOCROOT . '/templates/' . $file)) {
  $file = '404.twig';
  header("HTTP/1.0 404 Not Found");
}

// Load and render template.
$template = $twig->loadTemplate($file);
echo $template->render($config);

?>
