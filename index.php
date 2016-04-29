<?php 
	$datei = "index.php";
	$verzeichnis = "";
	$str_Reserviert = "reserviert";

	$alle_bezeichnung = array();
	$alle_kategorie = array();
	$alle_beschreibung = array();
	$alle_bild = array();
	$alle_kaufen = array();
	$alle_dateinr = array();

	$ws_dateiengelesen  = false;
	
	session_start();
	echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";

	function xhtmlchars($text) {
		return str_replace("'", "&apos;", str_replace("\"", "&quot;", str_replace(">", "&gt;", str_replace("<", "&lt;", str_replace("&", "&amp;", $text)))));
	}

	function html_head() {
		echo '<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" >
<head>
	<link rel="SHORTCUT ICON" href="../ewus.ico" />
	<link rel="icon" href="../ewus.ico" /> 
	<meta name="TITLE" content="ewus" />
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	<meta name="DESCRIPTION" content="EWUS - KV3" />
	<meta name="KEYWORDS" content="" />
	<meta name="OWNER" content="e-man@ewus.KE1N-SP4M.de" />
	<meta name="author" content="Erik Wegner" />
	<meta name="RATING" content="General" />
	<meta name="ROBOTS" content="index,follow" />
	<meta name="REVISIT-AFTER" content="4 weeks" />
	<link rel="stylesheet" type="text/css" href="../css/layout.css" />
	<title>Wunschzettel</title>
</head>
';
	}
	
	function html_doctypex10() {
		echo '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">' . "\n";
	}
	
	function html_frameset() {
		global $datei;
		echo '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">' . "\n";
		html_head();
		echo "<frameset cols=\"20%,80%\">\n";
		echo "<frame src=\"$datei?wf=lf\" name=\"lf\" />";
		echo "<frame src=\"$datei?wf=rf\" name=\"rf\" />";
		echo "</frameset>\n";
	}
	
	function html_bodyleft() {
		global $datei, $alle_kategorie;
		html_doctypex10();
		html_head();
		echo "<body bgcolor=\"#CCFFFF\">\n";
		echo "<script type=\"text/javascript\">
function neuladen() {
	parent.rf.location.reload();
	self.location.reload();
}
</script>";
		echo "<h1>Kategorien</h1>\n";
		echo "<a href=\"$datei?wf=rf\" target=\"rf\" />Alle</a><br /><br />\n";
		
		$unique_kategorie = array_unique($alle_kategorie);
		foreach ($unique_kategorie as $k) {
			$k = xhtmlchars($k);
			echo "<a href=\"$datei?wf=rf&k=$k\" target=\"rf\" />$k</a><br />\n";
		}

		echo "<br />" . link_neues_fenster($datei."?wf=neu", 'neu',"Neuer Eintrag"). "\n";
		echo '<p style="font-size:80%;"><span style="white-space:nowrap">Wunschzettel Version 1.3</span><br />powered by<br /><a href="http://ewus.de/" onclick="window.open(\'http://ewus.de/\', \'blank\', \'width=800, height=600, location=yes, menubar=yes, resizable=yes, scrollbars=yes, status=yes, toolbar=yes\'); return false;"><img src="../img/logo2013.png" alt="EWUS" width="64" height="64" /></a></p>';
		echo "\n</body>\n";
	}
	
	function link_neues_fenster($ziel, $name, $text) {
		return "<a href=\"$ziel\" target=\"_blank\" onclick=\"window.open('$ziel', '$name', 'width=400, height=570, location=no, menubar=no, resizable=yes, scrollbars=yes, status=yes, toolbar=no'); return false;\" />$text</a>";
	}
	
	function html_bodyright() {
		global $_GET;
		html_doctypex10();
		html_head();
		echo "<body bgcolor=\"#FFFF99\">\n";
		echo "<script src=\"statusFenster.js\" type=\"text/javascript\"></script>\n";
		zeigeEintraege($_GET['k']);
		echo "</body>\n";
	}
	
	function findefreieDatei() {
		$dnzaehler = 1;
		global $verzeichnis;
		while (file_exists($verzeichnis . "ws".$dnzaehler)) {
			$dnzaehler++;
		}
		return $verzeichnis . "ws" . $dnzaehler;
	}

	function schreibeDaten($a_bezeichnung, $a_beschreibung, $a_kategorie, $a_bildurl, $a_kaufurl, $a_preisvon, $a_preisbis, $a_reserviert, $dateiname) {
		global $str_Reserviert;
		$fp = fopen($dateiname, "w");
		fputs($fp, "Bezeichnung=" . $a_bezeichnung . "\n");
		fputs($fp, "beschreibung=" . str_replace("\r", "", str_replace("\n","<br />",$a_beschreibung)) . "\n");
		fputs($fp, "Kategorie=" . $a_kategorie . "\n");
		fputs($fp, "bild=" . $a_bildurl . "\n");
		fputs($fp, "einkaufen=" . $a_kaufurl . "\n");
		fputs($fp, "preisvon=" . $a_preisvon . "\n");
		fputs($fp, "peisbis=" . $a_preisbis . "\n");
		fputs($fp, $str_Reserviert . "=" . $a_reserviert . "\n");
		fclose($fp);
	}

	function liesDaten($dateiname) {
		global $bezeichnung, $beschreibung, $kategorie, $bildurl, $kaufurl, $preisvon, $preisbis, $reserviert, $hiddenvalue, $str_Reserviert;
		$inhalt = file($dateiname);
		$reserviert = "nein";
		foreach($inhalt as $zeile) {
			$teile = explode("=", $zeile, 2);
			if (strcasecmp($teile[0], 'Bezeichnung') == 0) $bezeichnung = chop($teile[1]);
			if (strcasecmp($teile[0], 'beschreibung') == 0) $beschreibung = chop($teile[1]);
			if (strcasecmp($teile[0], 'Kategorie') == 0) $kategorie = chop($teile[1]);
			if (strcasecmp($teile[0], 'bild') == 0) $bildurl = chop($teile[1]);
			if (strcasecmp($teile[0], 'einkaufen') == 0) $kaufurl = chop($teile[1]);
			if (strcasecmp($teile[0], 'einkaufen') == 0) $kaufurl = chop($teile[1]);
			if (strcasecmp($teile[0], $str_Reserviert) == 0) $reserviert = chop($teile[1]);
		}
	}
	
	function liesAlleDateien() {
		global $ws_dateiengelesen;
		if ($ws_dateiengelesen) return;
		$ws_dateiengelesen = true;
		
		$verz=opendir ('.');
		global $alle_bezeichnung, $alle_kategorie, $alle_beschreibung, $alle_bild, $alle_kaufen, $alle_dateinr;
		while ($file = readdir ($verz)) {
			if (substr($file, 0, 2) == "ws") {
				$nBezeichnung = "";
				$nKategorie = "";
				$nBeschreibung = "";
				$nBild = "";
				$nKaufen = "";
				
				$inhalt = file($file);
				foreach($inhalt as $zeile) {
					$teile = explode("=", $zeile, 2);
					if (strcasecmp($teile[0], "Bezeichnung") == 0) $nBezeichnung = utf8_encode($teile[1]);
					if (strcasecmp($teile[0], "Beschreibung") == 0) $nBeschreibung = utf8_encode($teile[1]);
					if (strcasecmp($teile[0], "Kategorie") == 0) $nKategorie = utf8_encode($teile[1]);
					if (strcasecmp($teile[0], "Bild") == 0) $nBild = $teile[1];
					if (strcasecmp($teile[0], "einkaufen") == 0) $nKaufen = $teile[1];
				}
				$alle_bezeichnung[] = chop($nBezeichnung);
				$alle_beschreibung[] = chop($nBeschreibung);
				$alle_kategorie[] = chop($nKategorie);
				$alle_bild[] = chop($nBild);
				$alle_kaufen[] = chop($nKaufen);
				$alle_dateinr[] = substr($file, 2) - 1;
			}
		}
	}
	/*Zeigt alle EintrÃ¤ge der Kategorie $k,
	 *wenn $k != 0
	 */
	function zeigeEintraege($k) {
		global $alle_bezeichnung, $alle_kategorie, $alle_beschreibung, $alle_bild, $alle_kaufen, $alle_dateinr;
		echo "<table border=\"0\" cellspacing=\"0\" cellpadding=\"2\">\n";
		$farbzaehler = 0;
		for ($i = 0; $i < count($alle_bezeichnung); $i++) {
			if ($k == "" || $k == chop($alle_kategorie[$i])) {
				$farbe = ($farbzaehler++ % 2 == 0 ? " style=\"background-color:#AAFFAA\"" : "");
				echo " <tr$farbe>\n";
				echo "  <td class=\"wstdbild\"><img src=\"" . $alle_bild[$i] . "\" /><td>\n";
				echo "  <td class=\"wstdtext\">";
				echo "<span class=\"wsfn\">Bezeichnung:</span> <span class=\"wsfi\">$alle_bezeichnung[$i]</span><br />\n";
				echo "<span class=\"wsfn\">Kategorie:</span> <span class=\"wsfi\">$alle_kategorie[$i]</span><br />\n";
				echo "<span class=\"wsfn\">Beschreibung:</span> <span class=\"wsfi\">$alle_beschreibung[$i]</span><br />\n";
				echo "<br />";
				if (strlen($alle_kaufen[$i])>1) echo "<a href=\"" . $alle_kaufen[$i] . "\" class=\"wsln\">Kaufen</a> ";
				echo " <a href=\"javascript:statusFenster($alle_dateinr[$i])\" class=\"wsln\">Reservieren</a> ";
				echo link_neues_fenster("?wf=aendern&bearbeite=" . $alle_dateinr[$i], "aendern", "Bearbeiten");
				echo "</td>\n</tr>\n";
			}
		}
		echo "</table>\n";
	}
	
	function zeigeLeeresFormular() {
		return zeigeFormular("", "", "", "", "", "", "", "Neuer Eintrag", "", "hinzu");
	}

	function zeigeFormular($a_bezeichnung, $a_beschreibung, $a_kategorie, $a_bildurl, $a_kaufurl, $a_preisvon, $a_preisbis, $a_ueberschrift, $a_hiddenvalue, $aktion)
	{
		return '<p style="font-size:120%;font-family:sans-serif;font-weight:bold;">' . $a_ueberschrift . '</p>
		<form action="?wf=' . $aktion .'" method="POST" accept-charset="iso-8859-1">
			<div>' . ($a_hiddenvalue != "" ? '<input type="hidden" name="hiddenvalue" value="' . $a_hiddenvalue . '" />' : "") . '
				Bezeichnung<br />
				<input type="text" name="bezeichnung" value="' . utf8_encode($a_bezeichnung) . '" /><br />
				Beschreibung<br />
				<textarea cols="40" rows="3" name="beschreibung">' . utf8_encode($a_beschreibung) . '</textarea><br />
				Kategorie<br />
				<input type="text" name="kategorie" value="' . utf8_encode($a_kategorie) . '" /><br />
				Bild-URL<br />
				<input type="text" name="bildurl" value="' . $a_bildurl . '" /><br />
				Kauf-URL<br />
				<input type="text" name="kaufurl" value="' . $a_kaufurl . '" /><br />
				Preis<br />
				von <input type="text" name="preisvon" value="' . $a_preisvon . '" /> bis <input type="text" name="preisbis" value="' . $a_preisbis . '" /><br />
				<img src="../codeimage.php?code=R4GX" style="width:100px;height:50px;vertical-align:bottom;" />
				<input type="text" size="7" maxlength="4" name="captcha" class="captchabox" /><br />
				<input type="submit" name="hinzu" />
			</div>
		</form>';
	}

	
	/* 1. Schritt: Leeres Formular anzeigen
	 * 2. Schritt: Captcha und Daten prÃ¼fen
	 * 3. Schritt: Datei schreiben, anderes Fenster neu laden, dieses Fenster schlieÃŸen
	 */
	function ws_neu() {
		html_doctypex10();
		html_head();
		echo "<body bgcolor=\"#FFFF99\">\n";
		echo zeigeLeeresFormular();
		
		echo "</body>\n";
	}
	
	function ws_hinzu() {
		html_doctypex10();
		html_head();
		echo "<body bgcolor=\"#FFFF99\">\n";
		global $_POST;
		global $bezeichnung, $beschreibung, $kategorie, $bildurl, $kaufurl, $preisvon, $preisbis, $reserviert, $hiddenvalue, $str_Reserviert;
		if (
			$bezeichnung == "" || $kategorie == "" || strToLower($_POST['captcha']) != strToLower($_SESSION['SPAMGUARD_CODE'])
		) {
			echo zeigeFormular($bezeichnung, $beschreibung, $kategorie, $bildurl, $kaufurl, $preisvon, $preisbis, "Bitte Kategorie und Bezeichnung eingeben", "", "hinzu");
		} else {
			schreibeDaten($bezeichnung, $beschreibung, $kategorie, $bildurl, $kaufurl, $preisvon, $preisbis, "nein", findefreieDatei());
			echo "Neuer Eintrag angelegt.<br />";
			echo link_closeAndReload() . "<br/>";
		}
		echo "</body>\n";	
	}
	
	function link_closeAndReload() {
		return "<a href=\"javascript:opener.parent.lf.neuladen();self.close();\">Zur Ãœbersicht und Fenster schlieÃŸen</a>";
	}
	
	function ws_aendern() {
		global $bezeichnung, $beschreibung, $kategorie, $bildurl, $kaufurl, $preisvon, $preisbis, $reserviert, $hiddenvalue, $str_Reserviert;
		global $_GET;
		//ist der versteckte Wert gesetzt, aktualisiere Daten,
		//ansonsten zeige Formular mit verstecktem Wert
		//echo "Hid: $hiddenvalue<br />";
		html_doctypex10();
		html_head();
		echo "<body bgcolor=\"#FFFF99\">\n";
		if( $hiddenvalue=="bearbeite2" && (
				strToLower($_POST['captcha']) == strToLower($_SESSION['SPAMGUARD_CODE']))
		) {
			//Variablenwerte sichern
			$b_bezeichnung = $bezeichnung;
			$b_beschreibung = $beschreibung;
			$b_kategorie = $kategorie;
			$b_bildurl = $bildurl;
			$b_kaufurl = $kaufurl;
			$b_preisvon = $preisvon;
			$b_preisbis = $preisbis;
			if ($b_bezeichnung != "" && $b_kategorie != "") {
				//Status von $reseviert laden
				liesDaten("ws" . (1+ $_GET['bearbeite']));
				//und alles speichern
				schreibeDaten($b_bezeichnung, $b_beschreibung, $b_kategorie, $b_bildurl, $b_kaufurl, $b_preisvon, $b_preisbis, $reserviert, "ws" . (1+ $_GET['bearbeite']));
				echo 'Ã„nderung erledigt. ' . link_closeAndReload();
			} else {
				//Delete
				unlink("ws" . (1+ $_GET['bearbeite']));
				echo 'Datei gelÃ¶scht. ' . link_closeAndReload();
			}
		} else {
			liesDaten("ws" . (1+ $_GET['bearbeite']));
			echo zeigeFormular($bezeichnung, $beschreibung, $kategorie, $bildurl, $kaufurl, $preisvon, $preisbis, "Bearbeiten", "bearbeite2", "aendern&bearbeite=" . $_GET['bearbeite']);
		}
	}
	
	function ws_status() {
		html_doctypex10();
		html_head();
		echo "<body bgcolor=\"#FFFF99\">\n";
		global $_SESSION, $_GET, $reserviert, $datei;
		liesDaten("ws" . (1+ $_GET['status']));
		$_SESSION['SPAMGUARD_CODE'] = "____";
		
		echo '<script type="text/javascript">
	function zeige() {';
		if ($reserviert == "ja") echo 'var t = "bereits reserviert"; var c = "red";';
		else echo 'var t = "noch nicht reserviert"; var c = "green";';
		echo '
		var mynode = document.getElementById("versteckt");
		while (mynode.hasChildNodes()) {
			mynode.removeChild(mynode.childNodes[0]);
		}
		var newnode = document.createTextNode(t);
		var farbe = document.createAttribute("color");
		farbe.nodeValue = c;
		mynode.setAttributeNode(farbe);
		mynode.appendChild(newnode);
	}
</script>
Dieser Artikel ist <span id="versteckt"><a href="javascript:zeige();" id="av">????????? (aufdecken)</a></span>.<br />
	MÃ¶chten Sie
	<ul>
		<li><a href="'.$datei.'?wf=reserve&reserve=' . $_GET['status'] . '">diesen Artikel reservieren</a>?</li>
		<li><a href="'.$datei.'?wf=reservedel&reservedel=' . $_GET['status'] . '">Ihre Reservierung lÃ¶schen</a>?</li>
		<li><a href="javascript:window.close();">Fenster schlieÃŸen</a></li>
	</ul>';
	}
	
	function ws_reservieren() {
		html_doctypex10();
		html_head();
		echo "<body bgcolor=\"#FFFF99\">\n";
		global $_GET, $_SESSION, $str_Reserviert;
		$aufgabe = $_GET['wf'];
		if (strToLower($_GET['captcha']) != strToLower($_SESSION['SPAMGUARD_CODE'])) {
			echo '<form action="?" method="GET" accept-charset="iso-8859-15">
				<div>
					Sicherheitscode <img src="../codeimage.php?code=R4GX" style="width:100px;height:50px;vertical-align:bottom;" />
					<input type="text" size="7" maxlength="4" name="captcha" class="captchabox" /><br />';
				if ($aufgabe == "reserve") {
						echo '<input type="submit" value="Reservieren" /><input type="hidden" name="wf" value="reserve" /><input type="hidden" name="reserve" value="' . $_GET['reserve'] .'" />'; 
					} else {
							echo '<input type="submit" value="Reservierung lÃ¶schen" /><input type="hidden" name="wf" value="reservedel" /><input type="hidden" name="reservedel" value="' . $_GET['reservedel'] .'" />';
					}
				echo "</div></form>";
			} else {
				//Artikel wird reserviert oder gelÃ¶scht
				$dateiname = "ws" . (1 + $_GET["$aufgabe"]);
				$inhalt = file($dateiname);
				array_push($inhalt, $str_Reserviert . "=ja\n" );
				$fp = fopen($dateiname, "w");
				//Schreibe alles, auÃŸer Reservierungsstatuszeile
				foreach($inhalt as $zeile) {
					$teile = explode("=", $zeile, 2);
					if (strcasecmp($teile[0], $str_Reserviert) != 0) fputs($fp, $zeile);
				}
				if ($aufgabe=="reserve") fputs($fp, $str_Reserviert . "=ja\n");
				if ($aufgabe=="reservedel") fputs($fp, $str_Reserviert . "=nein\n");
				fclose($fp);
				
				echo 'Ã„nderung erledigt. ' . link_closeAndReload();
			}
	}
	
	liesAlleDateien();
	global $bezeichnung, $beschreibung, $kategorie, $bildurl, $kaufurl, $preisvon, $preisbis, $reserviert, $hiddenvalue, $str_Reserviert;
	
	//Ãœbersetze Variablen	
	$bezeichnung  = $_POST['bezeichnung'];
	$kategorie    = $_POST['kategorie'];
	$bildurl      = $_POST['bildurl'];
	$kaufurl      = $_POST['kaufurl'];
	$preisvon     = $_POST['preisvon'];
	$preisbis     = $_POST['preisbis'];
	$beschreibung = $_POST['beschreibung'];
	$hiddenvalue  = $_POST['hiddenvalue'];
	
	switch ($_GET['wf']) {
		case 'lf' : html_bodyleft(); break;
		case 'rf' : html_bodyright(); break;
		case 'neu' : ws_neu(); break;
		case 'hinzu' : ws_hinzu(); break;
		case 'aendern' : ws_aendern(); break;
		case 'status' : ws_status(); break;
		case 'reserve' :
		case 'reservedel' : ws_reservieren(); break;
		default : html_frameset();
		}
?>
