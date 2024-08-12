import axios from 'axios'
import { useState } from 'react'

export default function Home() {
	const [hash, setHash] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [message, setMessage] = useState<string | null>(null)

	const handleSubmit = async () => {
		try {
			const response = await axios.post('/api/check-transaction', {
				userId: 'someUserId', // Используйте реальный userId пользователя
				transactionHash: hash,
			})
			setMessage(response.data.message)
		} catch (err) {
			setError('Ошибка при проверке транзакции.')
		}
	}

	return (
		<div>
			<h1>Введите хэш транзакции</h1>
			<input
				type='text'
				value={hash}
				onChange={e => setHash(e.target.value)}
				placeholder='Введите хэш транзакции'
			/>
			<button onClick={handleSubmit}>Проверить</button>
			{error && <p style={{ color: 'red' }}>{error}</p>}
			{message && <p>{message}</p>}
		</div>
	)
}
