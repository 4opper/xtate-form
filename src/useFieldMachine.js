import { useCallback, useMemo } from 'react'
import { Machine, assign } from 'xstate'
import { useMachine } from '@xstate/react'

export function useFieldMachine(fieldConfig) {
  const { machineConfig, machineOptions } = useMemo(() => prepareMachineArguments(fieldConfig), [fieldConfig])
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

function prepareMachineArguments({ name, defaultValue, validations }) {
  const machineConfig = {
    id: Math.random(),
    context: { [name]: defaultValue },
    initial: 'valid',
    states: {
      valid: {},
      invalid: {
        states: validations.reduce((acc, validation) => {
          acc[validation.name] = {}

          return acc
        }, {}),
      }
    },
    on: {
      [getValidateType(name)]: validations.map(validation => ({
        target: `invalid.${validation.name}`,
        cond: `${validation.name}Guard`,
      })),
      [getSetType(name)]: {
        target: 'valid',
        actions: `${name}Action`,
      }
    },
  }
  const machineOptions = {
    actions: {
      [`${name}Action`]: assign((_, { [name]: value }) => ({ [name]: value }))
    },
    guards: validations.reduce((acc, validation) => {
      acc[`${validation.name}Guard`] = (ctx) => validation.validator(ctx[name])
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
