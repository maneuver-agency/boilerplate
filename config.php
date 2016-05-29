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

  'wp_head' => '',
  'wp_footer' => '',

  'options' => [
    'facebook' => 'http://www.facebook.com',
    'twitter' => 'http://www.twitter.com',
    'linkedin' => 'http://www.linkedin.com',
    'youtube' => 'http://www.youtube.com',
    'vimeo' => 'http://www.vimeo.com',
    'instagram' => 'http://www.instagram.com',
  ],

];

/**************/
