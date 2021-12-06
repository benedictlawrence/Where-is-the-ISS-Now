let issPositions = [];

function getIssPosition() {
  const url = "http://api.open-notify.org/iss-now.json";

  function waitForResponse(response) {
    return response.json();
  }

  function handleData(data) {
    let long = data.iss_position.longitude;
    let lat = data.iss_position.latitude;
    let longNode = document.querySelector("#longtitude");
    let latNode = document.querySelector("#latitude");
    longNode.innerHTML = `Current ISS Longtitude: ${long}`;
    latNode.innerHTML = `Current ISS Latitude: ${lat}`;
    map.setView([lat, long]);
    marker.setLatLng([lat, long]);
    issPositions.push([lat, long]);
    issPath.setLatLngs(issPositions);
  }

  fetch(url).then(waitForResponse).then(handleData);
  setTimeout(getIssPosition, 500);
}

getIssPosition();

var map = L.map("map").setView([35, 80], 3);

const mapBoxToken =
  "pk.eyJ1IjoiYmVuZWRpY3RsYXdyZW5jZSIsImEiOiJja3d1OGdnNDMxNXg3Mm5xcWpndDRhc280In0.p6FjGg3ke5mBni9rJWNtQQ";

L.tileLayer(
  `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${mapBoxToken}`,
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken: "your.mapbox.access.token",
  }
).addTo(map);

let issIcon = L.icon({
  iconUrl: "https://static.thenounproject.com/png/2405810-200.png",
  iconSize: [30, 30], // size of the icon
});

let marker = L.marker([51.5, -0.09], { icon: issIcon }).addTo(map);

let issPath = L.polyline(issPositions, { color: "#2E0094" }).addTo(map);

let content = `
<b>Currently Onboard</b>
</br>
`;

function getPeopleInSpace() {
  function waitForResponse(response) {
    return response.json();
  }

  function handleData(data) {
    people = data.people;
    function isOnIss(person) {
      return person.craft === "ISS";
    }
    let onISS = people.filter(isOnIss);
    function createLi(person) {
      li = `<li>${person.name}</li>`;
      content += li;
    }
    onISS.forEach(createLi);
    marker.bindPopup(content).openPopup();
  }

  fetch("http://api.open-notify.org/astros.json")
    .then(waitForResponse)
    .then(handleData);
}

getPeopleInSpace();
