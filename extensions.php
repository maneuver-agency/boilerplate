<?php

// Create custom escaper.
function clean($env, $string, $charset){
  $string = strtolower(str_replace(' ', '-', $string));
  return preg_replace('/[^A-Za-z0-9\-]/', '', $string);
};
function phone($env, $string, $charset){
  $string = str_replace('(0)', '', $string);
  $string = str_replace(' ', '', $string);
  $string = preg_replace('/[^0-9\-]/', '', $string);
  return $string;
};
$twig->getExtension('core')->setEscaper('clean', 'clean');
$twig->getExtension('core')->setEscaper('phone', 'phone');

// Create dump function.
$twig->addFunction(new Twig_SimpleFunction('dump', function($var){
  var_dump($var);exit;
}));

$twig->addFilter(new Twig_SimpleFilter('prefix', function($string, $prefix){
  if (!empty($string)) {
    return $prefix . $string;
  }
}));

$twig->addFilter(new Twig_SimpleFilter('suffix', function($string, $suffix){
  if (!empty($string)) {
    return $string . $suffix;
  }
}));

// Checks current template.
$twig->addFunction(new Twig_SimpleFunction('active', function($template, $echo = 'active'){
  $requri = $_SERVER['REQUEST_URI'];
  $active = FALSE;

  if ($requri == $template || trim($requri, '/') == $template) {
    $active = TRUE;
  }
  echo ($active ? $echo : '');
}));

// Create share link.
$twig->addFilter(new Twig_SimpleFilter('share', function($url, $type, $title = ''){
  switch($type) {
    case 'facebook':
      $link = 'https://www.facebook.com/sharer/sharer.php?u=%1$s';
      break;
    case 'twitter':
      $link = 'https://twitter.com/home?status=%2$s %1$s';
      break;
    case 'linkedin':
      $link = 'https://www.linkedin.com/shareArticle?mini=true&url=%1$s&title=%2$s&summary=&source=';
      break;
    case 'googleplus':
      $link = 'https://plus.google.com/share?url=%1$s';
      break;
  }
  return sprintf($link, urlencode($url), urlencode($title));
}));


// Create parseVimeo function.
// $twig->addFunction(new Twig_SimpleFunction('embedVimeo', function($url){
//   //extract the ID
//   preg_match('/\/\/(www\.)?vimeo.com\/(\d+)($|\/)/', $url, $matches);
//   $id = $matches[2];
//   return "http://player.vimeo.com/video/".$id."?api=1&amp;title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff";
// }));

// Create parseVimeo function.
// $twig->addFunction(new Twig_SimpleFunction('imageVimeo', function($url){
//   //extract the ID
//   preg_match('/\/\/(www\.)?vimeo.com\/(\d+)($|\/)/', $url, $matches);
//   $id = $matches[2];
//   $hash = unserialize(file_get_contents("http://vimeo.com/api/v2/video/".$id.".php"));
//   return $hash[0]["thumbnail_medium"];
// }));

// Create shuffle filter.
$twig->addFilter(new Twig_SimpleFilter('shuffle', function($array){
  shuffle($array);
  return $array;
}));
