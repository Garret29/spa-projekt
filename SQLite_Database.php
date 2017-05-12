<?php

class SQLite_Database {

    private $pdo;

    public function connectDataBase() {
        try {
            $this->pdo = new PDO("sqlite:database.sqlite");
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

    public function getRecordAssocById($id) {
        $query = $this->pdo->prepare('SELECT * FROM records WHERE id = :id LIMIT 1');
        $query->bindValue(':id', $id, PDO::PARAM_INT);
        $query->execute();
        return $query->fetch(PDO::FETCH_ASSOC);
    }

    public function addRecordAndGetHisId($row) {
        $query = $this->pdo->prepare(
            'INSERT INTO records (password, serializedContent)
            VALUES (:password, :serializedContent)'
        );
        $query->bindValue(':password', $row['password'], PDO::PARAM_STR);
        $query->bindValue(':serializedContent', $row['serializedContent'], PDO::PARAM_STR);
        $query->execute();
        return $this->pdo->lastInsertId();
    }
}

?>