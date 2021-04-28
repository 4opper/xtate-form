import { useMachine } from '@xstate/react'
import { formMachine } from './formMachine'

export function FormExample() {
  const [state, send] = useMachine(formMachine)
  const validateEmail = (e) => send({
    type: 'SET_EMAIL',
    email: e.target.value,
  })
  const validateMessage = (e) => send({
    type: 'SET_MESSAGE',
    email: e.target.value,
  })
  const submit = () => send('SUBMIT')
  console.log("state: ", state)
  return <form>
    <input type="text" name="email" placeholder="Email" onBlur={validateEmail} /> <br/>
    <input type="message" name="message" placeholder="Message" onBlur={validateMessage} /> <br/>
    <button
      type="submit"
      onClick={(e) => {
      e.preventDefault()
      submit()
    }}>Submit</button>
  </form>
}