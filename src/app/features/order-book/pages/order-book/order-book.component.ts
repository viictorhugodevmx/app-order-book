import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'

import { OrderBookService } from '../../../../core/services/order-book.service'
import { OrderBook } from '../../../../shared/models/order-book.model'
import { TradeService } from '../../../../core/services/trade.service'
import { Trade } from '../../../../shared/models/trade.model';
@Component({
  selector: 'app-order-book',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-book.component.html',
  styleUrl: './order-book.component.scss'
})
export class OrderBookComponent implements OnInit {

  orderBook?: OrderBook
  trades: Trade[] = []

  get bestAsk(): number | null {
    const asks = this.orderBook?.asks
    if (!asks || asks.length === 0) return null
    return asks[0].price
  }

  get bestBid(): number | null {
    const bids = this.orderBook?.bids
    if (!bids || bids.length === 0) return null
    return bids[0].price
  }

  get spread(): number | null {
    if (this.bestAsk == null || this.bestBid == null) return null
    return +(this.bestAsk - this.bestBid).toFixed(2)
  }

  get midPrice(): number | null {

    if (this.bestAsk == null || this.bestBid == null) return null

    return +((this.bestAsk + this.bestBid) / 2).toFixed(2)

  }

  get maxAskSize(): number {
    const asks = this.orderBook?.asks ?? []
    return asks.reduce((max, x) => Math.max(max, x.size), 0) || 1
  }

  get maxBidSize(): number {
    const bids = this.orderBook?.bids ?? []
    return bids.reduce((max, x) => Math.max(max, x.size), 0) || 1
  }

  get totalBidSize(): number {

    const bids = this.orderBook?.bids ?? []

    return bids.reduce((sum, level) => sum + level.size, 0)

  }

  get totalAskSize(): number {

    const asks = this.orderBook?.asks ?? []

    return asks.reduce((sum, level) => sum + level.size, 0)

  }

  get buyPressure(): number {

    const total = this.totalBidSize + this.totalAskSize

    if (!total) return 0

    return Math.round((this.totalBidSize / total) * 100)

  }

  get sellPressure(): number {

    const total = this.totalBidSize + this.totalAskSize

    if (!total) return 0

    return Math.round((this.totalAskSize / total) * 100)

  }

  get ladderLevels() {

    if (!this.orderBook) return []

    const asks = this.orderBook.asks.map(a => ({
      price: a.price,
      size: a.size,
      side: 'sell'
    }))

    const bids = this.orderBook.bids.map(b => ({
      price: b.price,
      size: b.size,
      side: 'buy'
    }))

    const levels = [...asks, ...bids]

    return levels.sort((a, b) => b.price - a.price)

  }

  depthWidth(size: number, max: number): string {
    const pct = Math.min(100, Math.max(0, (size / max) * 100))
    return `${pct}%`
  }

  depthOpacity(size: number, max: number): number {

    if (!max) return 0

    const ratio = size / max

    return Math.min(0.6, Math.max(0.08, ratio))

  }

  constructor(
    private orderBookService: OrderBookService,
    private tradeService: TradeService
  ) {}

  ngOnInit(): void {

    this.orderBookService.getOrderBook().subscribe(book => {
      this.orderBook = book
    })

    this.tradeService.getTrades().subscribe(trade => {

      this.trades.unshift(trade)

      if (this.trades.length > 20) {
        this.trades.pop()
      }

    })

  }

}
