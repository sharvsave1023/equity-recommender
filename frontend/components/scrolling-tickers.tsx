'use client'

export function ScrollingTickers() {
  const tickerText = [
    { symbol: 'AAPL', change: '+2.3%' },
    { symbol: 'MSFT', change: '+1.8%' },
    { symbol: 'VOO', change: '-0.5%' },
    { symbol: 'GOOGL', change: '+3.1%' },
    { symbol: 'AMZN', change: '-1.2%' },
    { symbol: 'META', change: '+4.2%' },
    { symbol: 'NVDA', change: '-2.1%' },
    { symbol: 'TSLA', change: '+5.6%' },
    { symbol: 'BTC', change: '-0.8%' },
    { symbol: 'ETH', change: '+2.7%' },
    { symbol: 'SPY', change: '-1.5%' },
    { symbol: 'QQQ', change: '+1.9%' }
  ].map(item => ({
    ...item,
    isPositive: item.change.startsWith('+'),
    text: `${item.symbol} ${item.change} | `
  }))

  const formattedText = tickerText.map(t => (
    `<span class="${t.isPositive ? 'text-green-500' : 'text-red-500'}">${t.text}</span>`
  )).join('')

  return (
    <div className="fixed right-12 top-1/2 -translate-y-1/2 h-screen flex gap-6 z-0">
      {/* First ticker - scrolling up */}
      <div className="relative w-12 overflow-hidden whitespace-nowrap h-screen bg-black/50 backdrop-blur-sm rounded-[999px]">
        <div 
          className="absolute animate-scroll-up inline-block text-lg tracking-[0.2em] font-extralight"
          style={{ writingMode: 'vertical-rl' }}
          dangerouslySetInnerHTML={{ __html: formattedText.repeat(6) }}
        />
      </div>

      {/* Second ticker - scrolling down */}
      <div className="relative w-12 overflow-hidden whitespace-nowrap h-screen bg-black/50 backdrop-blur-sm rounded-[999px]">
        <div 
          className="absolute animate-scroll-reverse inline-block text-lg tracking-[0.2em] font-extralight"
          style={{ writingMode: 'vertical-rl' }}
          dangerouslySetInnerHTML={{ __html: formattedText.repeat(6) }}
        />
      </div>

      {/* Third ticker - scrolling up */}
      <div className="relative w-12 overflow-hidden whitespace-nowrap h-screen bg-black/50 backdrop-blur-sm rounded-[999px]">
        <div 
          className="absolute animate-scroll-up inline-block text-lg tracking-[0.2em] font-extralight"
          style={{ writingMode: 'vertical-rl' }}
          dangerouslySetInnerHTML={{ __html: formattedText.repeat(6) }}
        />
      </div>
    </div>
  )
}

