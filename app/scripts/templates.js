/* global Handlebars:false*/

'use strict';

var Templates = {};

Templates.templatesCache = {};
Templates.baseUrl = 'templates/';

Templates.get = function(template, noCache){
    var url = this.baseUrl + template;

    if (!noCache && Templates.templatesCache[url]) {
        var def = $.Deferred().resolve(Templates.templatesCache[url]);
        return def.promise();
    } else {
        return $.get(url).promise().then(function(tmpl){
            Templates.templatesCache[url] = tmpl;
            return tmpl;
        });
    }
};

Templates.build = function(template, data, noCache) {
  return Templates.get(template, noCache).then(function(html){
    var tmpl = Handlebars.compile(html);

    data = data ? data : {};

    return tmpl(data);
  });
};
