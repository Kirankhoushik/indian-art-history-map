# Indian Art History Map

An interactive digital map highlighting key locations significant to Indian art history.

## Objective
Explore the geographic spread and influence of different art styles across India through location-based storytelling.

## Features
- Interactive map markers for art history locations
- Filter by era, movement/style, and region
- Detailed side panel with:
  - Description
  - Artists
  - Artworks
  - Historical context
  - Sources
- Color-coded markers by era

## Tech Stack
- HTML, CSS, JavaScript
- [Leaflet](https://leafletjs.com/) for interactive mapping
- OpenStreetMap tiles
- GeoJSON for structured content

## Run locally
Because this project fetches GeoJSON, run it via a local server:

```bash
# Option 1: Python
python -m http.server 8000

# Option 2: Node
npx serve .
```

Then open `http://localhost:8000`.

## Data
Location data is stored in `data/locations.geojson`.
You can expand the map by adding more GeoJSON features with this schema:

```json
{
  "type": "Feature",
  "geometry": { "type": "Point", "coordinates": [longitude, latitude] },
  "properties": {
    "name": "Location Name",
    "region": "Region",
    "era": "Ancient | Medieval | Modern | Contemporary",
    "movement": "Style or movement",
    "artists": ["Artist 1", "Artist 2"],
    "artworks": ["Artwork 1"],
    "description": "Short description",
    "context": "Historical context",
    "image": "Image URL",
    "sources": ["Source URL"]
  }
}
```

## Next improvements
- Add timeline slider for period-based animation
- Add clustered markers for dense regions
- Add multilingual support
- Add curated image credits metadata
