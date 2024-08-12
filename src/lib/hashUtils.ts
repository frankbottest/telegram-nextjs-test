import crypto from 'crypto'

// Функция для генерации уникального токена
export function generateToken(): string {
	return crypto.randomBytes(16).toString('hex')
}

// Функция для генерации хэша с использованием SECRET_KEY
export function generateHash(data: string): string {
	const secret = process.env.SECRET_KEY || 'default_secret_key'
	return crypto.createHmac('sha256', secret).update(data).digest('hex')
}
