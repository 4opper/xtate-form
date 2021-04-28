import { Machine, assign } from 'xstate'

export const formMachine = Machine(
  {
    id: 'formMachine',
    initial: 'draft',
    context: {
      message: '',
      email: '',
    },
    states: {
      draft: {
        type: 'parallel',
        states: {
          email: {
            initial: 'valid',
            states: {
              valid: {},
              invalid: {
                initial: 'empty',
                states: {
                  empty: {},
                  notAnEmail: {},
                },
              },
            },
            on: {
              SUBMIT: [
                {
                  target: '.invalid.empty',
                  cond: 'isEmailEmpty',
                },
                {
                  target: '.invalid.notAnEmail',
                  cond: 'isEmailNotEmail',
                }
              ],
              SET_EMAIL: {
                target: '.valid',
                actions: 'setEmail',
              }
            }
          },
          message: {
            initial: 'valid',
            states: {
              valid: {},
              invalid: {
                initial: 'empty',
                states: {
                  empty: {},
                  tooShort: {},
                },
              }
            },
            on: {
              SUBMIT: [
                {
                  target: '.invalid.empty',
                  cond: 'isMessageEmpty',
                },
                {
                  target: '.invalid.tooShort',
                  cond: 'isMessageTooShort'
                }
              ],
              SET_MESSAGE: {
                target: '.valid',
                actions: 'setMessage',
              },
            }
          },
        },
        on: {
          SUBMIT: { target: 'loading' },
        }
      },
      loading: {
        on: {
          LOAD_SUCCESS: { target: 'success' },
          LOAD_ERROR: { target: 'error'},
        }
      },
      success: { type: 'final' },
      error: {
        on: {
          RETRY: {
            target: 'loading',
          }
        }
      }
    }
  },
  {
    actions: {
      setEmail: assign((_, { email }) => ({ email })),
      setMessage: assign((_, { message }) => ({ message })),
    },
    guards: {
      isEmailEmpty: (ctx) => ctx.email.length === 0,
      isEmailNotEmail: (ctx) => !ctx.email.includes('@'),
      isMessageEmpty: (ctx) => ctx.message.length === 0,
      isMessageTooShort: (ctx) => ctx.message.length < 5,
    }
  },
)
