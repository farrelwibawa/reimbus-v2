import { setup, assign, fromPromise } from 'xstate'
import { submitEditClaim } from '@/services/claimHandlers'

export const editMachine = setup({
  types: {
    context: {} as { errorMessage: string; successMessage: string },
    events: {} as { 
      type: 'SUBMIT_CLICKED'; 
      data: { 
        klaimId: string;
        claimCode: string;
        existingReceipt: any;
        file: File | null; 
        category: string; 
        itemName: string; 
        description: string; 
        amount: number;
      } 
    }
  },
  actions: {
    clearMessages: assign({ errorMessage: '', successMessage: '' }),
    setErrorMessage: assign({
      errorMessage: ({ event }) => (event as any).error?.message || 'Gagal menyimpan perubahan.'
    }),
    setSuccessMessage: assign({
      successMessage: 'Klaim berhasil diperbarui! Mengalihkan ke dashboard...'
    })
  },
  actors: {
    performEdit: fromPromise(async ({ input }: { input: any }) => {
      return await submitEditClaim({
        klaimId: input.klaimId,
        claimCode: input.claimCode,
        existingReceipt: input.existingReceipt,
        file: input.file,
        category: input.category,
        itemName: input.itemName,
        description: input.description,
        amount: input.amount
      })
    })
  }
}).createMachine({
  id: 'edit',
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
        src: 'performEdit',
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
