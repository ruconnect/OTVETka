    // 2. Проверяем все возможные варианты системных имен переменных Vercel KV
    const kvUrl = process.env.KV_REST_API_URL || process.env.KV_URL;
    const kvToken = process.env.KV_REST_API_TOKEN || process.env.KV_REST_API_TOKEN;

    if (!kvUrl || !kvToken) {
      return response.status(500).json({ 
        error: `Ключи отсутствуют. Доступные переменные: ${Object.keys(process.env).filter(k => k.includes('KV')).join(', ') || 'нет вообще'}` 
      });
    }
