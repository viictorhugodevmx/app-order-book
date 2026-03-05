import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'

import { OrderBookService } from '../../../../core/services/order-book.service'
import { OrderBook } from '../../../../shared/models/order-book.model'

@Component({
  selector: 'app-order-book',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-book.component.html',
  styleUrl: './order-book.component.scss'
})
export class OrderBookComponent implements OnInit {

  orderBook?: OrderBook

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

  depthWidth(size: number, max: number): string {
    const pct = Math.min(100, Math.max(0, (size / max) * 100))
    return `${pct}%`
  }

  constructor(private orderBookService: OrderBookService) {}

  ngOnInit(): void {

    this.orderBookService.getOrderBook().subscribe(book => {
      this.orderBook = book
    })

  }

}
