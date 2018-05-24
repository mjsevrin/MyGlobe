function updateAirport(id){
    $.ajax({
        url: '/airports/' + id,
        type: 'PUT',
        data: $('#updateAirport').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};