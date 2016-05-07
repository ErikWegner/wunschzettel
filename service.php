<?php
/**
 *  Default action: show available actions
 */
function help() {
  print json_encode(array("action"=> array("list")));
}

/**
 *  List available items
 */
function listitems() {
  $w = array();
  $verz=opendir ('.');
  while ($file = readdir ($verz)) {
    if (substr($file, 0, 2) == "ws") {
      // Init with emtpy string
      $nBezeichnung = "";
      $nKategorie = "";
      $nBeschreibung = "";
      $nBild = "";
      $nKaufen = "";
      // Read all lines
      $inhalt = file($file);
      // Process all lines
      foreach($inhalt as $zeile) {
        $teile = explode("=", $zeile, 2);
        if (strcasecmp($teile[0], "Bezeichnung") == 0) $nBezeichnung = utf8_encode($teile[1]);
        if (strcasecmp($teile[0], "Beschreibung") == 0) $nBeschreibung = utf8_encode($teile[1]);
        if (strcasecmp($teile[0], "Kategorie") == 0) $nKategorie = utf8_encode($teile[1]);
        if (strcasecmp($teile[0], "Bild") == 0) $nBild = $teile[1];
        if (strcasecmp($teile[0], "einkaufen") == 0) $nKaufen = $teile[1];
      }
      // Save result
      $w[] = array(
        "Title" => $nBezeichnung,
        "Description" => $nBeschreibung,
        "Category" => $nKategorie,
        "ImgageUrl" => $nBild,
        "BuyUrl" => $nKaufen
      );
    }
  }
  
  print json_encode($w);

}

$action = isset($_GET['action']) ?: "";
switch ($action) {
  case 'list' : listitems(); break;
  default: help(); break;
}