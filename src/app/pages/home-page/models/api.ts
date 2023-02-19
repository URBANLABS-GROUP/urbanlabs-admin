export type Room = {
  id: number
  businessCenterStoreyId: number
  position: string
  name: string
  leaseContractId: string
  requiredTemp: number
  allowablePowerConsumption: number
  area: number
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
  wattPrice: number
}

export type RoomTelemetryInfo = {
  curTemp: number | null
  averageCurTemp: number | null
  curDayPowerConsumption: number | null
  averagePowerConsumption: number | null
  curDayWaterConsumption: number | null
  averageWaterConsumption: number | null
  rent: number | null
  expenses: number | null
  move: boolean | null
}

export type StoreyTelemetryInfo = {
  curTemp: number | null
  averageCurTemp: number | null
  curDayPowerConsumption: number | null
  averagePowerConsumption: number | null
  curDayWaterConsumption: number | null
  averageWaterConsumption: number | null
  rent: number | null
  expenses: number | null
  area: number | null
}

export type BusinessCenterStoreyMap = {
  svgContainer: {
    attributes: Record<string, string>
    bounding: [ [ number, number ], [ number, number ] ]
    innerHtml: string
  }
}
