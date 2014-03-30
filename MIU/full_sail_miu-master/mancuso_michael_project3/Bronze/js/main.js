//attach handles to search bars
$("#a-search-btn").click(function()
{
    var holder = $("#app-a-search-field").val();
    searchForCharacter(holder);

})

//search logic
//Only search by name for now, but leaving in this form so other fields can be searched.
function searchForCharacter(query)
{
    var matchedItems = new Array();
    
    if (localStorage.length === 0)
    {
        alert("No data stored. Dummy data will be inserted.");
        insertDummyData();
    }
    
    for (var i = 0, l = localStorage.length; i < l; i++)
    {
        var key = localStorage.key(i);
        var value = localStorage.getItem(key);
        var jsonObj = JSON.parse(value);
        
        if (searchForName(query, jsonObj.charName[1]))
        {
            matchedItems.push(jsonObj);
        }
        
    }
        createAndDisplayDialog(matchedItems);
}

function searchForName(name, recordName)
{
    if(name.toLowerCase() == recordName.toLowerCase())
    {
       return true; 
    }
    return false;
};

function createAndDisplayDialog(jsonArray)
{
    var numLine = $("#results-num");
    var itemList = $("#results-list");
    
        
    numLine.html("There were " + jsonArray.length + " results found, displayed below:")
    itemList.html("");
    
    for (var i = 0, l = jsonArray.length; i<l; i++)
    {
        var outerLi = document.createElement("li");
        itemList.append(outerLi);
        
        var innerList = document.createElement("ul");
        outerLi.appendChild(innerList);
        
        
        
        var current = jsonArray[i];
        for (var item in current)
        {
            var innerLi = document.createElement("li");
            innerList.appendChild(innerLi);
            innerLi.innerHTML= current[item][0] + " " + current[item][1];
        }
    }
    
    
    if (jsonArray.length == 0)
    {
        
    }
    
    $.mobile.changePage("#search-results");
}

