/**
 * Open-Meteo API (完全無料・APIキー不要) から天候を取得
 * WMO Weather interpretation codes を 日本語選択肢 (晴れ / 曇り / 雨 / 大雨) にマッピング
 */

const mapWmoCodeToWeather = (code) => {
  if (code === 0 || code === 1) return '晴れ';
  if (code === 2 || code === 3) return '曇り';
  if (code >= 51 && code <= 67) return '雨';
  if (code >= 80 && code <= 99) return '大雨';
  return '晴れ';
};

export const getCurrentLocationWeather = async () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      // 位置情報不可の場合はデフォルト東京の天気を取得
      fetchWeatherForCoords(35.6895, 139.6917).then(resolve);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const weather = await fetchWeatherForCoords(latitude, longitude);
        resolve({ weather, latitude, longitude });
      },
      async () => {
        // 位置情報の取得許可が得られなかった場合 (東京デフォルト)
        const weather = await fetchWeatherForCoords(35.6895, 139.6917);
        resolve({ weather, latitude: 35.6895, longitude: 139.6917 });
      },
      { timeout: 8000 }
    );
  });
};

export const fetchWeatherForCoords = async (lat, lng) => {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`
    );
    if (!res.ok) throw new Error('Weather API Error');
    const data = await res.json();
    const code = data.current_weather?.weathercode ?? 0;
    return mapWmoCodeToWeather(code);
  } catch (error) {
    console.warn('天気情報の自動取得に失敗したため、デフォルト値を返します:', error);
    return '晴れ';
  }
};
