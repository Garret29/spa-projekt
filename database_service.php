<?php

header("Content-Type: application/json; charset=UTF-8");

if (isset($_GET['q']) && is_numeric($_GET['q'])) {

    $id = $_GET['q'];

    require_once 'SQLite_Database.php';
    $oDatabase = SQLite_Database::prepareDatabase();

    if ($row = $oDatabase->getRecordAssocById($id)) 
        echo json_encode($row);
    else {
        $result['response'] = "Nie ma zapisanego rekordu o takim id.";
        echo json_encode($result);
    }

} else if (isset($_POST['serializedContent']) && isset($_POST['password'])) {

    $row['password'] = $_POST['password'];
    $row['serializedContent'] = $_POST['serializedContent'];

    require_once 'SQLite_Database.php';
    $oDatabase = SQLite_Database::prepareDatabase();

    $result['lastId'] = $oDatabase->addRecordAndGetHisId($row);
    echo json_encode($result);

} else {

    $result['response'] = "Brak requestu..";
    echo json_encode($result);
}

?>