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
          name: 'asyncIsEmail',
          request: (email) => new Promise((resolve) => {
            console.log("asyncIsEmail's request called")
            setTimeout(() => resolve(email), 400)
          }),
          validator: (response) => {
            console.log("asyncIsEmail's validator called")
            return response.includes('@')
          },
        },
      ],
    },
  ]
}

export function FormSingleFieldCombinedValidations () {
  const [formState, { validate, set }] = useFormMachine(formConfig)
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("before validate is called")
    validate()
    console.log("after validate is called")
  }

  return (
    <form>
      <div>Single field with combined validations</div>
      <div>
        <input
          type="text"
          name="test"
          placeholder="Email"
          className={`${formState.matches('invalid') && 'input-invalid'} ${formState.matches('valid') && 'input-valid'}`}
          value={formState.context.email}
          onChange={(e) => set({ email: e.target.value })}
        />
        {formState.matches('requestError') && <div className="input-error">Something went wrong, try again</div>}
        {formState.matches('email.invalid.lengthCheck') && <div className="input-error">lengthCheck failed</div>}
        {formState.matches('email.invalid.asyncIsEmail') && <div className="input-error">asyncIsEmail failed</div>}
      </div>
      <button type="submit" onClick={handleSubmit}>Validate</button>
    </form>
  )
}