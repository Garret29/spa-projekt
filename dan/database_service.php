<?php

header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if (isset($_POST['protokol'])) {

        require_once 'SQLite_Database.php';
        $oDatabase = SQLite_Database::prepareDatabase();

        if ($_POST['protokol'] == "get-record") {
            if (isset($_POST['id']) && isset($_POST['password'])) {

                if ($row = $oDatabase->getRecord($_POST['id'], $_POST['password'])) {
                    $result['id'] = $row['id'];
                    $result['grid'] = $row['serializedContent'];
                    $result['message'] = "Wykonano pomyślnie";
                } else $result['message'] = "Błędne id lub hasło.";
            } else $result['message'] = "Niepoprawne, bądź brakuje parametrów";
        } else if ($_POST['protokol'] == "add-record") {
            if (isset($_POST['password']) && isset($_POST['serializedContent'])) {

                if ($id = $oDatabase->addRecordAndGetHisId($_POST['password'], $_POST['serializedContent'])) {
                    $result['id'] = $id;
                    $result['message'] = "Udostępnienie jest dostępne pod ID: " . $id;
                } else $result['message'] = "Coś poszło nie tak.";
            } else $result['message'] = "Niepoprawne, bądź brakuje parametrów";
        } else if ($_POST['protokol'] == "change-record") {
            if (isset($_POST['id']) && isset($_POST['password']) && isset($_POST['serializedContent'])) {
            
                if ($id = $oDatabase->changeRecordAndGetHisId($_POST['id'], $_POST['password'], $_POST['serializedContent'])) {
                    $result['id'] = $id;
                    $result['message'] = "Udostępnienie tak jak zawsze, czyli " . $id . " ;)";
                } else $result['message'] = "Prawdopodobnie hasło się nie zgadza.";
            } else $result['message'] = "Niepoprawne, bądź brakuje parametrów";
        } else $result['message'] = "Czym baza danych może służyć..?";
    } else $result['message'] = "Nie, nie, tak requestów nie wysyłamy..";
    echo json_encode($result);

} else if ($_SERVER['REQUEST_METHOD'] === 'GET') { 

    if (isset($_GET['pass'])) {

        require_once 'SQLite_Database.php';
        $oDatabase = SQLite_Database::prepareDatabase();

        if ($_GET['pass'] == '123456q') {

            print_r($oDatabase->getRecords());
        } else if ($_GET['pass'] == 'asqwerty') {
            
            $oDatabase->dropTable();
            echo "Usunięcie rekordów z bazy danych";
        }
    }
}

?>