// Fórmula de Haversine para calcular distância entre dois pontos geográficos
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Raio da Terra em km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distância em km
  return distance * 1000; // Converter para metros
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export const GYM_RADIUS = 50; // 50 metros de tolerância

export function isWithinGym(
  userLat: number,
  userLon: number,
  gymLat: number,
  gymLon: number,
  radius: number = GYM_RADIUS,
): boolean {
  const distance = calculateDistance(userLat, userLon, gymLat, gymLon);
  return distance <= radius;
}
