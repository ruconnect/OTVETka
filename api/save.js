export default async function handler(request, response) {
  // 1. Разрешаем только POST запросы
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Метод не разрешен' });
  }

  try {
    // 2. Достаем переменные окружения напрямую (они точно есть в Vercel)
    const kvUrl = process.env.KV_REST_API_URL;
    const kvToken = process.env.KV_REST_API_TOKEN;

    if (!kvUrl || !kvToken) {
      return response.status(500).json({ error: 'База данных не подключена в панели Vercel' });
    }

    // 3. Безопасно парсим тело запроса
    let body = request.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    const { fullName, street, houseNumber } = body;

    if (!fullName || !street || !houseNumber) {
      return response.status(400).json({ error: 'Все поля обязательны для заполнения' });
    }

    // 4. Формируем JSON с данными
    const userData = {
      fullName,
      street,
      houseNumber,
      createdAt: new Date().toISOString(),
    };

    const userId = `user:${Date.now()}`;

    // 5. Отправляем напрямую в базу через REST API (без библиотек)
    const kvResponse = await fetch(`${kvUrl}/set/${userId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${kvToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!kvResponse.ok) {
      const errorText = await kvResponse.text();
      console.error('Ошибка базы данных:', errorText);
      return response.status(500).json({ error: 'База данных отклонила запрос' });
    }

    return response.status(200).json({ success: true, message: 'Данные успешно сохранены' });

  } catch (error) {
    console.error('Критическая ошибка бэкенда:', error);
    return response.status(500).json({ error: `Сбой сервера: ${error.message}` });
  }
}
