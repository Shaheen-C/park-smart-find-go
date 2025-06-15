
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  tags?: {
    name?: string;
    amenity?: string;
    fuel?: string;
    brand?: string;
    opening_hours?: string;
    phone?: string;
  };
}

interface OverpassResponse {
  elements: OverpassElement[];
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lat, lng, type, radius = 5000 } = await req.json();
    
    if (!lat || !lng || !type) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: lat, lng, type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Searching for ${type} near ${lat}, ${lng} within ${radius}m`);

    // Build Overpass query based on facility type
    let overpassQuery = '';
    
    switch (type) {
      case 'gas_station':
        overpassQuery = `
          [out:json][timeout:25];
          (
            node["amenity"="fuel"](around:${radius},${lat},${lng});
            way["amenity"="fuel"](around:${radius},${lat},${lng});
            relation["amenity"="fuel"](around:${radius},${lat},${lng});
          );
          out center meta;
        `;
        break;
      case 'toilet':
        overpassQuery = `
          [out:json][timeout:25];
          (
            node["amenity"="toilets"](around:${radius},${lat},${lng});
            way["amenity"="toilets"](around:${radius},${lat},${lng});
            relation["amenity"="toilets"](around:${radius},${lat},${lng});
          );
          out center meta;
        `;
        break;
      case 'rest_area':
        overpassQuery = `
          [out:json][timeout:25];
          (
            node["highway"="rest_area"](around:${radius},${lat},${lng});
            way["highway"="rest_area"](around:${radius},${lat},${lng});
            relation["highway"="rest_area"](around:${radius},${lat},${lng});
            node["amenity"="restaurant"](around:${radius},${lat},${lng});
            way["amenity"="restaurant"](around:${radius},${lat},${lng});
          );
          out center meta;
        `;
        break;
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid facility type' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    // Call Overpass API
    const overpassUrl = 'https://overpass-api.de/api/interpreter';
    const response = await fetch(overpassUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: overpassQuery,
    });

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`);
    }

    const data: OverpassResponse = await response.json();
    console.log(`Found ${data.elements.length} raw elements`);

    // Process and format the results
    const facilities = data.elements
      .filter(element => element.lat && element.lon)
      .map(element => {
        const elementLat = element.lat || (element as any).center?.lat;
        const elementLon = element.lon || (element as any).center?.lon;
        
        if (!elementLat || !elementLon) return null;

        // Calculate distance
        const distance = calculateDistance(lat, lng, elementLat, elementLon);
        
        return {
          place_id: `osm_${element.type}_${element.id}`,
          name: element.tags?.name || element.tags?.brand || getDefaultName(type),
          vicinity: `${distance.toFixed(1)} km away`,
          types: [type],
          geometry: {
            location: {
              lat: elementLat,
              lng: elementLon,
            },
          },
          distance: distance,
          opening_hours: element.tags?.opening_hours ? {
            open_now: isCurrentlyOpen(element.tags.opening_hours)
          } : undefined,
          phone: element.tags?.phone,
        };
      })
      .filter(facility => facility !== null)
      .sort((a, b) => a!.distance - b!.distance)
      .slice(0, 10); // Limit to 10 closest facilities

    console.log(`Returning ${facilities.length} processed facilities`);

    return new Response(
      JSON.stringify({ facilities }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in nearby-facilities function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function getDefaultName(type: string): string {
  switch (type) {
    case 'gas_station': return 'Petrol Station';
    case 'toilet': return 'Public Toilet';
    case 'rest_area': return 'Rest Area';
    default: return 'Facility';
  }
}

function isCurrentlyOpen(openingHours: string): boolean {
  // Simple check - in a real app, you'd parse the opening hours properly
  return !openingHours.toLowerCase().includes('closed');
}
