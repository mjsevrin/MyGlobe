function updateCountryLanguage(cid, lid){
    $.ajax({
        url: '/country_language/' + cid + '/' + lid,
        type: 'PUT',
        data: $('.form').serialize(),
        success: function(result){
            window.location.replace("../");
        }
    })
};