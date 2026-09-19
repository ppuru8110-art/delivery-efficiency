/**
 * 日報ログデータを CSV / JSON ファイルとしてダウンロードさせるユーティリティ
 */

export const exportLogsToCSV = (logs) => {
  if (!logs || logs.length === 0) {
    alert('エクスポート対象の日報データがありません。');
    return;
  }

  const headers = [
    '日付',
    '開始時刻',
    '終了時刻',
    '稼働時間(h)',
    '売上(円)',
    '配達件数(件)',
    '走行距離(km)',
    '天候',
    '主要エリア',
    '平均時給(円/h)',
    '件単価(円/件)',
    'km単価(円/km)',
    'メモ'
  ];

  const rows = logs.map(log => {
    const hours = Number(log.hours_worked) || 0;
    const earnings = Number(log.total_earnings) || 0;
    const count = Number(log.delivery_count) || 0;
    const dist = Number(log.distance_km) || 0;

    const hourly = hours > 0 ? Math.round(earnings / hours) : 0;
    const perCount = count > 0 ? Math.round(earnings / count) : 0;
    const perKm = dist > 0 ? Math.round(earnings / dist) : 0;

    return [
      `"${log.work_date || ''}"`,
      `"${log.start_time || ''}"`,
      `"${log.end_time || ''}"`,
      hours,
      earnings,
      count,
      dist,
      `"${log.weather || '晴れ'}"`,
      `"${(log.primary_area || '').replace(/"/g, '""')}"`,
      hourly,
      perCount,
      perKm,
      `"${(log.notes || '').replace(/"/g, '""')}"`
    ].join(',');
  });

  // BOMを追加してExcelでの文字化けを防ぐ
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `RocketAnalyzer_Logs_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportLogsToJSON = (logs) => {
  if (!logs || logs.length === 0) {
    alert('エクスポート対象の日報データがありません。');
    return;
  }

  const jsonContent = JSON.stringify(logs, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `RocketAnalyzer_Backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
