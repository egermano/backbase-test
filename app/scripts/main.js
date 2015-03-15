/* global Templates:false*/

'use strict';

(function($){
  var App = {};

  App.totalItems = 10;

  App.init = function(){
    this.loadData(this.totalItems).then(function(data){
      var items = App.sortItems(data.items);

      $('#feed-title').text(data.title);
      $('#feed-description').text(data.description);

      return items.forEach(function(item){
        App.buildItem(item).then(function(element){
          $('#feed').append(element);
        });
      });

    }).then(function(){
      return $('#feed article').click(function(){
        $(this).toggleClass('selected');
      });
    }).then(function(){
      $('#feed').masonry({
        columnWidth: 10,
        itemSelector: '.item'
      });

    }).then(function(){
      // reveal all
      setTimeout(function(){
        $('#floatingBarsG').hide();
        $('.hidden').css('display', 'none').removeClass('hidden').fadeIn('fast');
        $('#feed').masonry();
      }, 1500);
    });
  };

  App.loadData = function(total){
    return $.get('http://pipes.yahoo.com/pipes/pipe.run?_id=DqsF_ZG72xGLbes9l7okhQ&_render=json').then(function(data){
      var response = {};

      response.title = data.value.title;
      response.description = data.value.description;
      response.items = data.value.items.splice(0,total);

      return response;
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

  App.buildItem = function(item){
    // get image

    if (item.enclosure) {
      item.image = item.enclosure.url;
    } else if (item['media:content']) {
      item.image = item['media:content'].url;
    } else if (item['media:thumbnail']) {
      item.image = item['media:thumbnail'].url;
    } else {
      var $temp = $('<div>', {html: item.description}),
          $img = $('img', $temp);

      if ($img[0]) { item.image = $($img[0]).attr('src');}
    }

    // prepare description
    item.description = $('<p>', {html: item.description}).text();
    if (item.description.length > 80) { item.shortDescription = item.description.substr(0, 77) + '...'; }

    return Templates.build('item.html', item);
  };

  App.init();
})(jQuery);
