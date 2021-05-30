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
    {
      name: 'password',
      defaultValue: '',
      validations: [
        {
          name: 'lengthCheck',
          validator: (password) => {
            console.log("lengthCheck's validator called")
            return password.length >= 5
          },
        },
        {
          name: 'isSecure',
          validator: (password) => {
            console.log("isSecure's validator called")
            return password.toLowerCase() !== password
          },
        },
      ],
    }
  ]
}

export function FormMultipleFieldsSync () {
  const [formState, { validate, set }] = useFormMachine(formConfig)
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("before validate is called")
    validate()
    console.log("after validate is called")
  }

  return (
    <form>
      <div>Multiple fields</div>
      <div>
        <input
          type="text"
          name="test"
          placeholder="Email"
          className={`${formState.matches('invalid') && 'input-invalid'} ${formState.matches('valid') && 'input-valid'}`}
          onChange={(e) => set({ email: e.target.value})}
        />
        {formState.matches('email.invalid.lengthCheck') && <div className="input-error">lengthCheck failed</div>}
        {formState.matches('email.invalid.isEmail') && <div className="input-error">isEmail failed</div>}
      </div>
      <div>
        <input
          type="text"
          name="test"
          placeholder="Password"
          className={`${formState.matches('invalid') && 'input-invalid'} ${formState.matches('valid') && 'input-valid'}`}
          onChange={(e) => set({ password: e.target.value })}
        />
        {formState.matches('password.invalid.lengthCheck') && <div className="input-error">lengthCheck failed</div>}
        {formState.matches('password.invalid.isSecure') && <div className="input-error">isSecure failed</div>}
      </div>
      <button type="submit" onClick={handleSubmit}>Validate</button>
    </form>
  )
}