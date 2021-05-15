import { assign } from 'xstate'
import { getSetType, getValidateType } from './helpers'

export function buildMachineArguments({ name, defaultValue, validations }) {
  const hasAsyncValidation = validations.find(validation => validation.request !== undefined)
  const machineConfig = prepareMachineConfig({ name, defaultValue, validations, hasAsyncValidation })
  const machineOptions = prepareMachineOptions({ name, validations})

  return { machineConfig, machineOptions }
}

function prepareMachineConfig({ name, defaultValue, validations, hasAsyncValidation }) {
  return {
    id: name,
    context: { [name]: defaultValue },
    initial: 'notValidated',
    states: {
      notValidated: {},
      validating: prepareValidatingState({ name, validations, hasAsyncValidation }),
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
    },
  }
}

function prepareValidatingState({ name, validations, hasAsyncValidation }) {
  if (!hasAsyncValidation) {
    return {
      always: [
        ...validations.map(validation => ({
          target: `invalid.${validation.name}`,
          cond: `${validation.name}Guard`,
        })),
        { target: 'valid' },
      ]
    }
  }

  return  {
    invoke: {
      id: 'asyncFieldCheck',
      src: (context, event) => {
        const fieldValue = context[name]
        const result = Promise.all(validations.map(validation => validation.request ? validation.request(fieldValue) : fieldValue))
        return result
      },
      onDone: [
        ...validations.map((validation, index) => ({
          target: `invalid.${validation.name}`,
          cond: (context, event) => {
            const result = !validation.validator(event.data[index])
            return result
          },
        })),
        {
          cond: (context, event) => {
            const result = event.data.every((response, index) => validations[index].validator(response))
            return result
          },
          target: 'valid',
        },
      ],
      onError: 'requestError',
    },
  }
}

function prepareMachineOptions({ name, validations }) {
  return {
    actions: {
      [`${name}Action`]: assign((_, { [name]: value }) => ({ [name]: value })),
    },
    guards: validations.reduce((acc, validation) => {
      acc[`${validation.name}Guard`] = (ctx) => !validation.validator(ctx[name])
      return acc
    }, {}),
  }
}