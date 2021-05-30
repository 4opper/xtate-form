import { assign } from 'xstate'
import { getSetType } from './helpers'

export function prepareFormMachineOptions(formConfig) {
  const result = {
    actions: formConfig.fields.reduce((acc, field) => {
      acc[`${field.name}Set`] = assign((_, { [field.name]: value }) => ({ [field.name]: value }))
      acc[`${field.name}Reset`] = assign(() => ({ [field.name]: field.defaultValue }))
      return acc
    }, {}),
    guards: formConfig.fields.reduce((acc, field) => {
      field.validations.forEach((validation) => {
        acc[`${field.name}:${validation.name}Guard`] = (ctx) => !validation.validator(ctx[field.name])
      })

      return acc
    }, {})
  }

  return result
}

export function prepareFormMachineConfig(formConfig) {
  const context = formConfig.fields.reduce((acc, field) => {
    acc[field.name] = field.defaultValue
    return acc
  }, {})
  const states = prepareFormStates(formConfig)
  const result = {
    id: formConfig.id,
    context,
    type: 'parallel',
    states,
  }

  return result
}

function prepareFormStates(formConfig) {
  const result = formConfig.fields.reduce((acc, field) => {
    const fieldStates = {
      notValidated: {},
      validating: prepareValidatingState({
        name: field.name,
        validations: field.validations,
        hasAsyncValidation: field.validations.find(validation => validation.request !== undefined),
      }),
      valid: {},
      invalid: {
        states: field.validations.reduce((acc, validation) => {
          acc[validation.name] = {}

          return acc
        }, {}),
      },
      requestError: {},
    }
    const on = {
      [getSetType(field.name)]: {
        target: `.notValidated`,
        actions: `${field.name}Set`,
      },
      VALIDATE: {
        target: '.validating',
      },
      RESET: {
        target: '.notValidated',
        actions: `${field.name}Reset`
      },
    }

    acc[field.name] = {
      initial: 'notValidated',
      states: fieldStates,
      on,
    }

    return acc
  }, {})

  return result
}

function prepareValidatingState({ name, validations, hasAsyncValidation }) {
  if (!hasAsyncValidation) {
    return {
      always: [
        ...validations.map(validation => ({
          target: `invalid.${validation.name}`,
          cond: `${name}:${validation.name}Guard`,
        })),
        { target: `valid` },
      ]
    }
  }

  return  {
    invoke: {
      id: `${name}:asyncCheck`,
      src: (context) => {
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
