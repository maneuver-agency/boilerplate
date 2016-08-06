<?php

// Create custom escaper.
if (!function_exists('mnvr_clean')) {
  function mnvr_clean($env, $string, $charset){
    $string = strtolower(str_replace(' ', '-', $string));
    return preg_replace('/[^A-Za-z0-9\-]/', '', $string);
  }
}
if (!function_exists('mnvr_phone')) {
  function mnvr_phone($env, $string, $charset){
    $string = str_replace('(0)', '', $string);
    $string = str_replace(' ', '', $string);
    $string = preg_replace('/[^0-9\-]/', '', $string);
    return $string;
  }
}
$twig->getExtension('core')->setEscaper('clean', 'mnvr_clean');
$twig->getExtension('core')->setEscaper('phone', 'mnvr_phone');

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

$twig->addFilter(new Twig_SimpleFilter('try_link', function($string){
  if(filter_var($string, FILTER_VALIDATE_EMAIL)) {
    $link = 'mailto:'.$string;
  } elseif (filter_var($string, FILTER_VALIDATE_URL)) {
    $link = $string;
  } elseif (strpos($string, 'www.') === 0) {
    $link = 'http://'.$string;
  }

  if (!empty($link)) {
    $string = sprintf('<a href="%s" target="_blank">%s</a>', $link, $string);
  }

  return $string;
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
  if (!is_string($url) && isset($url->ID)) {
    $post = $url;
    $url = $post->link;
    $title = $title ?: $post->title;
  }
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


$twig->addFilter(new Twig_SimpleFilter('link_to_gmaps', function($location, $type = 'place', $zoom = 8){
  $addr = $location['address'];
  $lat = $location['lat'];
  $lng = $location['lng'];

  // Use 'dir' as type for directions.
  $type = $type == 'dir' ? 'dir/Current+Location' : $type;

  return "http://maps.google.com/maps/{$type}/{$addr}/@{$lat},{$lng},{$zoom}z";
}));

$twig->addFunction(new Twig_SimpleFunction('lipsum', function($wordcount = 15){
  $content = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Qui ita affectus, beatum esse numquam probabis; Quod non faceret, si in voluptate summum bonum poneret. Est enim effectrix multarum et magnarum voluptatum. Qua ex cognitione facilior facta est investigatio rerum occultissimarum. Duo Reges: constructio interrete.
  Nihil enim hoc differt. Quamquam te quidem video minime esse deterritum. Dat enim intervalla et relaxat. Istam voluptatem perpetuam quis potest praestare sapienti? Sed erat aequius Triarium aliquid de dissensione nostra iudicare. Tertium autem omnibus aut maximis rebus iis, quae secundum naturam sint, fruentem vivere. Miserum hominem! Si dolor summum malum est, dici aliter non potest.
  Quid ergo attinet gloriose loqui, nisi constanter loquare? Pugnant Stoici cum Peripateticis. Non est igitur voluptas bonum. Non enim quaero quid verum, sed quid cuique dicendum sit. Teneo, inquit, finem illi videri nihil dolere. Primum quid tu dicis breve? Me igitur ipsum ames oportet, non mea, si veri amici futuri sumus. Quando enim Socrates, qui parens philosophiae iure dici potest, quicquam tale fecit? At quanta conantur! Mundum hunc omnem oppidum esse nostrum! Incendi igitur eos, qui audiunt, vides. Quamquam ab iis philosophiam et omnes ingenuas disciplinas habemus; Respondent extrema primis, media utrisque, omnia omnibus. Virtutis, magnitudinis animi, patientiae, fortitudinis fomentis dolor mitigari solet.
  In eo enim positum est id, quod dicimus esse expetendum. Miserum hominem! Si dolor summum malum est, dici aliter non potest. Suo genere perveniant ad extremum; His enim rebus detractis negat se reperire in asotorum vita quod reprehendat. Ergo ita: non posse honeste vivi, nisi honeste vivatur?';

  // Make it a little different between calls.
  $wordcount = $wordcount + rand(0, 6) - rand(1, 10);

  $words = str_word_count($content, 1);
  $output = [];
  do {
    $output = array_merge($output, array_slice($words, 0, $wordcount));
  } while (count($output) < $wordcount);

  echo implode(" ", $output);
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
