import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'
import { generateToken } from '../../lib/hashUtils'
import { prisma } from '../../prisma'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { transactionHash, userId } = req.body

	const url = `https://apilist.tronscanapi.com/api/transaction-info?hash=${transactionHash}`

	try {
		const response = await axios.get(url)
		const transaction = response.data

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

				if (tokenName === 'USDT' && transactionAmount >= 100) {
					// Генерация токена
					const token = generateToken()

					// Создание или обновление пользователя в базе данных
					await prisma.user.upsert({
						where: { userId },
						update: { transactionHash, token },
						create: { userId, transactionHash, token },
					})

					return res.json({
						status: 'success',
						message: 'Доступ разрешен',
						amount: transactionAmount,
						token,
					})
				} else {
					return res.json({
						status: 'fail',
						message:
							'Доступ ограничен: сумма транзакции неверна или это не USDT',
					})
				}
			} else {
				return res.json({
					status: 'fail',
					message:
						'Доступ ограничен: информация о переводе токенов отсутствует',
				})
			}
		} else {
			return res.json({
				status: 'fail',
				message: 'Доступ ограничен: транзакция не подтверждена',
			})
		}
	} catch (error) {
		console.error('Ошибка при получении данных о транзакции:', error)
		return res.json({
			status: 'error',
			message: 'Доступ ограничен: ошибка при проверке транзакции',
		})
	}
}
