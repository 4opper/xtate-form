import * as React from "react"
import './App.css';
import { SingleFieldSyncValidations } from './examples/SingleFieldSyncValidations'
import { SingleFieldCombinedValidations } from './examples/SingleFieldCombinedValidations'
import { SingleFieldAsyncValidations } from './examples/SingleFieldAsyncValidations'
import { MultipleFields } from './examples/MultipleFields'

const EXAMPLES_MAP = {
  SINGLE_SYNC: 'SINGLE_SYNC',
  SINGLE_ASYNC: 'SINGLE_ASYNC',
  SINGLE_COMBINED: 'SINGLE_COMBINED',
  MULTIPLE: 'MULTIPLE',
}

const COMPONENTS_MAP = {
  [EXAMPLES_MAP.SINGLE_SYNC]: SingleFieldSyncValidations,
  [EXAMPLES_MAP.SINGLE_ASYNC]: SingleFieldAsyncValidations,
  [EXAMPLES_MAP.SINGLE_COMBINED]: SingleFieldCombinedValidations,
  [EXAMPLES_MAP.MULTIPLE]: MultipleFields,
}

function App() {
  const [example, setExample] = React.useState(EXAMPLES_MAP.SINGLE_SYNC)
  const Example = COMPONENTS_MAP[example]

  return (
    <div className="App">
      <div className="Sidebar">
        <button onClick={() => setExample(EXAMPLES_MAP.SINGLE_SYNC)}>Single field with only sync validations</button>
        <button onClick={() => setExample(EXAMPLES_MAP.SINGLE_ASYNC)}>Single field with only async validations</button>
        <button onClick={() => setExample(EXAMPLES_MAP.SINGLE_COMBINED)}>Single field with combined validations</button>
        <button onClick={() => setExample(EXAMPLES_MAP.MULTIPLE)}>Multiple fields</button>
      </div>
      <div>
        <Example />
      </div>
    </div>
  )
}

export default App;
