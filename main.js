var $inputBlock;
var $form;
var $title;
var $resultsBlock;
var $resultsContent;

$(document).ready(function(){
    $inputBlock = $('#searchInputBlock');
    $form = $inputBlock.find('.js-search-form');
    $title = $form.find('.js-title');

    $resultsBlock = $('#searchResultsBlock');
    $resultsContent = $resultsBlock.find('.js-content');

    $('.js-search-form').on('submit', function(e){
        getArticles($title.val());
        e.preventDefault();
    });
});

function getArticles(title){
    var url = 'https://en.wikipedia.org/w/api.php?action=query&formatversion=2&generator=prefixsearch' +
        '&gpslimit=10&prop=pageimages|pageterms&piprop=thumbnail&pithumbsize=50&pilimit=10' +
        '&redirects=&wbptterms=description&format=json&callback=?&gpssearch='+title;
    $.getJSON(url, function(json){
        clearSearchResults();
        $.each(json.query.pages,function(index,value){
            addEntry(value)
        });
    });

}

function addEntry(entry){
    var entryItem = document.createElement('div');
    entryItem.classList.add('well');

    entryItem.appendChild(getThumbnail(entry.thumbnail));
    entryItem.appendChild(getTitle(entry.title));
    entryItem.appendChild(getDescription(entry.terms));
    entryItem.appendChild(getPageLink(entry.pageid));

    $resultsContent.append(entryItem);
}

function getThumbnail(entryThumbnail){
    if(entryThumbnail){
        var thumbnail = document.createElement('img');
        thumbnail.src = entryThumbnail.source;
        return thumbnail
    }
}

function getTitle(entryTitle){
    var title = document.createElement('h4');
    title.classList.add('snippet-title');
    title.innerText = entryTitle;
    return title;
}

function getDescription(entryTerms){
    if(entryTerms) {
        var description = document.createElement('p');
        description.innerText = entryTerms.description[0];
        return description;
    }
}

function getPageLink(pageId) {
    var fullPageLink = document.createElement('a');
    fullPageLink.href = 'http://en.wikipedia.org/?curid=' + pageId;
    fullPageLink.target = '_blank';
    fullPageLink.innerText = 'Read more...';
    return fullPageLink;
}

function clearSearchResults(){
    $resultsContent.empty();
    $title.val('');
}
