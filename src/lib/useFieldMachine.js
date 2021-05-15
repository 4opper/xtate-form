import { useCallback, useMemo } from 'react'
import { Machine } from 'xstate'
import { useMachine } from '@xstate/react'
import { buildMachineArguments } from './buildMachineArguments'
import { getSetType, getValidateType } from './helpers'

export function useFieldMachine (fieldConfig) {
  const { machineConfig, machineOptions } = useMemo(() => buildMachineArguments(fieldConfig), [fieldConfig])
  const fieldMachine = useMemo(() => Machine(machineConfig, machineOptions), [machineConfig, machineOptions])
  const [fieldState, sendField] = useMachine(fieldMachine)
  const validate = useCallback(() => sendField({
    type: getValidateType(fieldConfig.name),
  }), [fieldConfig.name, sendField])
  const set = useCallback((value) => sendField({
    type: getSetType(fieldConfig.name),
    [fieldConfig.name]: value,
  }), [fieldConfig.name, sendField])
  return [fieldState, { validate, set }]
}

