<?php

header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if (isset($_POST['protokol'])) {

        require_once 'SQLite_Database.php';
        $oDatabase = SQLite_Database::prepareDatabase();

        if ($_POST['protokol'] == "get-record") {
            if (isset($_POST['id']) && is_numeric($_POST['id']) && isset($_POST['password'])) {

                if ($row = $oDatabase->getRecord($_POST['id'], $_POST['password'])) {
                    $result['id'] = $row['id'];
                    $result['grid'] = $row['serializedContent'];
                    $result['message'] = "Wykonano pomyślnie";
                } else $result['message'] = "Nie ma zapisanego rekordu o takim id.";
            }
        } else if (false) {

        } else if (false) {
            
        } else $result['message'] = "Czym baza danych może służyć..?";
    } else $result['message'] = "Nie, nie, tak requestów nie wysyłamy..";
    echo json_encode($result);
}

?>