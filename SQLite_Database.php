<?php

class SQLite_Database {

    private $pdo;

    public function connectDataBase() {
        try {
            $this->pdo = new PDO("sqlite:database_name.sqlite");
        }
        catch (PDOException $e) {
            echo $e->getMessage();
            exit();
        }
    }

    public function createTableIfNotExists() {
        $this->pdo->exec(
            "CREATE TABLE IF NOT EXISTS records (
            id INTEGER PRIMARY KEY,
            password TEXT,
            serializedContent TEXT
            )"
        );
    }

    public function dropTable() {
        $this->pdo->exec("DROP TABLE records");
    }

    public function getRecords() {
        $query = $this->pdo->prepare('SELECT * FROM records');
        if ($query->execute())
            return $query->fetchAll(PDO::FETCH_ASSOC);
        else
            return false;
    }

    public function getRecord($id, $sPassword) {
        $query = $this->pdo->prepare('SELECT * FROM records WHERE id = :id AND password = :password LIMIT 1');
        $query->bindValue(':id', $id, PDO::PARAM_INT);
        $query->bindValue(':password', $sPassword, PDO::PARAM_STR);
        if ($query->execute())
            return $query->fetch(PDO::FETCH_ASSOC);
        else
            return false;
    }

    public function addRecordAndGetHisId($sPassword, $sSerializedContent) {
        $query = $this->pdo->prepare(
            'INSERT INTO records (password, serializedContent)
            VALUES (:password, :serializedContent)'
        );
        $query->bindValue(':password', $sPassword, PDO::PARAM_STR);
        $query->bindValue(':serializedContent', $sSerializedContent, PDO::PARAM_STR);
        if ($query->execute())
            return $this->pdo->lastInsertId();
        else
            return false;
    }

    public function changeRecordAndGetHisId($id, $sPassword, $sSerializedContent) {
        $query = $this->pdo->prepare(
            'UPDATE records SET serializedContent = :serializedContent
            WHERE id = :id AND password = :password'
        );
        $query->bindValue(':id', $id, PDO::PARAM_INT);
        $query->bindValue(':password', $sPassword, PDO::PARAM_STR);
        $query->bindValue(':serializedContent', $sSerializedContent, PDO::PARAM_STR);
        if ($query->execute() && $query->rowCount() > 0)
            return $id;
        else
            return false;
    }

    public static function prepareDatabase() {
        $oDatabase = new SQLite_Database();
        $oDatabase->connectDataBase();
        $oDatabase->createTableIfNotExists();
        return $oDatabase;
    }
}

?>