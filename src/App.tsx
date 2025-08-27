import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

type Basemap = {
  id: string;
  name: string;
  type: 'raster' | 'style';
  url?: string;
  styleUrl?: string;
  attribution?: string;
};

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [basemaps, setBasemaps] = useState<Basemap[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');

  const geojsonUrl = 'https://raw.githubusercontent.com/smartnews-smri/japan-topography/main/data/municipality/geojson/s0001/N03-21_210101.json';

  useEffect(() => {
    fetch('/basemaps.json')
      .then(res => res.json())
      .then(data => {
        setBasemaps(data.basemaps);
        setSelectedId(data.defaultId);
      });
  }, []);
    // 地図にGeoJSONを追加
    function addMunicipalityLayer(map: maplibregl.Map) {
      // 既存のレイヤーがあれば削除
      // if (map.getLayer('municipality-fill')) {
      //   map.removeLayer('municipality-fill');
      // }
      if (map.getLayer('municipality-outline')) {
        map.removeLayer('municipality-outline');
      }
      if (map.getSource('municipality')) {
        map.removeSource('municipality');
      }

      map.addSource('municipality', {
        type: 'geojson',
        data: geojsonUrl,
      });
      map.addLayer({
        id: 'municipality-outline',
        type: 'line',
        source: 'municipality',
        paint: {
          'line-color': '#003399',
          'line-width': 1,
        },
      });
    }

  // 地図描画・スタイル切替
  useEffect(() => {
    const bm = basemaps.find(b => b.id === selectedId);
    if (!bm || !containerRef.current) return;

    const style =
      bm.type === 'style'
        ? bm.styleUrl
        : {
            version: 8,
            sources: {
              rastertiles: {
                type: 'raster',
                tiles: [bm.url!],
                tileSize: 256,
                attribution: bm.attribution,
              },
            },
            layers: [
              {
                id: 'raster-layer',
                type: 'raster',
                source: 'rastertiles',
              },
            ],
          };

    if (!mapRef.current) {
      mapRef.current = new maplibregl.Map({
        container: containerRef.current,
        style,
        center: [140.8694, 38.2682],
        zoom: 12,
      });
      mapRef.current.addControl(new maplibregl.NavigationControl(), 'top-left');
      // GeoJSONの追加
      mapRef.current.on('load', () => {
       addMunicipalityLayer(mapRef.current!);
      });
    } else {
      const map = mapRef.current;
      //まずレイヤー/ソースを削除（旧スタイルからの残り）
      if (map.getLayer('municipality-fill')) map.removeLayer('municipality-fill');
      if (map.getLayer('municipality-outline')) map.removeLayer('municipality-outline');
      if (map.getSource('municipality')) map.removeSource('municipality');
      //GeoJSONを再追加
      // mapRef.current.on('style.load', () => {
      //  addMunicipalityLayer(mapRef.current!);
      // });
      map.setStyle(style);
      map.once('styledata', () => {
      addMunicipalityLayer(map);
      });
    }
  }, [basemaps, selectedId]);

  return (
    <>
      <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}>
        <select value={selectedId} onChange={e => setSelectedId(e.target.value)}>
          {basemaps.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>
      <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />
    </>
  );
}