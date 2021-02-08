 window.initMap =  function() {
    tracker_map = new google.maps.Map(document.getElementById('tracker-map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
    });
    evacuation_map = new google.maps.Map(document.getElementById('evacuation-map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
    });
    user_map = new google.maps.Map(document.getElementById('user-map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
    });
    responder_map = new google.maps.Map(document.getElementById('responder-map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
    });
}