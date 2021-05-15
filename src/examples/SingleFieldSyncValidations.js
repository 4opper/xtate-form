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
      name: 'isEmail',
      validator: (email) => {
        console.log("isEmail's validator called")
        return email.includes('@')
      },
    },
  ],
}

export function SingleFieldSyncValidations () {
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
      <div>Single field with only sync validations</div>
      <div>
        <input
          type="text"
          name="test"
          placeholder="Email"
          className={`${fieldState.matches('invalid') && 'input-invalid'} ${fieldState.matches('valid') && 'input-valid'}`}
          onChange={(e) => set(e.target.value)}
        />
        {fieldState.matches('invalid.lengthCheck') && <div className="input-error">lengthCheck failed</div>}
        {fieldState.matches('invalid.isEmail') && <div className="input-error">isEmail failed</div>}
      </div>
      <button type="submit" onClick={handleSubmit}>Validate</button>
    </form>
  )
}