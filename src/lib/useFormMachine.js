import { useCallback, useMemo } from 'react'
import { Machine } from 'xstate'
import { useMachine } from '@xstate/react'
import { getSetType } from './helpers'
import { prepareFormMachineOptions, prepareFormMachineConfig } from './buildFormMachineArguments'

export function useFormMachine(formConfig) {
  const machineConfig = useMemo(() => prepareFormMachineConfig(formConfig), [formConfig])
  const machineOptions = useMemo(() => prepareFormMachineOptions(formConfig), [formConfig])
  const formMachine = useMemo(() => Machine(machineConfig, machineOptions), [machineConfig, machineOptions])
  const [formState, dispatch] = useMachine(formMachine)
  const validate = useCallback(() => dispatch({
    type: 'VALIDATE',
  }), [dispatch])
  const set = useCallback((fieldsMap) => {
    if (typeof fieldsMap !== 'object' || fieldsMap === null) {
      throw new Error('Wrong argument, argument should have shape { fieldName1: value1, fieldName2: value2, etc }')
    }
    Object.keys(fieldsMap).forEach(fieldName => dispatch({ type: getSetType(fieldName), [fieldName]: fieldsMap[fieldName] }))
  }, [dispatch])
  return [
    formState,
    {
      validate,
      set,
    }
  ]
}

