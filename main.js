var $inputBlock;
var $form;
var $title;
var $resultsBlock;
var $resultsContent;

$(document).ready(function() {
    $inputBlock = $('#searchInputBlock');
    $form = $inputBlock.find('.js-search-form');
    $title = $form.find('.js-title');

    $resultsBlock = $('#searchResultsBlock');
    $resultsContent = $resultsBlock.find('.js-content');

    $form.on('submit', function(e) {
        getArticles($title.val());
        e.preventDefault();
    });
});

function getArticles(title) {
    var url = 'https://en.wikipedia.org/w/api.php?action=query&formatversion=2&generator=prefixsearch' +
        '&gpslimit=10&prop=pageimages|pageterms&piprop=thumbnail&pithumbsize=50&pilimit=10' +
        '&redirects=&wbptterms=description&format=json&callback=?&gpssearch=' + title;

    $.getJSON(url, function(json) {
        clearSearchResults();
        json.query.pages.forEach(function(value) {
            addEntry(value);
        });
    });
}

function addEntry(entry) {
    var entryContainer = document.createElement('div');
    var entryItem;

    entryContainer.classList.add('entry-container');

    entryItem = document.createElement('div');
    entryItem.classList.add('row');

    addEntryThumbnail(entry, entryItem);
    addEntryTextElements(entry, entryItem);

    entryContainer.appendChild(entryItem);
    $resultsContent.append(entryContainer);
}

function addEntryThumbnail(entry, entryItem) {
    var thumbnailContainer = document.createElement('div');
    var thumbnail;

    thumbnailContainer.classList.add('col-sm-1');

    thumbnail = getThumbnail(entry.thumbnail);
    thumbnailContainer.appendChild(thumbnail);
    entryItem.appendChild(thumbnailContainer);
}

function addEntryTextElements(entry, entryItem) {
    var textElementsContainer = document.createElement('div');
    var textElements;

    textElementsContainer.classList.add('col-sm-11');

    textElements = [
        getTitle(entry.title),
        getDescription(entry.terms),
        getPageLink(entry.pageid)
    ];

    textElements.forEach(function(element) {
        if (element) {
            textElementsContainer.appendChild(element);
        }
    });

    entryItem.appendChild(textElementsContainer);
}

function getThumbnail(entryThumbnail) {
    var thumbnail = document.createElement('img');
    if (entryThumbnail) {
        thumbnail.src = entryThumbnail.source;
    } else {
        thumbnail.src = 'https://cdn1.iconfinder.com/data/icons/hawcons/32/699055-icon-65-document-image-48.png';
    }
    return thumbnail;
}


function getTitle(entryTitle) {
    var title = document.createElement('h4');
    title.classList.add('snippet-title');
    title.innerText = entryTitle;
    return title;
}


function getDescription(entryTerms) {
    var description;

    if (entryTerms) {
        description = document.createElement('p');
        description.innerText = entryTerms.description[0];
        return description;
    }

    return false;
}


function getPageLink(pageId) {
    var fullPageLink = document.createElement('a');
    fullPageLink.href = 'http://en.wikipedia.org/?curid=' + pageId;
    fullPageLink.target = '_blank';
    fullPageLink.innerText = 'Read more...';
    fullPageLink.classList.add('a-custom');
    return fullPageLink;
}


function clearSearchResults() {
    $resultsContent.empty();
    $title.val('');
}
