export function getValidateType (fieldName) {
  return `VALIDATE_${fieldName.toUpperCase()}`
}

export function getSetType (fieldName) {
  return `SET_${fieldName.toUpperCase()}`
}