const app = angular.module('translationApp', []);

app.controller('gridCtrl', ['$scope', function ($scope) {
    $scope.resources = [{name: ''}];

    $scope.clearGrid = function () {
        $scope.resources = [{name: ''}];
        $scope.isLoadedFromDatabase = false;
    };

    $scope.addResource = function () {

        const source = $scope.resources[0];
        const emptyObject = {};
        for (let key in source) {
            if (source.hasOwnProperty(key)) {
                emptyObject[key] = '';
            }
        }
        $scope.resources.push(emptyObject);
    };

    $scope.addLang = function (lang) {
        if (lang !== '') {
            let i = 0;
            const k = $scope.resources.length;
            for (; i < k; i++)
                if (!$scope.resources[i][lang])
                    $scope.resources[i][lang] = '';
        }
    };

    $scope.setMainLang = function (lang) {
        let xmlDoc;
        if (lang !== null && lang.value !== '') {
            if ($scope.fileType !== null) {

                if ($scope.fileType === 'xml') {
                    xmlDoc = new DOMParser().parseFromString($scope.fileContent, "text/xml");
                    $scope.resources = converter.fromAndroidStudioFormat(xmlDoc, lang.value);
                    $scope.isLoadedFromDatabase = false;
                } else if ($scope.fileType === 'resw') {
                    xmlDoc = new DOMParser().parseFromString($scope.fileContent, "text/xml");
                    $scope.resources = converter.fromVisualStudioFormat(xmlDoc, lang.value);
                    $scope.isLoadedFromDatabase = false;
                }
            }
        }
    };

    $scope.loadData = function (input) {
        const file = input.files[0];

        if (file) {
            const reader = new FileReader();
            reader.readAsText(file, "UTF-8");

            reader.onload = function (evt) {
                let result = [{name: ''}];

                if (file.name.endsWith(".json")) {
                    result = JSON.parse(evt.target.result).resources;

                    $scope.$apply(function () {
                        $scope.resources = result;
                    });

                    $scope.isLoadedFromDatabase = false;

                } else if (file.name.endsWith(".xml")) {
                    $scope.fileType = 'xml';
                    $scope.fileContent = evt.target.result;
                    $('#modal-set-lang').modal('show');

                } else if (file.name.endsWith(".resw")) {
                    $scope.fileType = 'resw';
                    $scope.fileContent = evt.target.result;
                    $('#modal-set-lang').modal('show');
                }

                input.value = '';
            };
            reader.onerror = function (evt) {
                $scope.$apply(function () {
                    $scope.resources = [{name: ''}];
                });
                input.value = '';
            }
        }
    };

    $scope.translate = function (row, column) {

        if ($scope.showTranslation) {
            if (column > 1) {

                const sourceLang = Object.keys($scope.resources[0])[1];
                const targetLang = Object.keys($scope.resources[0])[column];
                const text = $scope.resources[row][Object.keys($scope.resources[0])[1]];

                $('#translation').text('');

                $.ajax({
                    url: 'http://www.transltr.org/api/translate',
                    method: 'post',
                    data: {
                        text: text,
                        from: sourceLang,
                        to: targetLang
                    },
                    success: function (response) {
                        $('#translation').append(
                            '<p class="navbar-text"><span class="glyphicon glyphicon-transfer" aria-hidden="true"></span> ' +
                            response.translationText +
                            '</p>'
                        );
                    }
                });

                $.ajax({
                    url: 'https://translate.googleapis.com/translate_a/single',
                    method: 'get',
                    data: {
                        client: 'gtx',
                        sl: sourceLang,
                        tl: targetLang,
                        dt: 't',
                        q: text
                    },
                    success: function (response) {
                        $('#translation').append(
                            '<p class="navbar-text"><span class="glyphicon glyphicon-transfer" aria-hidden="true"></span> ' +
                            response[0][0][0] +
                            '</p>'
                        );
                    }
                });
            }
        }
        ;
    };

    $scope.share = function () {

        let requestData;
        if ($scope.isLoadedFromDatabase === true) {
            requestData = {
                password: document.getElementById('inputPassword2').value,
                serializedJSON: JSON.stringify({resources: $scope.resources}),
                id: $scope.id,
            };
        } else {
            requestData = {
                password: document.getElementById('inputPassword2').value,
                serializedJSON: JSON.stringify({resources: $scope.resources})
            };
        }
        console.log($scope.isLoadedFromDatabase, requestData);


        $.ajax({
            url: "/translations",
            method: "post",
            contentType: "application/json",
            data: JSON.stringify(requestData),
            success: function (data, text, xhr) {
                const url = xhr.getResponseHeader('Location');
                const index = url.lastIndexOf("/");
                $scope.$apply(function () {
                    $scope.id = url.substring(index + 1);
                    document.getElementById('infoSaveDatabase').textContent = "Zapisano dane, ID to " + url.substring(index + 1);
                })
            },
            error(){
                document.getElementById('infoSaveDatabase').textContent = "Wystąpił błąd"
            }
        })
    };

    $scope.loadFromDatabase = function () {
        const id = $("#inputID").val();
        const pass = $("#inputPassword").val();
        let url = "/translations/" + id;

        if (pass !== "") {
            url = url + "?pass=" + pass;
        }

        $.ajax({
            url:url,
            method: "get",
            contentType: "application/json",
            dataType: "text",
            async:false,
            success: function (data) {
                if(data!==null){
                    const json = JSON.parse(data);
                    $scope.resources = json.resources;
                    $scope.id = id;
                    $scope.isLoadedFromDatabase = true;
                    document.getElementById('infoLoadDatabase').textContent = "Wczytano dane"
                }
            },
            error(){
                document.getElementById('infoLoadDatabase').textContent = "Błędne ID lub hasło"
            }
        });
    /*
        $.ajax({
            url: config.url,
            method: 'post',
            data: {
                protokol: 'get-record',
                id: parseInt(document.getElementById('inputID').value),
                password: document.getElementById('inputPassword').value
            },
            success: function (response) {
                document.getElementById('infoLoadDatabase').textContent = response.message;
                if (response.grid !== null) {
                    $scope.$apply(function () {
                        $scope.resources = JSON.parse(response.grid).resources;
                    });
                    $scope.$apply(function () {
                        $scope.id = id;
                    });
                    $scope.isLoadedFromDatabase = true;
                }
            }
        });
        */
    };

    $scope.saveAsJSON = function () {

        const json = {resources: $scope.resources};
        const serializedJSON = JSON.stringify(json);
        const filename = "resources";
        downloadHelper.download(filename + ".json", serializedJSON);
    };

    $scope.saveAsAS = function (column) {
        if (column !== null) {
            const xml = converter.toAndroidStudioFormat($scope.resources, column);
            let xmlText = new XMLSerializer().serializeToString(xml);
            xmlText = '<?xml version="1.0" encoding="utf-8"?>' + xmlText;
            const filename = "strings";
            downloadHelper.download(filename + ".xml", xmlText);
        }
    };

    $scope.saveAsVS = function (column) {
        if (column !== null) {
            const xml = converter.toVisualStudioFormat($scope.resources, column);
            let xmlText = new XMLSerializer().serializeToString(xml);
            xmlText = '<?xml version="1.0" encoding="utf-8"?>' + xmlText;
            const filename = "Resources";
            downloadHelper.download(filename + ".resw", xmlText);
        }
    };

    $scope.saveToLocalStorage = function () {
        const serializedJSON = JSON.stringify($scope.resources);
        localStorage.setItem("translations", serializedJSON)
    };

    $scope.loadFromLocalStorage = function () {
        const serializedJSON = localStorage.getItem("translations");
        if (serializedJSON !== null)
            $scope.resources = JSON.parse(serializedJSON);

        $scope.isLoadedFromDatabase = false;
    }
}]);

app.controller('selectCtrl', function ($scope) {
    $scope.options = [
        {
            "text": "Dodaj język",
            "value": ""
        },
        {
            "text": "angielski",
            "value": "en"
        },
        {
            "text": "francuski",
            "value": "fr"
        },
        {
            "text": "hiszpański",
            "value": "es"
        },
        {
            "text": "niemiecki",
            "value": "de"
        },
        {
            "text": "norweski",
            "value": "no"
        },
        {
            "text": "polski",
            "value": "pl"
        },
        {
            "text": "portugalski",
            "value": "pt"
        },
        {
            "text": "rosyjski",
            "value": "ru"
        },
        {
            "text": "szwedzki",
            "value": "sv"
        },
        {
            "text": "ukraiński",
            "value": "uk"
        },
        {
            "text": "włoski",
            "value": "it"
        }
    ];
    $scope.selectedItem = $scope.options[0];
});