import { useFieldMachine } from './useFieldMachine'

const emailConfig = {
  name: 'email',
  defaultValue: '',
  validations: [
    { name: 'check1', validator: (email) => {
      console.log("called check1", email)
        return email.length !== 0
      } },
    { name: 'check2', validator: (email) => {
      console.log("called check2")
      return email.includes('@')
      }},
    {
        name: 'check3',
        request: (email) => new Promise((resolve, reject) => {
          setTimeout(() => resolve('3'), 200)
        }),
        validator: (response) => response === '43',
      }
  ],
}

export function Example() {
  const [fieldState, { set, validate }] = useFieldMachine(emailConfig)
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("before")
    validate()
    console.log("after")
  }
  console.log("fieldState: ", fieldState)

  return (
    <form>
      <div>
        <input
          type="text"
          name="test"
          placeholder="Test"
          className={fieldState.matches('invalid') ? 'invalid-input' : undefined}
          onChange={(e) => set(e.target.value)}
        />
        {fieldState.matches('requestError') && <div className="input-error">Something went wrong, try again</div>}
        {fieldState.matches('invalid.check1') && <div className="input-error">check1 failed</div>}
        {fieldState.matches('invalid.check2') && <div className="input-error">check2 failed</div>}
        {fieldState.matches('invalid.check3') && <div className="input-error">check3 failed</div>}
      </div>
      <button type="submit" onClick={handleSubmit}>Validate</button>
    </form>
  )
}