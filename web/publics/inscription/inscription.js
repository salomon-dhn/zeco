var chemin = window.location.href;
var url = new URL(chemin);
var search_params = new URLSearchParams(url.search);

if (search_params.has('i')) {
    $(document).ready(function() {
        $('#myModal').modal('toggle')
    });
}