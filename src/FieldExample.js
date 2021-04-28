import { useFieldMachine } from './useFieldMachine'

const emailConfig = {
  name: 'email',
  defaultValue: '',
  validations: [
    { name: 'empty', validator: (email) => email.length === 0 },
    { name: 'notAnEmail', validator: (email) => !email.includes('@')},
  ],
}

export function FieldExample() {
  const [fieldState, { set, validate }] = useFieldMachine(emailConfig)
  const handleSubmit = (e) => {
    e.preventDefault()
    validate()
  }

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
        {fieldState.matches('invalid.empty') && <div className="input-error">Email is empty</div>}
        {fieldState.matches('invalid.notAnEmail') && <div className="input-error">Provided value is not an email</div>}
      </div>
      <button type="submit" onClick={handleSubmit}>Validate</button>
    </form>
  )
}