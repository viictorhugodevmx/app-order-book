import { Injectable } from '@angular/core'
import { interval, map } from 'rxjs'
import { OrderBook } from '../../shared/models/order-book.model'
import { OrderLevel } from '../../shared/models/order-level.model'

@Injectable({
  providedIn: 'root'
})
export class OrderBookService {

  getOrderBook() {

    return interval(1000).pipe(

      map(() => {

        const bids: OrderLevel[] = []
        const asks: OrderLevel[] = []

        let basePrice = 43000

        for (let i = 0; i < 10; i++) {

          bids.push({
            price: basePrice - i * 5,
            size: +(Math.random() * 2).toFixed(2)
          })

          asks.push({
            price: basePrice + i * 5,
            size: +(Math.random() * 2).toFixed(2)
          })

        }

        return { bids, asks } as OrderBook

      })

    )

  }

}
