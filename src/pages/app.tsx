import { useEffect, useState } from 'react'
import { getUser, ready } from '../lib/telegram'

export default function App() {
	const [user, setUser] = useState<any>(null)

	useEffect(() => {
		ready()
		const userData = getUser()
		if (userData) {
			setUser(userData)
		}
	}, [])

	return (
		<div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
			<h1>Welcome to the Telegram Web App</h1>
			{user ? (
				<>
					<p>Hello, {user.first_name}!</p>
					{user.photo_url && (
						<img
							src={user.photo_url}
							alt='User Profile'
							style={{ borderRadius: '50%' }}
						/>
					)}
				</>
			) : (
				<p>Loading user information...</p>
			)}
		</div>
	)
}
