function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[[]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    var results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var currentLocation = getParameterByName('currentLocation');

if (currentLocation) {
    document.querySelector('.location p:first-child').textContent += currentLocation;
}

document.getElementById('startButton').addEventListener('click', function() {
    var currentLocation = getParameterByName('currentLocation'); // Assuming this function is defined and works correctly
    var selectedDestination = document.getElementById('destination').value;

    if (currentLocation != null) {
        if (selectedDestination != 'destination'){
            if (currentLocation === selectedDestination) {
                alert('Error: Current location cannot be the same as the destination!');
                return;
            }
        } else {
            alert('Please select a valid destination!')
            return;
        }
    } else {
        alert('Please Scan Your Current Location QR!')
            return;
    }

    window.location.href = `navigation.html?currentLocation=${currentLocation}&destination=${selectedDestination}`;
});