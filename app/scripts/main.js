'use strict';

(function($){
  var App = {};

  App.totalItems = 10;

  App.init = function(){
    this.loadData(this.totalItems).then(function(data){
      data = App.sortItems(data);
      console.log(data);
    });
  };

  App.loadData = function(total){
    return $.get('http://pipes.yahoo.com/pipes/pipe.run?_id=DqsF_ZG72xGLbes9l7okhQ&_render=json').then(function(data){
      return data.value.items.splice(0,total);
    });
  };

  App.sortItems = function(items){
    // create attribute with locale date and time
    for (var i = items.length - 1; i >= 0; i--) {
      var newDate = new Date(items[i].pubDate);
      items[i].localeDate = newDate.toLocaleDateString();
      items[i].localeTime = newDate.toLocaleTimeString();
    }

    return items.sort(function(a, b){
      var dateA = new Date(a.pubDate),
          dateB = new Date(b.pubDate);

      return dateA < dateB;
    });
  };

  App.buildItem = function(){

  };

  App.init();
})(jQuery);
