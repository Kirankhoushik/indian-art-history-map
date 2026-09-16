const map = L.map('map').setView([22.9734, 78.6569], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const eraFilter = document.getElementById('eraFilter');
const styleFilter = document.getElementById('styleFilter');
const regionFilter = document.getElementById('regionFilter');
const resetFilters = document.getElementById('resetFilters');
const detailsContent = document.getElementById('detailsContent');

let allFeatures = [];
let markersLayer = L.layerGroup().addTo(map);

function normalizeEra(era) {
  const value = era.toLowerCase();
  if (value.includes('ancient')) return 'Ancient';
  if (value.includes('medieval')) return 'Medieval';
  if (value.includes('modern')) return 'Modern';
  if (value.includes('contemporary')) return 'Contemporary';
  return 'Modern';
}

function markerColor(era) {
  const e = normalizeEra(era);
  if (e === 'Ancient') return '#8e44ad';
  if (e === 'Medieval') return '#2980b9';
  if (e === 'Modern') return '#d35400';
  return '#16a085';
}

function markerIcon(color) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,0.2);"></span>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
}

function uniqueValues(data, key) {
  return [...new Set(data.map(f => f.properties[key]).filter(Boolean))].sort();
}

function populateFilters() {
  const eras = uniqueValues(allFeatures, 'era');
  const styles = uniqueValues(allFeatures, 'movement');
  const regions = uniqueValues(allFeatures, 'region');

  for (const era of eras) eraFilter.add(new Option(era, era));
  for (const style of styles) styleFilter.add(new Option(style, style));
  for (const region of regions) regionFilter.add(new Option(region, region));
}

function matchesFilters(feature) {
  const { era, movement, region } = feature.properties;
  return (eraFilter.value === 'all' || eraFilter.value === era)
    && (styleFilter.value === 'all' || styleFilter.value === movement)
    && (regionFilter.value === 'all' || regionFilter.value === region);
}

function renderDetails(props) {
  detailsContent.innerHTML = `
    <h3>${props.name}</h3>
    <div class="meta"><strong>Region:</strong> ${props.region} · <strong>Era:</strong> ${props.era}</div>
    <div class="meta"><strong>Movement:</strong> ${props.movement}</div>
    <img src="${props.image}" alt="Representative art from ${props.name}" loading="lazy" onerror="this.style.display='none'" />
    <p>${props.description}</p>
    <p><strong>Artists:</strong> ${props.artists.join(', ')}</p>
    <p><strong>Artworks:</strong> ${props.artworks.join(', ')}</p>
    <p><strong>Historical Context:</strong> ${props.context}</p>
    <p><strong>Sources:</strong><br>${props.sources.map(s => `<a href="${s}" target="_blank" rel="noopener noreferrer">${s}</a>`).join('<br>')}</p>
  `;
}

function refreshMarkers() {
  markersLayer.clearLayers();
  const filtered = allFeatures.filter(matchesFilters);

  filtered.forEach(feature => {
    const [lng, lat] = feature.geometry.coordinates;
    const props = feature.properties;

    const marker = L.marker([lat, lng], {
      icon: markerIcon(markerColor(props.era)),
      keyboard: true,
      title: props.name
    });

    marker.bindPopup(`<strong>${props.name}</strong><br>${props.movement}`);
    marker.on('click', () => renderDetails(props));
    marker.addTo(markersLayer);
  });

  if (filtered.length > 0) {
    const group = L.featureGroup(markersLayer.getLayers());
    map.fitBounds(group.getBounds().pad(0.2));
  }
}

function resetAllFilters() {
  eraFilter.value = 'all';
  styleFilter.value = 'all';
  regionFilter.value = 'all';
  refreshMarkers();
}

[eraFilter, styleFilter, regionFilter].forEach(el => {
  el.addEventListener('change', refreshMarkers);
});
resetFilters.addEventListener('click', resetAllFilters);

fetch('data/locations.geojson')
  .then(res => res.json())
  .then(geojson => {
    allFeatures = geojson.features;
    populateFilters();
    refreshMarkers();
  })
  .catch(err => {
    detailsContent.innerHTML = `<p>Failed to load map data. ${err.message}</p>`;
  });
