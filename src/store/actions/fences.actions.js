
export const fencesActionNames = {
  FENCES_GET: 'FENCES/GET',
  FENCES_GET_ROUTE: 'FENCES/GET/ROUTE',
  FENCES_CLEAN: 'FENCES/CLEAN',
  FENCES_SET: 'FENCES/SET',
  FENCES_SET_ALL: 'FENCES/SET/ALL',
  FENCES_EDIT: 'FENCES/EDIT'
}

const {
  FENCES_GET,
  FENCES_GET_ROUTE,
  FENCES_CLEAN,
  FENCES_SET,
  FENCES_SET_ALL,
  FENCES_EDIT
} = fencesActionNames

export const fencesGet = () => ({
  type: FENCES_GET
})

export const fencesGetSingle = (fence) => ({
  type: FENCES_GET_ROUTE,
  fence
})

export const fencesClean = () => ({
  type: FENCES_CLEAN
})

export const fencesSet = (fence) => ({
  type: FENCES_SET,
  fence
})

export const fencesSetAll = (fences) => ({
  type: FENCES_SET_ALL,
  fences
})

export const fencesEdit = (fence, fenceIndex) => ({
  type: FENCES_EDIT,
  fence,
  fenceIndex
})