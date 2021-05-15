import { useCallback, useMemo } from 'react'
import { Machine, assign } from 'xstate'
import { useMachine } from '@xstate/react'

export function useFieldMachine(fieldConfig) {
  const { machineConfig, machineOptions } = useMemo(() => {
    const hasAsyncValidation = fieldConfig.validations.find(validation => validation.request !== undefined)
    console.log("hasAsyncValidation: ", hasAsyncValidation)

    return prepareMachineArguments(fieldConfig, hasAsyncValidation)
  }, [fieldConfig])
  const emailMachine = useMemo(() => Machine(machineConfig, machineOptions), [machineConfig, machineOptions])
  const [fieldState, sendField] = useMachine(emailMachine)
  const validate = useCallback(() => sendField({
    type: getValidateType(fieldConfig.name),
  }), [fieldConfig.name, sendField])
  const set = useCallback((value) => sendField({
    type: getSetType(fieldConfig.name),
    [fieldConfig.name]: value,
  }), [fieldConfig.name, sendField])
  return [fieldState, { validate, set }]
}

// TODO try to combine into single machine config
// TODO decouple lib code
// TODO add retry
// TODO add init value
// TODO move hasAsyncValidation inside prepareMachineArguments
function prepareMachineArguments({ name, defaultValue, validations }, hasAsyncValidation) {
  const machineConfig = {
    id: name,
    context: { [name]: defaultValue },
    initial: 'notValidated',
    states: {
      notValidated: {},
      validating: hasAsyncValidation ? {
        invoke: {
          id: 'asyncFieldCheck',
          src: (context, event) => {
            const fieldValue = context[name]

            return Promise.all(validations.map(validation => validation.request ? validation.request(fieldValue) : fieldValue))
          },
          onDone: [
            ...validations.map((validation, index) => ({
              target: `invalid.${validation.name}`,
              cond: (context, event) => {
                return !validation.validator(event.data[index])
              },
            })),
            {
              cond: (context, event) => {
                const result = event.data.every((response, index) => validations[index].validator(response))

                // debugger

                return result
              },
              target: 'valid'
            },
          ],
          onError: 'requestError',
        }
      }: {
        always: [
          ...validations.map(validation => ({
            target: `invalid.${validation.name}`,
            cond: `${validation.name}Guard`,
          })),
          {target: 'valid'}
        ],
      },
      valid: {},
      invalid: {
        states: validations.reduce((acc, validation) => {
          acc[validation.name] = {}

          return acc
        }, {}),
      },
      requestError: {},
    },
    on: {
      [getSetType(name)]: {
        target: 'notValidated',
        actions: `${name}Action`,
      },
      [getValidateType(name)]: {
        target: 'validating',
      },
      // [getValidateType(name)]: [
      //   ...validations.map(validation => ({
      //     target: `invalid.${validation.name}`,
      //     cond: `${validation.name}Guard`,
      //   })),
      //   {target: 'valid'}
      // ],
    },
  }
  const machineOptions = {
    actions: {
      [`${name}Action`]: assign((_, { [name]: value }) => ({ [name]: value }))
    },
    guards: validations.reduce((acc, validation) => {
      acc[`${validation.name}Guard`] = (ctx) => !validation.validator(ctx[name])
      return acc
    }, {}),
  }

  return { machineConfig, machineOptions }
}

function getValidateType(fieldName) {
  return `VALIDATE_${fieldName.toUpperCase()}`
}

function getSetType(fieldName) {
  return `SET_${fieldName.toUpperCase()}`
}
// const prepareAsyncMachineConfig = ({ name, defaultValue, validations }) => {
//   const machineConfig = {
//     id: name,
//     context: { [name]: defaultValue },
//     initial: 'notValidated',
//     states: {
//       notValidated: {},
//       validating: {
//         invoke: {
//           id: 'asyncFieldCheck',
//           src: (context, event) => {
//             const fieldValue = context[name]
//
//             return Promise.all(validations.map(validation => validation.request ? validation.request(fieldValue) : fieldValue))
//           },
//           onDone: [
//             ...validations.map((validation, index) => ({
//               target: `invalid.${validation.name}`,
//               cond: (context, event) => {
//                 return !validation.validator(event.data[index])
//               },
//             })),
//             {
//               cond: (context, event) => {
//                 const result = event.data.every((response, index) => validations[index].validator(response))
//
//                 // debugger
//
//                 return result
//               },
//               target: 'valid'
//             },
//           ],
//           onError: 'requestError',
//         }
//       },
//       valid: {},
//       invalid: {
//         states: validations.reduce((acc, validation) => {
//           acc[validation.name] = {}
//
//           return acc
//         }, {}),
//       },
//       requestError: {},
//     },
//     on: {
//       [getSetType(name)]: {
//         target: 'notValidated',
//         actions: `${name}Action`,
//       },
//       [getValidateType(name)]: {
//         target: 'validating',
//       }
//     }
//   }
//   const machineOptions = {
//     actions: {
//       [`${name}Action`]: assign((_, { [name]: value }) => ({ [name]: value }))
//     },
//   }
//
//   return { machineConfig, machineOptions }
// }