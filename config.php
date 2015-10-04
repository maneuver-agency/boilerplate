<?php

/*** CONFIG ****/

$config = array(

  'root' => '/',

  // Set environments.
  'environments' => array(
    'local'       => 'local.mnvr.be',
    'staging'     => 'mnvr.be',
    'production'  => 'prototype.be',
  ),

  'languages' => array('en', 'nl'),
  'default_language' => 'en',

  // Set theme variables.
  'theme' => (object) array(
    'sitename' => 'prototype',
    'siteurl' => 'http://' . $_SERVER['HTTP_HOST'],
    'description' => '',
    'canonicalurl' => 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'],
    'images' => ':root/assets/img/',
  ),

  // Different paths used throughout template files.
  'paths' => (object) array(
    'theme' => ':root'
  ),

);

/**************/
