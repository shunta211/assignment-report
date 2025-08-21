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

  useEffect(() => {
    fetch('/basemaps.json')
      .then(res => res.json())
      .then(data => {
        setBasemaps(data.basemaps);
        setSelectedId(data.defaultId);
      });
  }, []);

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
    } else {
      mapRef.current.setStyle(style);
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