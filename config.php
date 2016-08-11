<?php

/*** CONFIG ****/

$config = [

  'root' => '/',
  'debug' => TRUE,

  // Set environments.
  'environments' => [
    'local'       => 'local.mnvr.be',
    'staging'     => 'mnvr.be',
    'production'  => 'boilerplate.be',
  ],

  'languages' => ['nl'],
  'default_language' => 'nl',

  'site' => (object)[
    'charset' => 'UTF-8',
    'description' => '',
    'name' => 'Boilerplate',
    'url' => $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'],
  ],

  'theme' => (object)[
    'link' => '',
    'path' => __DIR__,
  ],

  'wp_head' => null,
  'wp_footer' => null,
  'wp_title' => 'Boilerplate',

  'options' => [
    'facebook' => 'http://www.facebook.com',
    'twitter' => 'http://www.twitter.com',
    'linkedin' => 'http://www.linkedin.com',
    'youtube' => 'http://www.youtube.com',
    'vimeo' => 'http://www.vimeo.com',
    'instagram' => 'http://www.instagram.com',

    'name' => 'Boilerplate',
    'address' => 'Lindenstraat 90B',
    'zip' => '9100',
    'city' => 'Sint-Niklaas',
    'phone' => '+32 (0)472 76 74 53',
    'email' => 'mayday@maneuver.be',

    'location' => (object)[
      'address' => 'Lindenstraat 90B 9100 Sint-Niklaas',
      'lat' => 51.221351,
      'lng' => 4.285173,
    ]
  ],

];

/**************/
