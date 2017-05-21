var app = angular.module('translationApp', []);

app.controller('gridCtrl', ['$scope', function ($scope) {
    $scope.resources = [{ name: '' }];

    $scope.clearGrid = function () {
        $scope.resources = [{ name: '' }];
        $scope.isLoadedFromDatabase = false;
    }

    $scope.addResource = function () {

        var source = $scope.resources[0];
        var emptyObject = {};
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                emptyObject[key] = '';
            }
        }
        $scope.resources.push(emptyObject);
    }

    $scope.addLang = function (lang) {
        if (lang != '') {
            for (var i = 0, k = $scope.resources.length; i < k; i++)
                if (!$scope.resources[i][lang])
                    $scope.resources[i][lang] = '';
        }
    }

    $scope.setMainLang = function (lang) {
        if (lang != null && lang.value != '') {
            if ($scope.fileType != null) {

                if ($scope.fileType == 'xml') {
                    var xmlDoc = new DOMParser().parseFromString($scope.fileContent, "text/xml");
                    $scope.resources = converter.fromAndroidStudioFormat(xmlDoc, lang.value);
                    $scope.isLoadedFromDatabase = false;
                } else if ($scope.fileType == 'resw') {
                    var xmlDoc = new DOMParser().parseFromString($scope.fileContent, "text/xml");
                    $scope.resources = converter.fromVisualStudioFormat(xmlDoc, lang.value);
                    $scope.isLoadedFromDatabase = false;
                }
            }
        }
    }

    $scope.loadData = function (input) {
        var file = input.files[0];

        if (file) {
            var reader = new FileReader();
            reader.readAsText(file, "UTF-8");

            reader.onload = function (evt) {
                var result = [{ name: '' }];

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
                    $scope.resources = [{ name: '' }];
                });
                input.value = '';
            }
        }
    };

    $scope.translate = function (row, column) {

        if ($scope.showTranslation) {
            if (column > 1) {

                var sourceLang = Object.keys($scope.resources[0])[1];
                var targetLang = Object.keys($scope.resources[0])[column];
                var text = $scope.resources[row][Object.keys($scope.resources[0])[1]];

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
        };
    };

    $scope.share = function () {

        var requestData;
        if ($scope.isLoadedFromDatabase == true) {
            requestData = {
                protokol: 'change-record',
                password: document.getElementById('inputPassword2').value,
                serializedContent: JSON.stringify({ resources: $scope.resources }),
                id: $scope.id
            }
        } else {
            requestData = {
                protokol: 'add-record',
                password: document.getElementById('inputPassword2').value,
                serializedContent: JSON.stringify({ resources: $scope.resources })
            }
        }
        console.log($scope.isLoadedFromDatabase, requestData);

        $.ajax({
            url: config.url,
            method: 'post',
            data: requestData,
            success: function (response) {
                document.getElementById('infoSaveDatabase').textContent = response.message;

                if (response.id != null) {
                    $scope.$apply(function () {
                        $scope.id = response.id;
                    });
                    $scope.isLoadedFromDatabase = true;
                };
            }
        });
    };

    $scope.loadFromDatabase = function () {
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
                if (response.grid != null) {
                    $scope.$apply(function () {
                        $scope.resources = JSON.parse(response.grid).resources;
                    });
                    $scope.$apply(function () {
                        $scope.id = response.id;
                    });
                    $scope.isLoadedFromDatabase = true;
                };
            }
        });
    }

    $scope.saveAsJSON = function () {

        var json = { resources: $scope.resources };
        var serializedJSON = JSON.stringify(json);
        var filename = "resources";
        downloadHelper.download(filename + ".json", serializedJSON);
    }

    $scope.saveAsAS = function (column) {
        if (column != null) {
            var xml = converter.toAndroidStudioFormat($scope.resources, column);
            var xmlText = new XMLSerializer().serializeToString(xml);
            xmlText = '<?xml version="1.0" encoding="utf-8"?>' + xmlText;
            var filename = "strings";
            downloadHelper.download(filename + ".xml", xmlText);
        }
    }

    $scope.saveAsVS = function (column) {
        if (column != null) {
            var xml = converter.toVisualStudioFormat($scope.resources, column);
            var xmlText = new XMLSerializer().serializeToString(xml);
            xmlText = '<?xml version="1.0" encoding="utf-8"?>' + xmlText;
            var filename = "Resources";
            downloadHelper.download(filename + ".resw", xmlText);
        }
    }

    $scope.saveToLocalStorage = function () {
        var serializedJSON = JSON.stringify($scope.resources);
        localStorage.setItem("translations", serializedJSON)
    };

    $scope.loadFromLocalStorage = function () {
        var serializedJSON = localStorage.getItem("translations");
        if (serializedJSON != null)
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