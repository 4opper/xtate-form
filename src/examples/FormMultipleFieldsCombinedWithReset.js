import { useFormMachine } from '../lib'

const formConfig = {
  id: 'formMachineTest',
  fields: [
    {
      name: 'email',
      defaultValue: 'default@email.com',
      validations: [
        {
          name: 'lengthCheck',
          request: (email) => new Promise((resolve) => {
            console.log("asyncLengthCheck's request called")
            setTimeout(() => resolve(email), 200)
          }),
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
      defaultValue: 'defaultPassword',
      validations: [
        {
          name: 'lengthCheck',
          request: (password) => new Promise((resolve) => {
            console.log("asyncLengthCheck's request called")
            setTimeout(() => resolve(password), 200)
          }),
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

export function FormMultipleFieldsCombinedWithReset() {
  const [formState, { validate, set, reset }] = useFormMachine(formConfig)
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("before validate is called")
    validate()
    console.log("after validate is called")
  }
  const handleReset = (e) => {
    e.preventDefault()
    reset()
  }

  return (
    <form>
      <div>Multiple fields</div>
      <button onClick={handleReset}>RESET</button>
      <div>
        <input
          type="text"
          name="test"
          placeholder="Email"
          className={`${formState.matches('invalid') && 'input-invalid'} ${formState.matches('valid') && 'input-valid'}`}
          value={formState.context.email}
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
          value={formState.context.password}
          onChange={(e) => set({ password: e.target.value })}
        />
        {formState.matches('password.invalid.lengthCheck') && <div className="input-error">lengthCheck failed</div>}
        {formState.matches('password.invalid.isSecure') && <div className="input-error">isSecure failed</div>}
      </div>
      <button type="submit" onClick={handleSubmit}>Validate</button>
    </form>
  )
}