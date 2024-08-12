import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getUser, ready } from '../lib/telegram' // Импортируем функции из telegram.ts

export default function Home() {
	const [user, setUser] = useState<any>(null)
	const [message, setMessage] = useState<string>('')
	const router = useRouter()

	useEffect(() => {
		ready() // Инициализация Telegram Web App
		const authToken = localStorage.getItem('authToken')

		if (!authToken) {
			router.push('/check') // Перенаправление на страницу проверки, если токен не найден
		} else {
			const userData = getUser()
			if (userData) {
				setUser(userData)
			}
		}
	}, [router])

	return (
		<div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
			{user ? (
				<>
					<h1>Welcome, {user.first_name}!</h1>
					{user.photo_url && (
						<img
							src={user.photo_url}
							alt='User Profile'
							style={{ borderRadius: '50%' }}
						/>
					)}
					<p>{message}</p>
				</>
			) : (
				<p>Loading...</p>
			)}
		</div>
	)
}
