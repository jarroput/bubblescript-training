import { defineShikiSetup } from '@slidev/types'
import bubblescriptLanguage from './bubblescript.tmLanguage.json'

export default defineShikiSetup(() => {
  return {
    langs: [
      bubblescriptLanguage,
    ],
  }
})
