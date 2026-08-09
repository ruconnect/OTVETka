import { kv } from '@vercel/kv';

export default async function handler(request, response) {
  // Разрешаем только POST-запросы
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Метод не разрешен' });
  }

  try {
    // В Vercel Serverless Functions request.body может приходить строкой, парсим её вручную
    let body = request.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    const { fullName, street, houseNumber } = body;

    // Валидация полей
    if (!fullName || !street || !houseNumber) {
      return response.status(400).json({ error: 'Все поля обязательны для заполнения' });
    }

    const userData = {
      fullName,
      street,
      houseNumber,
      createdAt: new Date().toISOString(),
    };

    // Генерируем уникальный ключ
    const userId = `user:${Date.now()}`;
    
    // Сохраняем в базу данных Vercel KV
    await kv.set(userId, userData);

    return response.status(200).json({ success: true, message: 'Данные успешно сохранены' });
  } catch (error) {
    console.error('Ошибка бэкенда:', error);
    return response.status(500).json({ error: 'Внутренняя ошибка сервера при обработке данных' });
  }
}
