import * as React from "react"
import './App.css';
import { SingleFieldSyncValidations } from './examples/SingleFieldSyncValidations'
import { SingleFieldCombinedValidations } from './examples/SingleFieldCombinedValidations'
import { SingleFieldAsyncValidations } from './examples/SingleFieldAsyncValidations'
import { MultipleFields } from './examples/MultipleFields'
import { FormSingleFieldSyncValidations } from './examples/FormSingleFieldSyncValidations'
import { FormMultipleFieldsSync } from './examples/FormMultipleFieldsSync'
import { FormSingleFieldAsyncValidations } from './examples/FormSingleFieldAsyncValidations'
import { FormSingleFieldCombinedValidations } from './examples/FormSingleFieldCombinedValidations'
import { FormMultipleFieldsCombined } from './examples/FormMultipleFieldsCombined'

const EXAMPLES_MAP = {
  SINGLE_SYNC: 'SINGLE_SYNC',
  SINGLE_ASYNC: 'SINGLE_ASYNC',
  SINGLE_COMBINED: 'SINGLE_COMBINED',
  MULTIPLE: 'MULTIPLE',
  FORM_SINGLE_SYNC: 'FORM_SINGLE_SYNC',
  FORM_SINGLE_ASYNC: 'FORM_SINGLE_ASYNC',
  FORM_SINGLE_COMBINED: 'FORM_SINGLE_COMBINED',
  FORM_MULTIPLE_SYNC: 'FORM_MULTIPLE_SYNC',
  FORM_MULTIPLE_COMBINED: 'FORM_MULTIPLE_COMBINED',
}

const COMPONENTS_MAP = {
  [EXAMPLES_MAP.SINGLE_SYNC]: SingleFieldSyncValidations,
  [EXAMPLES_MAP.SINGLE_ASYNC]: SingleFieldAsyncValidations,
  [EXAMPLES_MAP.SINGLE_COMBINED]: SingleFieldCombinedValidations,
  [EXAMPLES_MAP.MULTIPLE]: MultipleFields,
  [EXAMPLES_MAP.FORM_SINGLE_SYNC]: FormSingleFieldSyncValidations,
  [EXAMPLES_MAP.FORM_SINGLE_ASYNC]: FormSingleFieldAsyncValidations,
  [EXAMPLES_MAP.FORM_SINGLE_COMBINED]: FormSingleFieldCombinedValidations,
  [EXAMPLES_MAP.FORM_MULTIPLE_SYNC]: FormMultipleFieldsSync,
  [EXAMPLES_MAP.FORM_MULTIPLE_COMBINED]: FormMultipleFieldsCombined,
}

function App() {
  const [example, setExample] = React.useState(EXAMPLES_MAP.FORM_SINGLE_SYNC)
  const Example = COMPONENTS_MAP[example]

  return (
    <div className="App">
      <div className="Sidebar">
        <button onClick={() => setExample(EXAMPLES_MAP.SINGLE_SYNC)}>Single field with only sync validations</button>
        <button onClick={() => setExample(EXAMPLES_MAP.SINGLE_ASYNC)}>Single field with only async validations</button>
        <button onClick={() => setExample(EXAMPLES_MAP.SINGLE_COMBINED)}>Single field with combined validations</button>
        <button onClick={() => setExample(EXAMPLES_MAP.MULTIPLE)}>Multiple fields</button>
        <button onClick={() => setExample(EXAMPLES_MAP.FORM_SINGLE_SYNC)}>Form Single field with only sync validations</button>
        <button onClick={() => setExample(EXAMPLES_MAP.FORM_SINGLE_ASYNC)}>Form Single field with only async validations</button>
        <button onClick={() => setExample(EXAMPLES_MAP.FORM_SINGLE_COMBINED)}>Form Single field with combined validations</button>
        <button onClick={() => setExample(EXAMPLES_MAP.FORM_MULTIPLE_SYNC)}>Form Multiple fields with only sync validations</button>
        <button onClick={() => setExample(EXAMPLES_MAP.FORM_MULTIPLE_COMBINED)}>Form Multiple fields with combined validations</button>
      </div>
      <div>
        <Example />
      </div>
    </div>
  )
}

export default App;
