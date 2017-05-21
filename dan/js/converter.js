var converter = {
    toAndroidStudioFormat: function (resources, column) {
        var doc = $.parseXML("<resources/>");
        var xml = doc.getElementsByTagName("resources")[0];

        for (var i = 0; i < resources.length; i++) {
            var record = resources[i];
            var node = doc.createElement('string');
            $(node).text(record[column]);
            var attr = document.createAttribute('name');
            attr.value = record.name;
            node.setAttributeNode(attr);
            xml.appendChild(node);
        }
        return xml;
    },
    toVisualStudioFormat: function (resources, column) {
        var doc = $.parseXML("<root/>");
        var xml = doc.getElementsByTagName("root")[0];

        for (var i = 0; i < resources.length; i++) {
            var record = resources[i];
            var node = doc.createElement('data');
            var attr = document.createAttribute('name');
            attr.value = record.name;
            node.setAttributeNode(attr);
            var childNode = doc.createElement('value');
            $(childNode).text(record[column]);
            node.appendChild(childNode);
            xml.appendChild(node);
        };
        return xml;
    },
    fromAndroidStudioFormat: function (xml, lang) {
        var obj = [];
        var strings = xml.querySelectorAll('string');
        for (var i = 0, k = strings.length; i < k; i++) {
            obj.push({
                name: strings[i].attributes[0].textContent,
                [lang]: strings[i].textContent
            })
        };
        return obj;
    },
    fromVisualStudioFormat: function (xml, lang) {
        var obj = [];
        var strings = xml.querySelectorAll('data');
        for (var i = 0, k = strings.length; i < k; i++) {
            obj.push({
                name: strings[i].attributes[0].textContent,
                [lang]: strings[i].children[0].textContent
            })
        };
        return obj;
    }
}