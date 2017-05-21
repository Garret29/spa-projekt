const converter = {
    toAndroidStudioFormat: function (resources, column) {
        const doc = $.parseXML("<resources/>");
        const xml = doc.getElementsByTagName("resources")[0];

        for (let i = 0; i < resources.length; i++) {
            const record = resources[i];
            const node = doc.createElement('string');
            $(node).text(record[column]);
            const attr = document.createAttribute('name');
            attr.value = record.name;
            node.setAttributeNode(attr);
            xml.appendChild(node);
        }
        return xml;
    },
    toVisualStudioFormat: function (resources, column) {
        const doc = $.parseXML("<root/>");
        const xml = doc.getElementsByTagName("root")[0];

        for (let i = 0; i < resources.length; i++) {
            const record = resources[i];
            const node = doc.createElement('data');
            const attr = document.createAttribute('name');
            attr.value = record.name;
            node.setAttributeNode(attr);
            const childNode = document.createElement('value');
            $(childNode).text(record[column]);
            node.appendChild(childNode);
            xml.appendChild(node);
        }
        return xml;
    },
    fromAndroidStudioFormat: function (xml, lang) {
        const obj = [];
        const strings = xml.querySelectorAll('string');
        let i = 0;
        const k = strings.length;
        for (; i < k; i++) {
            obj.push({
                name: strings[i].attributes[0].textContent,
                [lang]: strings[i].textContent
            })
        }
        return obj;
    },
    fromVisualStudioFormat: function (xml, lang) {
        const obj = [];
        const strings = xml.querySelectorAll('data');
        let i = 0;
        const k = strings.length;
        for (; i < k; i++) {
            obj.push({
                name: strings[i].attributes[0].textContent,
                [lang]: strings[i].children[0].textContent
            })
        }
        return obj;
    }
};