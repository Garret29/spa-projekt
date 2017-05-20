var converter = {
    toAndroidStudioFormat: function (resources) {
        var doc = $.parseXML("<resources/>");
        var xml = doc.getElementsByTagName("resources")[0];

        for (var i = 0; i < resources.length; i++) {
            var json = resources[i];
            var node = doc.createElement('string');
            $(node).text(record.base);
            var attr = document.createAttribute('name');
            attr.value = record.name;
            node.setAttributeNode(attr);
            xml.appendChild(node);
        }
        return xml;
    },
    toVisualStudioFormat: function (resources) {
        var doc = $.parseXML("<root/>");
        var xml = doc.getElementsByTagName("root")[0];

        for (var i = 0; i < resources.length; i++) {
            var record = resources[i];
            var node = doc.createElement('data');
            var attr = document.createAttribute('name');
            attr.value = record.name;
            node.setAttributeNode(attr);
            var childNode = document.createElement('value');
            $(childNode).text(record.base);
            node.appendChild(childNode);
            xml.appendChild(node);
        };
        return xml;
    },
    fromAndroidStudioFormat: function (xml) {
        var obj = [];
        var strings = xml.querySelectorAll('string');
        for (var i = 0, k = strings.length; i < k; i++) {
            obj.push({
                name: strings[i].attributes[0].textContent,
                base: strings[i].textContent
            })
        };
        return obj; // array of objects
    },
    fromVisualStudioFormat: function (xml) {
        var obj = [];
        var strings = xml.querySelectorAll('data');
        for (var i = 0, k = strings.length; i < k; i++) {
            obj.push({
                name: strings[i].attributes[0].textContent,
                base: strings[i].children[0].textContent
            })
        };
        return obj; // array of objects
    }
}