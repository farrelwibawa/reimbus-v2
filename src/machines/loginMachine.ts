import { setup, assign, fromPromise } from 'xstate'
import { loginEmployee } from '@/services/authHandlers'

export const loginMachine = setup({
  types: {
    context: {} as { errorMessage: string; role: string },
    events: {} as { type: 'SUBMIT'; email: string; password: string }
  },
  actions: {
    clearError: assign({ errorMessage: '' }),
    setErrorMessage: assign({
      errorMessage: ({ event }) => (event as any).error?.message || 'Terjadi kesalahan saat login.'
    }),
    setRole: assign({
      role: ({ event }) => (event as any).output?.role || ''
    })
  },
  actors: {
    performLogin: fromPromise(async ({ input }: { input: { email: string; password: string } }) => {
      return await loginEmployee(input.email, input.password)
    })
  }
}).createMachine({
  id: 'login',
  initial: 'idle',
  context: {
    errorMessage: '',
    role: ''
  },
  states: {
    idle: {
      on: {
        SUBMIT: {
          target: 'loading',
          actions: 'clearError'
        }
      }
    },
    loading: {
      invoke: {
        src: 'performLogin',
        input: ({ event }) => ({
          email: (event as any).email,
          password: (event as any).password
        }),
        onDone: {
          target: 'success',
          actions: 'setRole'
        },
        onError: {
          target: 'error',
          actions: 'setErrorMessage'
        }
      }
    },
    success: {
      type: 'final'
    },
    error: {
      on: {
        SUBMIT: {
          target: 'loading',
          actions: 'clearError'
        }
      }
    }
  }
})
