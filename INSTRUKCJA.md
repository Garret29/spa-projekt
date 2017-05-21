# spa-projekt

Aplikacja wspomagająca tłumaczenie jest uruchamiana w web kontenerze tomcat9
zaimplementowanym w aplikację serwerową(web-api łączące z bazą danych translacji) napisaną w javie.
Są dostępne dwie wersje serwera: korzystająca z bazy danych psql dostępnej na serwerach UEK oraz bazy h2dp działającej
w pamięci operacyjnej(wersja szybsza, do testów).


(WAŻNE, system musi mieć wolny port 8080 oraz 5432 dla wersji psql)
Aplikację można uruchomić na dwa sposoby:
1. uruchomić wybrany plik .jar znajdujący się w katalogu /target i przejście w przeglądarce na adress localhost:8080
2. uruchomić wybrany skrypt startowy Launch - psql.bat lub Launch - h2db.bat, domyślna przeglądarką automatycznie uruchomi stronę
(prawdopodobnie trzeba ją będzie jeszcze odświeżyć gdyż serwer może się długo uruchamiać ~1min)
