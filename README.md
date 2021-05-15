### Реализованно
- синхронная валидация одного поля
- асинхронная валидация одного поля

### Реализация
Визуализация statechart'а если есть асинхронная валидация
![async](./src/images/async.png)

Визуализация statechart'а если нет асинхронной валидации
![sync](./src/images/sync.png)
Для синхронной валидации используется Eventless ("Always") Transitions чтобы автоматически перейти из состояния `validating` без дополнительного события. Визуализатор, судя по всему, плохо поддерживает такие переходы.

Statechart имеет 5 состояний:
- `notValidated` - начальное состояние. Так же переход в это состояние происходит после вызова метода `set`
- `validating` - состояние когда валидация в процессе. Переход в это состояние происходит после вызова метода `validate` 
  Если есть асинхронные валидации, statechart будет в состоянии validating пока не завершатся все асинхронные операции.
  Если асинхронных валидаций нет, то запустив все синхронные валидации statechart перейдет в состояние valid или invalid
- `valid` - состояние если значение валидное - попадаем сюда если все валидации вернули `true`
- `invalid` - состояние если значение не валидное - попадаем сюда если хотя бы одна валидация вернула `false`
- `requestError` - состояние ошибки асинхронной операции. Это состояние возможно только если есть хотя бы одна асинхронная валидация

Так же пользователю доступны два метода:
- `set` - устанавливает значение в `context` statechart'а и переводит в состояние `notValidated`
- `validate` - переводит в состояние `validating`

### API
`useFieldMachine(config: fieldConfig): MachineResult` - хук, который возвращает statechart и методы для работы с ним

`fieldConfig` - конфиг поля, имеет следующую сигнатуру
`{ name: string, defaultValue: any, validations: Validation[] }`

`Validation` - объект валидации. Имеет сигнатуру `{ name: string,  validator: (fieldValue|response) => boolean, request?: (fieldValue) => Promise}`
Если есть поле `request`, то в `validator` придет результат вызова `request`, в противном случае — значение поля. `validator` должен вернуть `true` если значение валидно.

`MachineResult` - результат вызова хука с сигнатурой `[fieldState, { set: (value: any) => void, validate: () => void }]`. `fieldState` - объект текущего состояния statechart'а в формате [XState State](https://xstate.js.org/docs/guides/states.html#state-definition) 

### Пример
```js
import { useFieldMachine } from '../lib'

const emailConfig = {
  name: 'email',
  defaultValue: '',
  validations: [
    {
      name: 'lengthCheck',
      validator: (email) => email.length !== 0,
    },
    {
      name: 'asyncIsEmail',
      request: (email) => new Promise((resolve) => {
        setTimeout(() => resolve(email), 400)
      }),
      validator: (response) => response.includes('@'),
    },
  ],
}

export function SingleFieldCombinedValidations () {
  const [fieldState, { set, validate }] = useFieldMachine(emailConfig)
  const handleSubmit = (e) => {
    e.preventDefault()
    validate()
  }

  return (
    <form>
      <div>Single field with combined validations</div>
      <div>
        <input
          type="text"
          name="test"
          placeholder="Email"
          className={`${fieldState.matches('invalid') && 'input-invalid'} ${fieldState.matches('valid') && 'input-valid'}`}
          onChange={(e) => set(e.target.value)}
        />
        {fieldState.matches('requestError') && <div className="input-error">Something went wrong, try again</div>}
        {fieldState.matches('invalid.lengthCheck') && <div className="input-error">lengthCheck failed</div>}
        {fieldState.matches('invalid.asyncIsEmail') && <div className="input-error">asyncIsEmail failed</div>}
      </div>
      <button type="submit" onClick={handleSubmit}>Validate</button>
    </form>
  )
}
```

### Почему выбрано такое API
- простота реализации
- требует достаточно маленький конфиг от пользователя  
- пользователь имеет контроль когда запускать валидацию
- юзеру предоставляются set и validate методы, что лишает юзера необходимости знать о названиях событий   
- запрос и проверка разделены на два отдельных поля, что способствует loose coupling
- если нет async валидаций, то все валидации будут выполнены синхронно

### Недостатки и ограничения
- отдельный statechart для каждого поля
- не предусмотрено расширение функциональности для валидаций на уровне формы
- если есть хотя бы одна async валидация, то все проверки будут вызванный асинхронно
- у пользователя нет доступа к методу send statechart'а
- если любая из асинхронных операций закончится ошибкой, то statechart перейдет в состояние requestError без указания какая именно операция закончилась ошибкой

### Альтернативные варианты
1) один statechart для всей формы. Преимущества:
- более user friendly API
- возможность расширить функциональность без кардинальных изменений внешнего API библиотеки

### Как запустить
`npm i && npm start`