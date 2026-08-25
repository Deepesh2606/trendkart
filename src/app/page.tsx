'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { ArrowRight, Check, Heart, Menu, Search, ShoppingBag, Sparkles, Star, X } from 'lucide-react'

const products = [
  { name: 'Flux Braided Cable', category: 'Cables', price: '₹399', oldPrice: '₹599', rating: '4.9', reviews: '128', image: '/products/flux-cable.png', tag: 'Bestseller', color: 'blue' },
  { name: 'Pulse 45W Charger', category: 'Chargers', price: '₹1,299', oldPrice: '₹1,799', rating: '4.8', reviews: '96', image: '/products/pulse-charger.png', tag: 'Just dropped', color: 'orange' },
  { name: 'Armor Pro Glass', category: 'Protection', price: '₹249', oldPrice: '₹399', rating: '4.7', reviews: '214', image: '/products/armor-glass.png', tag: 'Trending', color: 'silver' },
]

const categories = ['All gear', 'Cables', 'Chargers', 'Protection', 'Audio']

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('All gear')
  const [bag, setBag] = useState<string[]>([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const filteredProducts = useMemo(() => activeCategory === 'All gear' ? products : products.filter((product) => product.category === activeCategory), [activeCategory])

  function addToBag(name: string) {
    setBag((current) => current.includes(name) ? current : [...current, name])
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-accent text-accent-foreground px-4 py-2 text-center text-xs font-semibold tracking-wide">
        Free delivery across India on orders over ₹999 <span className="mx-2 opacity-40">•</span> Built for your everyday carry
      </div>

      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu"><Menu size={22} /></button>
          <a href="#top" className="font-mono text-lg font-bold tracking-[-0.08em]">TREND<span className="text-primary">/</span>KART</a>
          <nav className={`${menuOpen ? 'flex' : 'hidden'} absolute left-0 top-20 w-full flex-col gap-5 border-b border-border bg-background p-5 lg:static lg:flex lg:w-auto lg:flex-row lg:border-0 lg:bg-transparent lg:p-0`}>
            <a className="text-sm font-semibold hover:text-primary" href="#shop">Shop all</a>
            <a className="text-sm font-semibold hover:text-primary" href="#trending">Trending now</a>
            <a className="text-sm font-semibold hover:text-primary" href="#story">Our standard</a>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(!searchOpen)} className="rounded-full p-2 hover:bg-muted" aria-label="Search"><Search size={19} /></button>
            <button className="relative rounded-full p-2 hover:bg-muted" aria-label={`Shopping bag with ${bag.length} items`}><ShoppingBag size={19} />{bag.length > 0 && <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">{bag.length}</span>}</button>
          </div>
        </div>
        {searchOpen && <div className="border-t border-border px-5 py-3"><div className="mx-auto flex max-w-7xl items-center gap-3"><Search size={17} className="text-muted-foreground" /><input autoFocus className="w-full bg-transparent text-sm outline-none" placeholder="Search cables, chargers, protection..." /><button onClick={() => setSearchOpen(false)} aria-label="Close search"><X size={17} /></button></div></div>}
      </header>

      <section id="top" className="mx-auto grid max-w-7xl gap-10 px-5 pb-20 pt-14 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-8 lg:pt-24">
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-primary"><Sparkles size={13} /> What&apos;s moving today</div>
          <h1 className="max-w-2xl text-balance text-5xl font-black leading-[0.95] tracking-[-0.06em] sm:text-7xl">The little upgrades that make a <span className="text-primary">big difference.</span></h1>
          <p className="mt-7 max-w-lg text-pretty text-base leading-7 text-muted-foreground">Your shortcut to the accessories everyone is talking about. Tested, useful, and ready for the everyday grind.</p>
          <a href="#shop" className="mt-9 inline-flex items-center gap-3 rounded-full bg-foreground px-6 py-3.5 text-sm font-bold text-background transition-transform hover:-translate-y-0.5">Explore what&apos;s hot <ArrowRight size={17} /></a>
          <div className="mt-12 flex items-center gap-6 border-t border-border pt-5 text-xs font-semibold text-muted-foreground"><span><b className="text-foreground">4.8/5</b> average rating</span><span><b className="text-foreground">10k+</b> happy upgrades</span></div>
        </div>
        <div className="relative min-h-[410px] overflow-hidden rounded-[2rem] bg-secondary p-6 sm:min-h-[520px]">
          <div className="absolute left-8 top-8 z-10 rounded-full bg-background px-4 py-2 text-xs font-black uppercase tracking-widest">The daily kit</div>
          <Image src="/products/flux-cable.png" alt="Blue braided Flux charging cable" fill priority className="object-cover mix-blend-multiply" />
          <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">01 / cable</p><p className="mt-1 text-xl font-black tracking-tight">Flux Braided Cable</p></div><span className="rounded-full bg-background px-4 py-2 text-sm font-bold">₹399</span></div>
        </div>
      </section>

      <section id="trending" className="border-y border-border bg-muted/40 px-5 py-5"><div className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto lg:px-3"><span className="shrink-0 text-xs font-black uppercase tracking-widest text-muted-foreground">Browse the signal</span>{categories.map((category) => <button key={category} onClick={() => setActiveCategory(category)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors ${activeCategory === category ? 'bg-foreground text-background' : 'hover:bg-background'}`}>{category}</button>)}</div></section>

      <section id="shop" className="mx-auto max-w-7xl px-5 py-20 lg:px-8"><div className="mb-10 flex items-end justify-between"><div><p className="text-xs font-black uppercase tracking-widest text-primary">Curated this week</p><h2 className="mt-2 text-4xl font-black tracking-[-0.05em]">What&apos;s hot</h2></div><span className="hidden text-sm text-muted-foreground sm:block">{filteredProducts.length} pieces in the signal</span></div><div className="grid gap-6 md:grid-cols-3">{filteredProducts.map((product) => <article key={product.name} className="group"><div className={`relative aspect-[.92] overflow-hidden rounded-3xl bg-${product.color === 'blue' ? 'secondary' : product.color === 'orange' ? 'accent/20' : 'muted'}`}><Image src={product.image} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" /><span className="absolute left-4 top-4 rounded-full bg-background px-3 py-1.5 text-[11px] font-black uppercase tracking-wide">{product.tag}</span><button className="absolute right-4 top-4 rounded-full bg-background p-2.5 opacity-0 transition-opacity group-hover:opacity-100" aria-label={`Save ${product.name}`}><Heart size={17} /></button></div><div className="flex items-start justify-between gap-3 pt-5"><div><p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{product.category}</p><h3 className="mt-1 text-lg font-black tracking-tight">{product.name}</h3><div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><Star size={13} className="fill-primary text-primary" /> {product.rating} ({product.reviews})</div></div><div className="text-right"><p className="font-black">{product.price}</p><p className="text-xs text-muted-foreground line-through">{product.oldPrice}</p></div></div><button onClick={() => addToBag(product.name)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-border py-3 text-sm font-bold transition-colors hover:border-foreground hover:bg-foreground hover:text-background">{bag.includes(product.name) ? <><Check size={16} /> Added to bag</> : 'Add to bag'}</button></article>)}</div></section>

      <section id="story" className="bg-foreground px-5 py-20 text-background lg:px-8"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-end"><div><p className="text-xs font-black uppercase tracking-widest text-primary">Our standard</p><h2 className="mt-4 max-w-xl text-4xl font-black tracking-[-0.05em] sm:text-5xl">No filler. Just gear worth carrying.</h2></div><div className="grid gap-6 text-sm leading-6 text-background/60 sm:grid-cols-3"><div><p className="mb-2 text-2xl font-black text-background">01</p><p>We watch what people actually use, not just what gets clicks.</p></div><div><p className="mb-2 text-2xl font-black text-background">02</p><p>Every pick balances better design, better function, and better value.</p></div><div><p className="mb-2 text-2xl font-black text-background">03</p><p>Small accessories. Noticeably better everyday tech.</p></div></div></div></section>
      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-xs font-semibold text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8"><span className="font-mono text-foreground">TREND/KART</span><span>Jalandhar, Punjab · © 2026</span></footer>
    </main>
  )
}
