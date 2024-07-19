<?php
$i = 2;
if($i == 1){
  define("EMAIL_HOST", "smtp.yajuu.com");
  define("EMAIL_USER", "tadokoro");
  define("EMAIL_PASS", "114514simokitazawa");
  define("EMAIL_SECURE", 'TLS');
  define("EMAIL_PORT", 587);
  define("EMAIL_MAIL",'tadokoro@yajuu.com');
}else if($i == 2){
  define("EMAIL_HOST", "smtp.1919.jp");
  define("EMAIL_USER", "kmr514");
  define("EMAIL_PASS", "yametekureyo~");
  define("EMAIL_SECURE", 'SSL');
  define("EMAIL_PORT", 587);
  define("EMAIL_MAIL",'kmr514@1919.jp');
}else{
  
}
