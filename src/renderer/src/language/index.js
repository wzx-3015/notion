import { createI18n  } from 'vue-i18n'
const Language  = window.EStore.get('Language')

export const languages = Object.values(Language).map(({ type, label }) => ({ label, type }))

const messages = Object.values(Language).reduce((messages, { type, language }) => {
  messages[type] = language

  return messages
}, {})

export const getLocale = () => (localStorage.getItem('locale') || languages[0].type)
export const setLocale = (val = languages[0].type) => localStorage.setItem('locale', val)

const i18n = createI18n({
  legacy: false,
  messages,
  locale: getLocale()
})


export default i18n
