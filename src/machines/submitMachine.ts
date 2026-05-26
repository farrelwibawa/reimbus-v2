import { setup, assign, fromPromise } from 'xstate'
import { submitNewClaim } from '@/services/claimHandlers'

export const submitMachine = setup({
  types: {
    context: {} as { errorMessage: string; successMessage: string },
    events: {} as { 
      type: 'SUBMIT_CLICKED'; 
      data: { file: File | null; category: string; itemName: string; description: string; amount: number } 
    }
  },
  actions: {
    clearMessages: assign({ errorMessage: '', successMessage: '' }),
    setErrorMessage: assign({
      errorMessage: ({ event }) => (event as any).error?.message || 'Gagal mengirim pengajuan.'
    }),
    setSuccessMessage: assign({
      successMessage: 'Klaim berhasil diajukan! Mengalihkan ke dashboard...'
    })
  },
  actors: {
    performSubmit: fromPromise(async ({ input }: { input: any }) => {
      // Kita asumsikan UI sudah memvalidasi bahwa file tidak null
      if (!input.file) {
        throw new Error('Foto nota wajib dilampirkan.')
      }
      return await submitNewClaim({
        file: input.file,
        category: input.category,
        itemName: input.itemName,
        description: input.description,
        amount: input.amount
      })
    })
  }
}).createMachine({
  id: 'submit',
  initial: 'idle',
  context: {
    errorMessage: '',
    successMessage: ''
  },
  states: {
    idle: {
      on: {
        SUBMIT_CLICKED: {
          target: 'submitting',
          actions: 'clearMessages'
        }
      }
    },
    submitting: {
      invoke: {
        src: 'performSubmit',
        input: ({ event }) => (event as any).data,
        onDone: {
          target: 'success',
          actions: 'setSuccessMessage'
        },
        onError: {
          target: 'error',
          actions: 'setErrorMessage'
        }
      }
    },
    success: {
      // Menunggu 1500ms sebelum pindah ke status redirecting
      after: {
        1500: {
          target: 'redirecting'
        }
      }
    },
    redirecting: {
      type: 'final'
    },
    error: {
      on: {
        SUBMIT_CLICKED: {
          target: 'submitting',
          actions: 'clearMessages'
        }
      }
    }
  }
})
