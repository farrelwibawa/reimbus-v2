import { setup, assign, fromPromise } from 'xstate'
import { deleteClaim } from '@/services/claimHandlers'

export const deleteMachine = setup({
  types: {
    context: {} as { errorMessage: string },
    events: {} as { type: 'DELETE_CLICKED'; id: string }
  },
  actions: {
    clearError: assign({ errorMessage: '' }),
    setErrorMessage: assign({
      errorMessage: ({ event }) => (event as any).error?.message || 'Gagal menghapus klaim.'
    })
  },
  actors: {
    performDelete: fromPromise(async ({ input }: { input: { id: string } }) => {
      return await deleteClaim(input.id)
    })
  }
}).createMachine({
  id: 'delete',
  initial: 'idle',
  context: {
    errorMessage: ''
  },
  states: {
    idle: {
      on: {
        DELETE_CLICKED: {
          target: 'deleting',
          actions: 'clearError'
        }
      }
    },
    deleting: {
      invoke: {
        src: 'performDelete',
        input: ({ event }) => ({
          id: (event as any).id
        }),
        onDone: {
          target: 'success'
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
        DELETE_CLICKED: {
          target: 'deleting',
          actions: 'clearError'
        }
      }
    }
  }
})
