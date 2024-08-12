import { NextApiRequest, NextApiResponse } from 'next'
import { generateToken } from '../../lib/hashUtils'
import { prisma } from '../../prisma'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { transactionHash, userId } = req.body

	// Проверяем, есть ли пользователь с таким userId
	const existingUser = await prisma.user.findUnique({
		where: { userId },
	})

	if (existingUser) {
		// Если пользователь уже верифицирован
		if (existingUser.token) {
			return res
				.status(200)
				.json({
					status: 'success',
					message: 'User already verified',
					token: existingUser.token,
				})
		}
		return res
			.status(400)
			.json({ status: 'fail', message: 'User not verified' })
	}

	// Если пользователь еще не существует, проверяем транзакцию
	const url = `https://apilist.tronscanapi.com/api/transaction-info?hash=${transactionHash}`

	try {
		const response = await fetch(url)
		const transaction = await response.json()

		if (transaction.confirmed) {
			let transferDetails
			if (
				transaction.trc20TransferInfo &&
				transaction.trc20TransferInfo.length > 0
			) {
				transferDetails = transaction.trc20TransferInfo[0]
			} else if (transaction.tokenTransferInfo) {
				transferDetails = transaction.tokenTransferInfo
			}

			if (transferDetails) {
				const transactionAmount =
					parseFloat(transferDetails.amount_str) /
					Math.pow(10, transferDetails.decimals)
				const tokenName = transferDetails.symbol

				if (tokenName === 'USDT' && transactionAmount >= 599) {
					const token = generateToken()

					await prisma.user.create({
						data: {
							userId,
							transactionHash,
							token,
						},
					})

					return res
						.status(200)
						.json({
							status: 'success',
							message: 'Verification successful',
							token,
						})
				} else {
					return res
						.status(400)
						.json({
							status: 'fail',
							message: 'Invalid transaction amount or token',
						})
				}
			} else {
				return res
					.status(400)
					.json({
						status: 'fail',
						message: 'Token transfer information missing',
					})
			}
		} else {
			return res
				.status(400)
				.json({ status: 'fail', message: 'Transaction not confirmed' })
		}
	} catch (error) {
		console.error('Error checking transaction:', error)
		return res
			.status(500)
			.json({ status: 'error', message: 'Error verifying transaction' })
	}
}
