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


    $config['post'] = [
      'hero' => [
        'title' => 'Hero Title',
        'overlay' => false,
        'image' => 'https://images.unsplash.com/photo-1495650876818-1698322fbb61?ixlib=rb-0.3.5&s=20ec6688c21b4b67d814beab3fae5f40&auto=format&fit=crop&w=2500&h=900&q=80'
      ],
      'intro_paragraph' => [
        'title' => 'Lorem ipsum dolor sit amet!',
        'text' => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fuga possimus vero cum? Quibusdam sunt, eaque repudiandae velit architecto quia itaque maxime animi voluptatum omnis vitae eius aperiam nemo enim possimus.',
        'button' => [
          'title' => 'get it now!',
          'url' => 'http://maneuver.be',
          'target' => '_blank'
        ]
      ],
      'features' => [
        [
          'icon' => '/assets/tmp/feature1.svg',
          'title' => 'Lorem ipsum',
          'text' => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt natus voluptatem assumenda, voluptate sint explicabo excepturi non omnis possimus recusandae dicta neque magnam dolore asperiores perspiciatis, praesentium amet consequatur similique!',
          'button' => [
            'title' => 'read more',
            'url' => '#',
            'target' => '_blank'
          ]
        ],
        [
          'icon' => '/assets/tmp/feature2.svg',
          'title' => 'Dolor sit amet',
          'text' => 'Voluptate sint explicabo excepturi non omnis possimus recusandae dicta neque magnam dolore asperiores perspiciatis, praesentium amet.!',
          'button' => [
            'title' => 'read more',
            'url' => '#',
            'target' => '_blank'
          ]
        ],
        [
          'icon' => '/assets/tmp/feature3.svg',
          'title' => 'Voluptate sint',
          'text' => 'Incidunt natus voluptatem assumenda, voluptate sint explicabo excepturi non omnis possimus recusandae dicta neque magnam dolore asperiores perspiciatis, praesentium amet consequatur similique!',
          'button' => [
            'title' => 'read more',
            'url' => '#',
            'target' => '_blank'
          ]
        ]
      ],
      'teasers' => [
        [
          'image' => 'https://images.unsplash.com/photo-1495650876818-1698322fbb61?ixlib=rb-0.3.5&s=20ec6688c21b4b67d814beab3fae5f40&auto=format&fit=crop&w=800&h=500&q=80',
          'icon' => '/assets/tmp/feature1.svg',
          'title' => 'Lorem ipsu qsdjmklf jqdsfklmj qkdls jfkmldq mkjfkmdqs fqd m',
          'text' => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt natus voluptatem assumenda, voluptate sint explicabo excepturi non omnis possimus recusandae dicta neque magnam dolore asperiores perspiciatis, praesentium amet consequatur similique!',
          'button' => [
            'title' => 'read more',
            'url' => '#',
            'target' => '_blank'
          ]
        ],
        [
          'image' => 'https://images.unsplash.com/photo-1529394207442-e4f98d63d085?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=f12af2960e12cf77d7a757476ed02df6&auto=format&fit=crop&w=800&h=500&q=80',
          'icon' => '/assets/tmp/feature2.svg',
          'title' => 'Dolor sit amet',
          'text' => 'Voluptate sint explicabo excepturi non omnis possimus recusandae dicta neque magnam dolore asperiores perspiciatis, praesentium amet.!',
          'button' => [
            'title' => 'read more',
            'url' => '#',
            'target' => '_blank'
          ]
        ],
        [
          'image' => 'https://images.unsplash.com/photo-1529391409740-59f2cea08bc6?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=9562830b5cd124982cba956afcdac9f7&auto=format&fit=crop&w=800&h=500&q=80',
          'icon' => '/assets/tmp/feature3.svg',
          'title' => 'Voluptate sint',
          'text' => 'Incidunt natus voluptatem assumenda, voluptate sint explicabo excepturi non omnis possimus recusandae dicta neque magnam dolore asperiores perspiciatis, praesentium amet consequatur similique!',
          'button' => [
            'title' => 'read more',
            'url' => '#',
            'target' => '_blank'
          ]
        ]
      ],
      'quote' => [
        'text' => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur aliquam, quo ea blanditiis laudantium quisquam nulla, dolor provident, expedita qui animi voluptatem, atque quae fugiat vel voluptates delectus? Nesciunt, dicta.',
        'author' => 'Dimitri Desender'
      ],
      'testimonial' => [
        'text' => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta ducimus ullam, natus deserunt exercitationem modi, praesentium sapiente aliquam harum dolores ratione veniam recusandae repellat doloribus..',
        'author' => 'Dimitri Desender',
        'author_title' => 'CEO',
        'author_image' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=99c6d2880c20cb72f29b5a9eba8ea898&auto=format&fit=crop&w=200&h=200&q=80' 
      ]
    ];

  }

  // $config['appdata'] = [];
  $config['appdata'] = [
    'debug'        => $app['debug'],
    'env'          => $config['ENV'],
    'lang'         => $config['lang'],
    'default_lang' => $config['default_language'],
  ];

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
