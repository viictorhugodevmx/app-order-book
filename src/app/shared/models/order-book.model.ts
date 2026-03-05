import { OrderLevel } from './order-level.model'

export interface OrderBook {

  bids: OrderLevel[]
  asks: OrderLevel[]

}
