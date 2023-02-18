export type Room = {
  id: number
  businessCenterStoreyId: number
  position: string
  name: string
  leaseContractId: string
}

export type BusinessCenterStorey = {
  id: number
  businessCenterId: number
  map: string
  name: string
  level: number
  rooms: readonly Room[]
}

export type BusinessCenter = {
  id: number
  name: string
  lessorId: number
  storeys: readonly BusinessCenterStorey[]
}

export type BusinessCenterStoreyMap = {
  svgContainer: {
    attributes: Record<string, string>
    bounding: [ [ number, number ], [ number, number ] ]
    innerHtml: string
  }
}