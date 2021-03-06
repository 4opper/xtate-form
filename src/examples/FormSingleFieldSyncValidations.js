import { useFormMachine } from '../lib'

const formConfig = {
  id: 'formMachineTest',
  fields: [
    {
      name: 'email',
      defaultValue: '',
      validations: [
        {
          name: 'lengthCheck',
          validator: (email) => {
            console.log("lengthCheck's validator called")
            return email.length !== 0
          },
        },
        {
          name: 'isEmail',
          validator: (email) => {
            console.log("isEmail's validator called")
            return email.includes('@')
          },
        },
      ],
    },
  ]
}

export function FormSingleFieldSyncValidations () {
  const [formState, { validate, set }] = useFormMachine(formConfig)
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("before validate is called")
    validate()
    console.log("after validate is called")
  }

  return (
    <form>
      <div>Single field with only sync validations</div>
      <div>
        <input
          type="text"
          name="test"
          placeholder="Email"
          className={`${formState.matches('invalid') && 'input-invalid'} ${formState.matches('valid') && 'input-valid'}`}
          value={formState.context.email}
          onChange={(e) => set({ email: e.target.value })}
        />
        {formState.matches('email.invalid.lengthCheck') && <div className="input-error">lengthCheck failed</div>}
        {formState.matches('email.invalid.isEmail') && <div className="input-error">isEmail failed</div>}
      </div>
      <button type="submit" onClick={handleSubmit}>Validate</button>
    </form>
  )
}