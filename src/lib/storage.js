import { supabase, isSupabaseConfigured } from './supabaseClient';

const LOCAL_STORAGE_KEY = 'rocket_analyzer_delivery_logs';

/** 初期用の2週間分デモデータ生成 */
export const SAMPLE_DEMO_LOGS = [
  {
    id: 'demo-1',
    work_date: new Date(Date.now() - 1 * 86400000).toISOString().slice(0, 10),
    start_time: '11:00',
    end_time: '15:00',
    hours_worked: 4.0,
    total_earnings: 9800,
    delivery_count: 14,
    distance_km: 32.5,
    weather: '晴れ',
    primary_area: '渋谷・恵比寿エリア',
    latitude: 35.6580,
    longitude: 139.7016,
    notes: 'ランチピーク好調。ロケットブースト+200円発生。'
  },
  {
    id: 'demo-2',
    work_date: new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10),
    start_time: '17:30',
    end_time: '21:30',
    hours_worked: 4.0,
    total_earnings: 11200,
    delivery_count: 16,
    distance_km: 38.0,
    weather: '雨',
    primary_area: '新宿・代々木エリア',
    latitude: 35.6938,
    longitude: 139.7034,
    notes: '雨インセンティブ大。ショート案件多数で高効率！'
  },
  {
    id: 'demo-3',
    work_date: new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10),
    start_time: '11:30',
    end_time: '14:30',
    hours_worked: 3.0,
    total_earnings: 6300,
    delivery_count: 8,
    distance_km: 22.0,
    weather: '曇り',
    primary_area: '池袋・目白エリア',
    latitude: 35.7295,
    longitude: 139.7109,
    notes: 'ピック待ちが長めの店舗があり少し時給低下。'
  },
  {
    id: 'demo-4',
    work_date: new Date(Date.now() - 5 * 86400000).toISOString().slice(0, 10),
    start_time: '18:00',
    end_time: '22:00',
    hours_worked: 4.0,
    total_earnings: 10400,
    delivery_count: 15,
    distance_km: 34.0,
    weather: '晴れ',
    primary_area: '渋谷・恵比寿エリア',
    latitude: 35.6580,
    longitude: 139.7016,
    notes: '夜のディナー注文が好調。'
  },
  {
    id: 'demo-5',
    work_date: new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10),
    start_time: '11:00',
    end_time: '16:00',
    hours_worked: 5.0,
    total_earnings: 13500,
    delivery_count: 19,
    distance_km: 45.0,
    weather: '大雨',
    primary_area: '品川・五反田エリア',
    latitude: 35.6284,
    longitude: 139.7265,
    notes: '大雨ブースト全開！鳴り止まず過去最高時給レベル。'
  }
];

/** 日報ログの一覧取得 */
export const fetchDeliveryLogs = async () => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('delivery_logs')
        .select('*')
        .order('work_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to LocalStorage:', err);
    }
  }

  // LocalStorage フォールバック
  const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!localData) {
    // データ未登録時はデフォルトでデモデータを初期ロード
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(SAMPLE_DEMO_LOGS));
    return SAMPLE_DEMO_LOGS;
  }

  try {
    return JSON.parse(localData);
  } catch (e) {
    return [];
  }
};

/** 日報の新規保存 */
export const saveDeliveryLog = async (logData) => {
  const newLog = {
    ...logData,
    id: logData.id || `log-${Date.now()}`,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('delivery_logs')
        .insert([newLog])
        .select();

      if (error) throw error;
      return data?.[0] || newLog;
    } catch (err) {
      console.warn('Supabase save failed, saving to LocalStorage:', err);
    }
  }

  // LocalStorage フォールバック
  const current = await fetchDeliveryLogs();
  const updated = [newLog, ...current];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  return newLog;
};

/** 日報の更新 */
export const updateDeliveryLog = async (id, updatedFields) => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('delivery_logs')
        .update(updatedFields)
        .eq('id', id)
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (err) {
      console.warn('Supabase update failed, updating LocalStorage:', err);
    }
  }

  // LocalStorage
  const current = await fetchDeliveryLogs();
  const updated = current.map(item => item.id === id ? { ...item, ...updatedFields } : item);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  return true;
};

/** 日報の削除 */
export const deleteDeliveryLog = async (id) => {
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase
        .from('delivery_logs')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.warn('Supabase delete failed, deleting from LocalStorage:', err);
    }
  }

  // LocalStorage
  const current = await fetchDeliveryLogs();
  const updated = current.filter(item => item.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  return true;
};

/** デモデータの一括投入 / リセット */
export const loadDemoLogs = () => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(SAMPLE_DEMO_LOGS));
  return SAMPLE_DEMO_LOGS;
};

/** 全データクリア */
export const clearAllLogs = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
};
