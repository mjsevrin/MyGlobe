
function deleteEntry(url){
    $.ajax({
        url: url,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};