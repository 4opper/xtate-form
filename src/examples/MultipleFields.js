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

const passwordConfig = {
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

export function MultipleFields () {
  const [emailState, { set: setEmail, validate: validateEmail }] = useFieldMachine(emailConfig)
  const [passwordState, { set: setPassword, validate: validatePassword }] = useFieldMachine(passwordConfig)
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("before validate is called")
    validateEmail()
    validatePassword()
    console.log("after validate is called")
  }
  console.log("emailState: ", emailState)

  return (
    <form>
      <div>Multiple fields</div>
      <div>
        <input
          type="text"
          name="test"
          placeholder="Email"
          className={`${emailState.matches('invalid') && 'input-invalid'} ${emailState.matches('valid') && 'input-valid'}`}
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailState.matches('invalid.lengthCheck') && <div className="input-error">lengthCheck failed</div>}
        {emailState.matches('invalid.isEmail') && <div className="input-error">isEmail failed</div>}
      </div>
      <div>
        <input
          type="text"
          name="test"
          placeholder="Password"
          className={`${passwordState.matches('invalid') && 'input-invalid'} ${passwordState.matches('valid') && 'input-valid'}`}
          onChange={(e) => setPassword(e.target.value)}
        />
        {passwordState.matches('invalid.lengthCheck') && <div className="input-error">lengthCheck failed</div>}
        {passwordState.matches('invalid.isSecure') && <div className="input-error">isSecure failed</div>}
      </div>
      <button type="submit" onClick={handleSubmit}>Validate</button>
    </form>
  )
}