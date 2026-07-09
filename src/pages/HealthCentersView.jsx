import { useState } from 'react';
import { saveData, loadData, KEYS } from '../services/storageService';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet's default icon path issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons with distinct colors
// Azul: ubicación actual del usuario
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Rojo oscuro: establecimientos guardados por el usuario
const savedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Verde: hospitales/clínicas cercanas (Overpass)
const nearbyIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to dynamically center map
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

function HealthCentersView({ onNavigate, goBack }) {
  const [centers, setCenters] = useState(() => {
    const arr = loadData(KEYS.HEALTH_CENTERS, []);
    if (arr.length > 0) return arr;
    const old = loadData(KEYS.HEALTH_CENTER, null);
    if (old && old.nombre) {
      const migrated = [{ ...old, id: Date.now(), referencia: old.referencia || '', latitud: '', longitud: '' }];
      saveData(KEYS.HEALTH_CENTERS, migrated);
      return migrated;
    }
    return [];
  });

  const [userLocation, setUserLocation] = useState(null);
  const [nearbyHospitals, setNearbyHospitals] = useState([]);
  const [loadingMap, setLoadingMap] = useState(false);
  const [mapError, setMapError] = useState('');
  const [selectedCenterId, setSelectedCenterId] = useState(null);

  const handleDelete = (id) => {
    const updated = centers.filter(c => c.id !== id);
    setCenters(updated);
    saveData(KEYS.HEALTH_CENTERS, updated);
    if (selectedCenterId === id) setSelectedCenterId(null);
  };

  const handleEdit = () => {
    onNavigate('healthCenter');
  };

  /**
   * For saved centers without coordinates, generate a simulated
   * nearby position based on user location or default Lima center
   */
  const getEffectivePosition = (center, index) => {
    if (center.latitud && center.longitud) {
      return [parseFloat(center.latitud), parseFloat(center.longitud)];
    }
    // Generate simulated position near user or default
    const baseLat = userLocation ? userLocation[0] : -12.0464;
    const baseLon = userLocation ? userLocation[1] : -77.0428;
    const offset = 0.003 * (index + 1);
    return [baseLat + offset, baseLon - offset];
  };

  const getUserLocation = () => {
    setLoadingMap(true);
    setMapError('');
    if (!navigator.geolocation) {
      setMapError('Tu navegador no soporta geolocalización.');
      setLoadingMap(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        fetchNearbyHospitals(latitude, longitude);
      },
      (error) => {
        console.error("Error obtaining location", error);
        setMapError('No se pudo obtener tu ubicación. Asegúrate de dar permisos.');
        setLoadingMap(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const fetchNearbyHospitals = async (lat, lon) => {
    try {
      // Overpass API to find hospitals within 3km
      const query = `
        [out:json];
        (
          node["amenity"~"hospital|clinic"](around:3000,${lat},${lon});
          way["amenity"~"hospital|clinic"](around:3000,${lat},${lon});
        );
        out center;
      `;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data && data.elements && data.elements.length > 0) {
        const hospitals = data.elements.map(el => ({
          id: el.id,
          name: el.tags?.name || 'Centro de Salud (Sin nombre)',
          lat: el.lat || el.center?.lat,
          lon: el.lon || el.center?.lon,
        })).filter(h => h.lat && h.lon);
        
        setNearbyHospitals(hospitals);
      } else {
        simulateFallbackHospitals(lat, lon);
      }
    } catch (err) {
      console.error("Overpass API failed, using fallback", err);
      simulateFallbackHospitals(lat, lon);
    } finally {
      setLoadingMap(false);
    }
  };

  const simulateFallbackHospitals = (lat, lon) => {
    setNearbyHospitals([
      { id: 'sim1', name: 'Centro de Salud (Simulado 1)', lat: lat + 0.005, lon: lon + 0.005 },
      { id: 'sim2', name: 'Clínica (Simulada 2)', lat: lat - 0.004, lon: lon + 0.008 },
      { id: 'sim3', name: 'Hospital de Apoyo (Simulado 3)', lat: lat + 0.008, lon: lon - 0.006 },
    ]);
  };

  /** Save a nearby hospital to the user's health centers list */
  const handleSaveNearby = (hospital) => {
    const newCenter = {
      id: Date.now(),
      nombre: hospital.name,
      direccion: 'Descubierto automáticamente',
      distrito: '',
      ciudad: '',
      telefono: '',
      obstetra: '',
      referencia: '',
      latitud: hospital.lat.toString(),
      longitud: hospital.lon.toString(),
    };
    const updated = [...centers, newCenter];
    setCenters(updated);
    saveData(KEYS.HEALTH_CENTERS, updated);
  };

  // Center of map calculation
  let mapCenter = [-12.0464, -77.0428]; // Default Lima
  if (userLocation) {
    mapCenter = userLocation;
  } else if (centers.length > 0 && centers[0].latitud && centers[0].longitud) {
    mapCenter = [parseFloat(centers[0].latitud), parseFloat(centers[0].longitud)];
  }

  // Selected center for route drawing
  const selectedCenter = centers.find(c => c.id === selectedCenterId);
  const selectedPosition = selectedCenter ? getEffectivePosition(selectedCenter, centers.indexOf(selectedCenter)) : null;

  return (
    <div className="page" style={{ paddingBottom: 80 }}>
      <div className="page-header">
        <button className="back-btn" onClick={goBack} type="button">←</button>
        <h1>Establecimientos de Salud</h1>
      </div>

      {/* Disclaimer */}
      <div className="map-disclaimer">
        <p style={{ margin: 0 }}>
          ⚠️ Las rutas y distancias son referenciales. En una emergencia real, llama a emergencias o acude al establecimiento más cercano.
        </p>
      </div>

      {centers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏥</div>
          <div className="empty-title">Sin establecimientos</div>
          <div className="empty-text">No has registrado ningún centro de salud todavía.</div>
        </div>
      ) : (
        centers.map((center, index) => {
          const hasCoords = center.latitud && center.longitud;
          const isSelected = selectedCenterId === center.id;
          return (
            <div
              className={`card mb-16 ${isSelected ? 'card-selected' : ''}`}
              key={center.id || index}
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedCenterId(isSelected ? null : center.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') setSelectedCenterId(isSelected ? null : center.id); }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', color: 'var(--color-primary)', marginBottom: 8 }}>
                    {center.nombre}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text)', display: 'grid', gap: 4 }}>
                    <div>📍 {center.direccion} {center.distrito ? `- ${center.distrito}` : ''} {center.ciudad ? `(${center.ciudad})` : ''}</div>
                    {center.telefono && <div>📞 {center.telefono}</div>}
                    {center.obstetra && <div>👩‍⚕️ {center.obstetra}</div>}
                    {center.referencia && <div>📝 Ref: {center.referencia}</div>}
                    {!hasCoords && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-warning)', marginTop: 4 }}>
                        ⚠️ Sin coordenadas — se mostrará ubicación simulada cercana
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
                  <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); handleEdit(center.id); }} type="button">✏️</button>
                  <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); handleDelete(center.id); }} type="button" style={{ color: 'var(--color-danger)' }}>✕</button>
                </div>
              </div>
              {isSelected && (
                <div style={{ marginTop: 8, fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                  📍 Ruta mostrada en el mapa ↓
                </div>
              )}
            </div>
          );
        })
      )}

      <button className="btn btn-primary mb-20" onClick={() => onNavigate('healthCenter')} type="button">
        + Agregar establecimiento
      </button>

      {/* MAPA INTERACTIVO */}
      <h3 className="section-title">Mapa de Centros Cercanos</h3>
      <button 
        className="btn btn-secondary mb-12" 
        onClick={getUserLocation} 
        disabled={loadingMap}
        type="button"
      >
        {loadingMap ? 'Buscando...' : '📍 Buscar hospitales cerca de mí'}
      </button>
      
      {mapError && <div className="error-text mb-12">{mapError}</div>}

      <div style={{ height: '350px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--color-gray-200)', marginBottom: 20 }}>
        <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
          <ChangeView center={mapCenter} zoom={userLocation ? 14 : 13} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Marcador del Usuario (Azul) */}
          {userLocation && (
            <Marker position={userLocation} icon={userIcon}>
              <Popup>📍 Tu ubicación actual</Popup>
            </Marker>
          )}

          {/* Marcadores de centros guardados (Rojo oscuro) */}
          {centers.map((center, index) => {
            const pos = getEffectivePosition(center, index);
            const hasCoords = center.latitud && center.longitud;
            return (
              <Marker key={`saved-${center.id}`} position={pos} icon={savedIcon}>
                <Popup>
                  <strong>{center.nombre}</strong><br/>
                  {hasCoords ? '📌 Guardado' : '📌 Guardado (ubicación simulada)'}
                  {!hasCoords && (
                    <><br/><em style={{ fontSize: '0.75rem' }}>Edita para agregar coordenadas reales</em></>
                  )}
                </Popup>
              </Marker>
            );
          })}

          {/* Línea de ruta al centro seleccionado (Rojo vino) */}
          {userLocation && selectedPosition && (
            <Polyline 
              positions={[userLocation, selectedPosition]} 
              color="#8B1A2B"
              weight={4}
              dashArray="8, 12" 
            />
          )}

          {/* Marcadores de hospitales cercanos descubiertos por Overpass (Verde) */}
          {nearbyHospitals.map(h => (
            <Marker key={`nearby-${h.id}`} position={[h.lat, h.lon]} icon={nearbyIcon}>
              <Popup>
                <strong>{h.name}</strong><br/>
                Centro cercano<br/>
                <button
                  onClick={() => handleSaveNearby(h)}
                  style={{
                    marginTop: 6,
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    background: 'var(--color-primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  + Guardar este centro
                </button>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      {/* Leyenda con colores reales */}
      <div className="map-legend">
        <div className="map-legend-item">
          <span className="legend-dot" style={{ background: '#2A81CB' }} />
          <span>Tu ubicación actual</span>
        </div>
        <div className="map-legend-item">
          <span className="legend-dot" style={{ background: '#CB2B3E' }} />
          <span>Establecimientos guardados</span>
        </div>
        <div className="map-legend-item">
          <span className="legend-dot" style={{ background: '#2AAD27' }} />
          <span>Centros cercanos (Overpass)</span>
        </div>
        <div className="map-legend-item">
          <span className="legend-line" />
          <span>Ruta seleccionada</span>
        </div>
      </div>
    </div>
  );
}

export default HealthCentersView;
