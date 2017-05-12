<?php

header("Content-Type: application/json; charset=UTF-8");

if (isset($_GET['q']) && is_numeric($_GET['q'])) {

    $id = $_GET['q'];
    
    $result['response'] = "GET: " . $id;
    echo json_encode($result);

} else if (isset($_POST['serializedContent'])) {

    $row['serializedContent'] = $_POST['serializedContent'];

    $result['response'] = "POST: " . $row['serializedContent'];
    echo json_encode($result);

} else {

    $result['response'] = "Brak requestu..";
    echo json_encode($result);
}

?>