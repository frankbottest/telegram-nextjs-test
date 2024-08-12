import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getUser, ready } from '../lib/telegram'

export default function Check() {
	const [transactionHash, setTransactionHash] = useState<string>('')
	const [message, setMessage] = useState<string>('')
	const router = useRouter()

	useEffect(() => {
		ready()
	}, [])

	const handleCheckTransaction = async () => {
		if (!transactionHash) {
			setMessage('Please enter a transaction hash.')
			return
		}

		try {
			const response = await fetch('/api/check-transaction', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userId: getUser()?.id,
					transactionHash,
				}),
			})

			const data = await response.json()
			if (data.status === 'success') {
				localStorage.setItem('authToken', data.token)
				router.push('/') // Перенаправление на главную страницу
			} else {
				setMessage(data.message)
			}
		} catch (error) {
			setMessage('Error checking transaction.')
		}
	}

	return (
		<div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
			<h1>Transaction Verification</h1>
			<input
				type='text'
				value={transactionHash}
				onChange={e => setTransactionHash(e.target.value)}
				placeholder='Enter transaction hash'
				style={{ padding: '10px', width: '100%', marginBottom: '10px' }}
			/>
			<button
				onClick={handleCheckTransaction}
				style={{ padding: '10px', width: '100%' }}
			>
				Verify1
			</button>
			{message && <p style={{ marginTop: '20px' }}>{message}</p>}
		</div>
	)
}
