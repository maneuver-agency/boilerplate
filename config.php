<?php

/*** CONFIG ****/

$config = array(

  // Set environments.
  'environments' => array(
    'local'       => 'local.mnvr.be',
    'staging'     => 'mnvr.be',
    'production'  => 'prototype.be',
  ),

  // Set theme variables.
  'theme' => (object) array(
    'sitename' => 'prototype',
    'siteurl' => 'http://' . $_SERVER['HTTP_HOST'],
    'description' => '',
    'canonicalurl' => 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']
  ),

  // Different paths used throughout template files.
  'paths' => (object) array(
    'theme' => '/',
    'images' => '/assets/img/',
  ),

);

/**************/
