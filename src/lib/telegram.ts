let TelegramWebApp: any = null

if (typeof window !== 'undefined' && window.Telegram) {
	TelegramWebApp = window.Telegram.WebApp
}

export const getUser = () => {
	if (TelegramWebApp) {
		return TelegramWebApp.initDataUnsafe.user
	}
	return null
}

export const ready = () => {
	if (TelegramWebApp) {
		TelegramWebApp.ready()
	}
}

export const close = () => {
	if (TelegramWebApp) {
		TelegramWebApp.close()
	}
}

export const expand = () => {
	if (TelegramWebApp) {
		TelegramWebApp.expand()
	}
}
