<?php
/**
 *  Default action: show available actions
 */
function help() {
  print json_encode(array("action"=> array("list", "reserve", "clear", "add", "update")));
}

function ensure_valid_id() {
  $ws_id = isset($_GET['id']) ? $_GET['id'] : 0;
  if (is_numeric($ws_id) == false || $ws_id < 1 || file_exists("ws" . $ws_id) !== TRUE) {
    header('HTTP/1.1 500 Internal Server Error');
    die();
  }

  return $ws_id;
}

function read_file($filename) {
  // Init with emtpy string
  $nBezeichnung = "";
  $nKategorie = "";
  $nBeschreibung = "";
  $nBild = "";
  $nKaufen = "";
  $nStatus = FALSE;
  $nPreisVon = "";
  $nPreisBis = "";
  // Read all lines
  $inhalt = file($filename);
  // Process all lines
  foreach($inhalt as $zeile) {
    $teile = explode("=", $zeile, 2);
    $field = $teile[0];
    $value = rtrim(isset($teile[1]) ? $teile[1] : "");
    if (strcasecmp($field, "Bezeichnung") == 0) $nBezeichnung = $value;
    if (strcasecmp($field, "Beschreibung") == 0) $nBeschreibung = $value;
    if (strcasecmp($field, "Kategorie") == 0) $nKategorie = $value;
    if (strcasecmp($field, "Bild") == 0) $nBild = $value;
    if (strcasecmp($field, "einkaufen") == 0) $nKaufen = $value;
    if (strcasecmp($field, "preisvon") == 0) $nPreisVon = $value;
    if (strcasecmp($field, "peisbis") == 0) $nPreisBis = $value;
    if (strcasecmp($field, "reserviert") == 0) $nStatus = $value !== "nein";
  }
  
  $result = array(
      "Title" => $nBezeichnung,
      "Description" => $nBeschreibung,
      "Category" => $nKategorie,
      "ImgageUrl" => $nBild,
      "BuyUrl" => $nKaufen,
      "PriceFrom" => $nPreisVon,
      "PriceTo" => $nPreisBis,
      "Status" => $nStatus
    );
  
  return $result;    
}

function write_file($filename, $wsdata) {
  $data = $wsdata + array(
    "Title" => "",
    "Description" => "",
    "Category" => "",
    "ImgageUrl" => "",
    "BuyUrl" => "",
    "PriceFrom" => "",
    "PriceTo" => "",
    "Status" => "",
  ); 
  $fp = fopen($filename, "w");
  fputs($fp, "Bezeichnung=" . $data["Title"] . "\n");
  fputs($fp, "beschreibung=" . str_replace("\r", "", str_replace("\n","<br>",$data["Description"])) . "\n");
  fputs($fp, "Kategorie=" . $data["Category"] . "\n");
  fputs($fp, "bild=" . $data["ImgageUrl"] . "\n");
  fputs($fp, "einkaufen=" . $data["BuyUrl"] . "\n");
  fputs($fp, "preisvon=" . $data["PriceFrom"] . "\n");
  fputs($fp, "peisbis=" . $data["PriceTo"] . "\n");
  fputs($fp, "reserviert" . "=" . ($data["Status"] ? "ja" : "nein" ) . "\n");
  fclose($fp);
}
/**
 *  List available items
 */
function listitems() {
  $w = array();
  $verz=opendir ('.');
  while ($filename = readdir ($verz)) {
    if (substr($filename, 0, 2) == "ws") {
      $item = read_file($filename, FALSE);
      $item["id"] = substr($filename, 2);
      unset($item["Status"]);
      $w[] = $item;
    }
  }
  
  print json_encode(array("data" => $w));
}

/**
 *  Read item status
 */
function status() {
  $ws_id = ensure_valid_id();
  $dat = read_file("ws" . $ws_id, TRUE);
  print json_encode(array("data" => array("status" => $dat["Status"])));
}

/**
 *  Set item status to $targetstate
 */
function set_reserved($targetstate) {
  if (check_captcha() == FALSE) {
    print json_encode(
      array("data" => array(
        "success" => FALSE,
        "message" => "Captcha falsch"
      )));
    return;
  }
  $ws_id = ensure_valid_id();
  $dat = read_file("ws" . $ws_id, TRUE);
  if ($dat["Status"] == $targetstate) {
    print json_encode(
      array("data" => array(
        "success" => FALSE,
        "message" => $targetstate ? "Eintrag bereits reserviert" : "Eintrag war nicht mehr reserviert."
      )));
    return;
  }
  
  $dat["Status"] = $targetstate;
  write_file("ws" . $ws_id, $dat);
  
  print json_encode(
      array("data" => array(
        "success" => TRUE,
        "message" => $targetstate ? "Eintrag wurde reserviert" : "Reservierung wurde gelöscht"
      )));
}

/**
 *  Create a captcha task.
 *  Save the result to the session,
 *  return the task. 
 */
function prepare_captcha() {
  $source = array(
    0 => 'null',
    1 => 'eins',
    2 => 'zwei',
    3 => 'drei',
    4 => 'vier',
    5 => 'fünf',
    6 => 'sechs',
    7 => 'sieben',
    8 => 'acht',
    9 => 'neun'
  );
  session_start();
  $i = rand(0, count($source) - 1);
  $_SESSION['SPAMGUARD_CODE'] = $i;
  print json_encode(array("data" => array("captchatext" => $source[$i])));
}

/**
 *  Check the submitted captcha value.
 *  Clears the captcha from the session.
 *  Returns TRUE, if captcha matches.
 */
function check_captcha() {
  $captcha = isset($_GET['captcha']) ? $_GET['captcha'] : "";
  if ($captcha == "") {
    return FALSE;
  }
  session_start();
  $result = $_SESSION['SPAMGUARD_CODE'] == $captcha;
  $_SESSION['SPAMGUARD_CODE'] = "";
  return $result;
}

$action = isset($_GET['action']) ? $_GET['action'] : "";
switch ($action) {
  case 'list' : listitems(); break;
  case 'status' : status(); break;
  case 'reserve' : set_reserved(TRUE); break;
  case 'clear' : set_reserved(FALSE); break;
  case 'captcha' : prepare_captcha(); break;
  default: help(); break;
}