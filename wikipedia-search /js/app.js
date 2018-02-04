$("#searchFor").autocomplete({
    source: function(request, response) {
        $.ajax({
            url: "http://en.wikipedia.org/w/api.php",
            dataType: "jsonp",
            data: {
                'action': "opensearch",
                'format': "json",
                'search': request.term
            },
            
            success: function(data) {
                response(data[1]);
            }
        })
    },
    select: function(event, ui) {
        var fistOfFirst = ui.item.label;
        $("#mainDisp").empty();
        var tgtSite = "https://en.wikipedia.org/w/api.php?action=opensearch&pithumbsize=100&prop=pageimages&list=search&srwhat=text&srprop=snippet&utf8=1&continue=&format=json&search=" + fistOfFirst;
        sendRequest(tgtSite);
    }
})
$("#searchBtn").on('click', function(event) {
  $("#mainDisp").empty();
  wikiSearch()
});
$(document).on('click','#mainDisp .outerShell',function(){
    $("#mainDisp1").html($(this).html());
    $("#myModal a").attr('href',$(this).data('link'));
    $("#myModal .sub_desc").addClass('hidden');
    $("#myModal .full_desc").removeClass('hidden');
});           
function wikiSearch(){
    var searchInput = $('#searchFor').val();  
    var tgtSite = "https://en.wikipedia.org/w/api.php?action=opensearch&pithumbsize=100&prop=pageimages&list=search&srwhat=text&srprop=snippet&utf8=1&continue=&format=json&search=" + searchInput;
    sendRequest(tgtSite);
}
function sendRequest(tgtSite){
    $.ajax({
        url: tgtSite,
        dataType: 'jsonp',
        data: {
            q:{}, 
            format: 'json'
        },
        success: organizeData
    })
}
function organizeData(data){

    ListSearch = [];
    for (var i = 0; i < Object.keys(data[1]).length; i++) {
        var item = {
            title : data[1][i],
            content : data[2][i],
            link : data[3][i],
            src : null,
        };
        ajaxImg(item);
    }
    console.log(ListSearch);
    if (typeof(data) != "object") {
        updateView("Please retry term");
    }
}
function ajaxImg(item) {
    $.ajax({
        url: 'https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages%7Cpageterms&generator=prefixsearch&redirects=1&formatversion=2&piprop=thumbnail&pithumbsize=250&pilimit=20&wbptterms=description&gpssearch='+item.title+'&gpslimit=20',
        method: "GET",
        dataType: "jsonp",
        asyn: true,
        success: function(newData) {
            if (newData.query.pages[0].thumbnail != undefined) {
                if (newData.query.pages[0].thumbnail.source != undefined) {
                    item.src = newData.query.pages[0].thumbnail.source;
                } else {
                    item.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Article_icon_cropped.svg/512px-Article_icon_cropped.svg.png";
                }
            } else {
                item.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Article_icon_cropped.svg/512px-Article_icon_cropped.svg.png";
            }
            updateView(item);
        },
        error: function() {
          console.log("second call unsuccessful");
        }
    })
}
function updateView(item){
    images = '<img class=retTitle width=100% src='+item.src+'>';
    title = '<div width=100% class="retTitle"><a class="retTitle" data-toggle="modal" data-target="#myModal">'+item.title+'</a></div>';
    content = '<p  width=100% >'+item.content+'</p>';
    var subContent = content.substring(0,150)+'...'
    $("#mainDisp").append('<div data-link="'+item.link+'" class="row outerShell" > <div class="col col-md-2">'+images+'</div><div class="col col-md-10">'+title+'<div class="sub_desc">'+subContent+'</div><div class="hidden full_desc">'+content+'</div></div></div');
    //$("#mainDisp1").append('<div class="row outerShell" data-toggle="modal" data-target="#myModal"> <div class="col col-md-4">'+images+'</div><div class="col col-md-8">'+title+content+'</div></div');
}
 