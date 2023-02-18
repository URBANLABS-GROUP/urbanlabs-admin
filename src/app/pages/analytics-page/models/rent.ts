export interface Rent {
  alerts: Leak[]
  checkExpenses: number
  date: string
  expectedIncome: number
  powerExpenses: number
  realIncome: number
  rentCount: number
  requestExpenses: number
  roomCount: number
}

export interface Leak {
  alertType: LeakType
  roomId: number
  income?: number
  expense?: number
  currentTemp?: number
  requiredTemp?: number
  currentPowerConsumption?: number
  requiredPowerConsumption?: number
}

export enum LeakType {
  negativeProfit = "NEGATIVE_PROFIT",
  tooHotTemp = "TOO_HOT_TEMP",
  tooMuchPowerConsuming = "TOO_MUCH_POWER_CONSUMING"
}
