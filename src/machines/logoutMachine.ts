import { setup, fromPromise } from 'xstate'
import { API_ENDPOINTS } from '@/constants/api'

export const logoutMachine = setup({
  types: {
    events: {} as { type: 'LOGOUT_CLICKED' }
  },
  actors: {
    performLogout: fromPromise(async () => {
      await fetch(API_ENDPOINTS.LOGOUT, { method: 'POST' })
    })
  }
}).createMachine({
  id: 'logout',
  initial: 'idle',
  states: {
    idle: {
      on: {
        LOGOUT_CLICKED: 'loggingOut'
      }
    },
    loggingOut: {
      invoke: {
        src: 'performLogout',
        onDone: {
          target: 'success'
        },
        onError: {
          // Tetap paksa logout meskipun error jaringan
          target: 'success'
        }
      }
    },
    success: {
      type: 'final'
    }
  }
})
