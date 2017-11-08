<?php

ini_set('display_errors', 1);

require_once('vendor/autoload.php');

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\Yaml\Yaml;
use Aptoma\Twig\Extension\MarkdownExtension;
use Aptoma\Twig\Extension\MarkdownEngine;

include 'config.php';
parseConfig($config, $config);

define('ENV', determineEnv($config['environments']));
$config['ENV'] = ENV;

$config['body_classes'] = [];
$config['lang'] = 'en';

if (file_exists('dist/manifest.json')) {
  $manifest = json_decode(file_get_contents('dist/manifest.json'), true);
  // foreach ($manifest as &$entry) {
  //   $entry = '/dist/' . $entry;
  // }
  $config['manifest'] = $manifest;
}


/*************/
/* BUILD APP */
/*************/

$app = new Silex\Application();

// Enable debugging when testing local.
if (ENV == 'local' && $config['debug']) {
  $app['debug'] = TRUE;
}

// Try to detect brower language.
if (count($config['languages']) > 1 && !empty($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
  $browser_lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
  if (in_array($browser_lang, $config['languages'])) {
    $config['default_language'] = $browser_lang;
  }
}

// Add Doctrine Service Provider
// $app->register(new Silex\Provider\DoctrineServiceProvider(), array(
//   'db.options' => array(
//     'driver'    => 'pdo_mysql',
//     'dbname'    => 'maneuver_db',
//     'host'      => '94.198.160.60',
//     'user'      => 'maneuver_dbo',
//     'password'  => 'mnvr140DB',
//   ),
// ));

// Add Twig Service Provider.
$app->register(new Silex\Provider\TwigServiceProvider(), array(
  'twig.path' => __DIR__ . '/',
  'twig.options' => array(
    'strict_variables' => FALSE,
    'cache' => ENV == 'production' ? __DIR__.'/cache' : FALSE, // only cache in production
  ),
));

// Extend twig.
$app['twig'] = $app->share($app->extend('twig', function($twig, $app) {
  include('extensions.php');
  $engine = new MarkdownEngine\MichelfMarkdownEngine();
  $twig->addExtension(new MarkdownExtension($engine));
  return $twig;
}));

// Set error handler.
$app->error(function (\Exception $e, $code) use ($app, $config) {
  switch ($code) {
    case 404:
      $file = '404.twig';
      // $message = 'The requested page could not be found.';
      break;
    default:
      throw $e;
      // $message = 'We are sorry, but something went terribly wrong.';
  }

   return $app['twig']->render('/templates/'.$file, $config);
});


/****************/
/* SETUP ROUTES */
/****************/

// General template + homepage.
$app->get('/{template}', function(Silex\Application $app, $template) use ($config) {

  $file = $template . '.twig';
  if (!file_exists(__DIR__ . '/templates/' . $file)) {
    $file = '404.twig';
    header("HTTP/1.0 404 Not Found");
  }

  if ($template == 'index') {
    $config['is_front'] = TRUE;
    $config['body_classes'][] = 'front';
  }

  return $app['twig']->render('/templates/'.$file, $config);
})
->value('template', 'index');


/*************/
/* KICKSTART */
/*************/

$app->run();


/***************/
/*** METHODS ***/
/***************/

function parseConfig($config, &$arr) {
  if (is_object($arr)) {
    $arr = get_object_vars($arr);
  }

  if (is_array($arr) && !empty($arr)) {
    foreach ($arr as $key => &$value) {
      if (is_string($value) && strstr($value, ':root')) {
        $value = str_replace(':root', $config['root'], $value);
        $value = str_replace('//', '/', $value);
        $value = rtrim($value, '/');
      } else {
        parseConfig($config, $value);
      }
    }
  }
}

function determineEnv($environments) {
  foreach ($environments as $env => $domain) {
    if (strpos($_SERVER['SERVER_NAME'], $domain)) {
      return $env;
    }
  }
  return array_pop($environments);
}

function loadTranslations($lang){
  global $translations;

  $file = __DIR__ . '/content/translations/' . $lang . '.yml';
  if (!$translations && file_exists($file)) {
    $translations = Yaml::parse(file_get_contents($file));
  }
}

function loadContent($template, $lang) {
  $globalfile = __DIR__ . '/content/' . $lang . '/global.yml';
  $pagefile = __DIR__ . '/content/' . $lang . '/' . $template . '.yml';
  $content = array();

  // var_dump(Yaml::parse(file_get_contents($globalfile)));exit;

  if (file_exists($globalfile)) {
    $content = array_merge($content, Yaml::parse(file_get_contents($globalfile)));
  }
  if (file_exists($pagefile)) {
    $content = array_merge($content, Yaml::parse(file_get_contents($pagefile)));
  }
  return $content;
}

?>
