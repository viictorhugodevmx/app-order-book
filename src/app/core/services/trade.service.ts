import { Injectable } from '@angular/core'
import { interval, map } from 'rxjs'
import { Trade } from '../../shared/models/trade.model'

@Injectable({
  providedIn: 'root'
})
export class TradeService {

  getTrades() {

    return interval(800).pipe(

      map(() => {

        const price = 43000 + Math.floor(Math.random() * 20 - 10)

        const size = +(Math.random() * 2).toFixed(2)

        const side = Math.random() > 0.5 ? 'buy' : 'sell'

        return {

          price,
          size,
          side,
          time: new Date()

        } as Trade

      })

    )

  }

}
