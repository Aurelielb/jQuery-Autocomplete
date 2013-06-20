jQuery-Autocomplete
===================

Simple jQuery autocomplete, in ajax

    
Example :
$('#searchBar').find('.searchBarInput').autoComplete(
    {
        'source': '/remote/search_suggest.php',
        'minLength': 2
    }
);
