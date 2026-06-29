import { useState, useEffect, createContext, useContext } from 'react'

const CART_KEY = 'hangar_one_cart'

export const CartContext = createContext(null)

export function useCart() {
  return useContext(CartContext)
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (item) => {
    setItems(prev => {
      const existing = prev.find(i => (i.sku || i.id) === (item.sku || item.id))
      if (existing) {
        return prev.map(i =>
          (i.sku || i.id) === (item.sku || item.id)
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeItem = (id) => {
    setItems(prev => prev.filter(i => (i.sku || i.id) !== id))
  }

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) {
      removeItem(id)
      return
    }
    setItems(prev => prev.map(i =>
      (i.sku || i.id) === id ? { ...i, quantity } : i
    ))
  }

  const clearCart = () => setItems([])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => sum + (parseFloat(i.price) * i.quantity), 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  )
}
