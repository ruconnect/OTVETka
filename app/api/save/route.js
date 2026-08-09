import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { fullName, street, houseNumber } = await request.json();

    // Проверка полей: Проверка все ли поля содержат информацию
    if (!fullName || !street || !houseNumber) {
      return NextResponse.json({ error: 'Все поля обязательны' }, { status: 400 });
    }

    const userData = {
      fullName,
      street,
      houseNumber,
      createdAt: new Date().toISOString(),
    };

    // Генерируем уникальный ключ для каждого пользователя (например, по таймстампу)
    const userId = `user:${Date.now()}`;
    
    // Сохраняем данные в Vercel KV (аналог JSON-хранилища)
    await kv.set(userId, userData);

    return NextResponse.json({ success: true, message: 'Данные успешно сохранены' });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
