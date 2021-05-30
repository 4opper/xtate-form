import * as React from "react"
import './App.css';
import { FormSingleFieldSyncValidations } from './examples/FormSingleFieldSyncValidations'
import { FormMultipleFieldsSync } from './examples/FormMultipleFieldsSync'
import { FormSingleFieldAsyncValidations } from './examples/FormSingleFieldAsyncValidations'
import { FormSingleFieldCombinedValidations } from './examples/FormSingleFieldCombinedValidations'
import { FormMultipleFieldsCombined } from './examples/FormMultipleFieldsCombined'

const EXAMPLES_MAP = {
  FORM_SINGLE_SYNC: 'FORM_SINGLE_SYNC',
  FORM_SINGLE_ASYNC: 'FORM_SINGLE_ASYNC',
  FORM_SINGLE_COMBINED: 'FORM_SINGLE_COMBINED',
  FORM_MULTIPLE_SYNC: 'FORM_MULTIPLE_SYNC',
  FORM_MULTIPLE_COMBINED: 'FORM_MULTIPLE_COMBINED',
}

const COMPONENTS_MAP = {
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
        <button onClick={() => setExample(EXAMPLES_MAP.FORM_SINGLE_SYNC)}>Form with single field with only sync validations</button>
        <button onClick={() => setExample(EXAMPLES_MAP.FORM_SINGLE_ASYNC)}>Form with single field with only async validations</button>
        <button onClick={() => setExample(EXAMPLES_MAP.FORM_SINGLE_COMBINED)}>Form with single field with combined validations</button>
        <button onClick={() => setExample(EXAMPLES_MAP.FORM_MULTIPLE_SYNC)}>Form with multiple fields with only sync validations</button>
        <button onClick={() => setExample(EXAMPLES_MAP.FORM_MULTIPLE_COMBINED)}>Form with multiple fields with combined validations</button>
      </div>
      <div>
        <Example />
      </div>
    </div>
  )
}

export default App;
