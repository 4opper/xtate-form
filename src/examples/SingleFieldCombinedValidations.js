import { useFieldMachine } from '../lib'

const emailConfig = {
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
}

export function SingleFieldCombinedValidations () {
  const [fieldState, { set, validate }] = useFieldMachine(emailConfig)
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("before validate is called")
    validate()
    console.log("after validate is called")
  }
  console.log("fieldState: ", fieldState)

  return (
    <form>
      <div>Single field with combined validations</div>
      <div>
        <input
          type="text"
          name="test"
          placeholder="Email"
          className={`${fieldState.matches('invalid') && 'input-invalid'} ${fieldState.matches('valid') && 'input-valid'}`}
          onChange={(e) => set(e.target.value)}
        />
        {fieldState.matches('requestError') && <div className="input-error">Something went wrong, try again</div>}
        {fieldState.matches('invalid.lengthCheck') && <div className="input-error">lengthCheck failed</div>}
        {fieldState.matches('invalid.asyncIsEmail') && <div className="input-error">asyncIsEmail failed</div>}
      </div>
      <button type="submit" onClick={handleSubmit}>Validate</button>
    </form>
  )
}