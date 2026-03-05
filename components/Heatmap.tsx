'use client';

import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';
import { useComputedColorScheme } from '@mantine/core';

import 'leaflet/dist/leaflet.css';

import { useEffect, useState } from 'react';

const MOCK_GEOJSON_URL =
  'https://raw.githubusercontent.com/fahim-muntasir-niloy/Bangladesh-geojson_project/main/Geo%20Json%20Maps/BD_Districts.json';

export interface HeatmapMapProps {
  mapKey: string;
  dataMap: Record<string, any>;
  getValue: (data: any) => number;
  getColor: (value: number, isDark: boolean) => string;
  getTooltipContent: (districtName: string, data: any) => string;
}

export default function HeatmapMap({
  mapKey,
  dataMap,
  getValue,
  getColor,
  getTooltipContent,
}: HeatmapMapProps) {
  const [geoData, setGeoData] = useState<any>(null);
  const computedColorScheme = useComputedColorScheme('light');
  const isDark = computedColorScheme === 'dark';

  useEffect(() => {
    fetch(MOCK_GEOJSON_URL)
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error('Missing GeoJSON file. Put it in /public!', err));
  }, []);

  const styleFeature = (feature: any) => {
    const districtName = feature.properties.ADM2_EN;
    const data = dataMap[districtName];

    let fillColor = isDark ? 'var(--mantine-color-grape-9)' : 'var(--mantine-color-grape-3)';

    if (data) {
      const value = getValue(data);
      fillColor = getColor(value, isDark);
    }

    return {
      fillColor,
      weight: 1,
      opacity: 1,
      color: isDark ? 'var(--mantine-color-dark-8)' : 'var(--mantine-color-white)',
      fillOpacity: 0.7,
    };
  };

  const bangladeshBounds = [
    [18.0, 86.0],
    [28.0, 94.5],
  ];
  const onEachFeature = (feature: any, layer: any) => {
    const districtName = feature.properties.ADM2_EN;
    const data = dataMap[districtName];
    const tooltipHtml = data
      ? getTooltipContent(districtName, data)
      : `
        <div style="font-family: sans-serif; color: var(--mantine-color-text);">
          <strong style="font-size: 1.1em;">${districtName}</strong><br/>
          <span style="color: var(--mantine-color-dimmed);">No verified data available</span>
        </div>
      `;

    layer.unbindTooltip();

    layer.bindPopup(tooltipHtml, {
      closeButton: true,
      autoPan: true,
    });

    layer.on({
      mouseover: (e: any) => {
        const layer = e.target;
        layer.setStyle({ fillOpacity: 0.9, weight: 2 });
      },
      mouseout: (e: any) => {
        const layer = e.target;
        layer.setStyle({ fillOpacity: 0.7, weight: 1 });
      },
    });
  };
  if (!geoData) {
    return (
      <div
        style={{
          height: '600px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--mantine-color-dimmed)',
        }}
      >
        Loading Map Data...
      </div>
    );
  }

  return (
    <MapContainer
      center={[23.685, 90.3563]}
      zoom={7}
      minZoom={7}
      maxBounds={bangladeshBounds as any}
      maxBoundsViscosity={1.0}
      style={{ height: '600px', width: '100%', borderRadius: '8px', zIndex: 1 }}
      scrollWheelZoom={false}
    >
      <TileLayer
        key={computedColorScheme}
        url={
          isDark
            ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
        }
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJSON
        key={`${mapKey}-${computedColorScheme}`}
        data={geoData}
        style={styleFeature}
        onEachFeature={onEachFeature}
      />
    </MapContainer>
  );
}
