<?php


// Create custom escaper.
function clean($env, $string, $charset){
  $string = strtolower(str_replace(' ', '-', $string));
  return preg_replace('/[^A-Za-z0-9\-]/', '', $string);
};
$twig->getExtension('core')->setEscaper('clean', 'clean');

// Create dump function.
$twig->addFunction(new Twig_SimpleFunction('dump', function($var){
  var_dump($var);exit;
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
