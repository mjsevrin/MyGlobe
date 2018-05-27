function selectCountryLanguage(cid, lid){
    $('#countrySelector')
        .dropdown('set selected', cid);
    $('#languageSelector')
        .dropdown('set selected', lid);
};