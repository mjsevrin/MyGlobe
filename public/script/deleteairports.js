
function deleteAirports(id){
    $.ajax({
        url: '/airports/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};