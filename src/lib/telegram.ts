export const TelegramWebApp = window.Telegram.WebApp

export const getUser = () => TelegramWebApp.initDataUnsafe.user

export const ready = () => TelegramWebApp.ready()

export const close = () => TelegramWebApp.close()

export const expand = () => TelegramWebApp.expand()

// Добавьте любые другие методы, которые часто используете
