jQuery-Autocomplete
===================

This plugin shows the results returned by an ajax query, then place it below the field.<br/>
It manages a few key behaviors.

    
Example:
$('#searchBar').find('.searchBarInput').autoComplete(
    {
        'source': '/remote/search_suggest.php',
        'minLength': 2
    }
);


## Parameters ##

#### minLength ####
Minimum number of characters to start the auto completion

#### source ####
URL to your suggestion script (it must return JSON)

#### onCreate ####
#### onCreateItem ####
#### onSelect ####
#### values ####
An array of values returned by the json.<br/>
First parameter is used to fill the field.<br/>

Example:<br/>
["value","label","url"]

#### pattern ####
A pattern to show your values as you like<br/>

Example: <br/>
<code>
&lt;a href="%url%"&gt;%label%&lt;/a&gt;
</code>

#### name ####
A new id if you need a particular one

#### disableClass ####
#### autoWidth ####
activate auto sizing of the list

#### delay ####
The time between typing and ajax call, in milliseconds
