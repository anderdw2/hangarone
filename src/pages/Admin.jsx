import { useState, useEffect } from 'react'
import { db, storage } from '../lib/firebase'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const ADMIN_PASSWORD = 'RayDav3AdminH1!'

const CATEGORIES = [
  'Firearms',
  'Rifles',
  'Pistols',
  'Shotguns',
  'Accessories',
  'Optics',
  'Ammunition',
  'Custom Builds',
  'Parts/Parts Kits',
  'Chassis & Stocks',
  'Grips',
  'Handguards',
  'Other',
]

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: 'Firearms',
  in_stock: true,
  featured: false,
}

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [items, setItems] = useState([])
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)

  const loadItems = async () => {
    const snap = await getDocs(collection(db, 'custom_inventory'))
    setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  useEffect(() => {
    if (authed) loadItems()
  }, [authed])

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthed(true)
      setError('')
    } else {
      setError('Incorrect password.')
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setForm({
      name: item.name || '',
      description: item.description || '',
      price: item.price || '',
      category: item.category || 'Firearms',
      in_stock: item.in_stock ?? true,
      featured: item.featured ?? false,
    })
    setImagePreview(item.image || '')
    setImageFile(null)
    setError('')
    setSuccess('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancel = () => {
    setEditingId(null)
    setForm(emptyForm)
    setImageFile(null)
    setImagePreview('')
    setError('')
    setSuccess('')
  }

  const handleSave = async () => {
    if (!form.name || !form.price) {
      setError('Name and price are required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      let imageUrl = imagePreview || ''
      if (imageFile) {
        const storageRef = ref(storage, `inventory/${Date.now()}_${imageFile.name}`)
        await uploadBytes(storageRef, imageFile)
        imageUrl = await getDownloadURL(storageRef)
      }

      const data = {
        ...form,
        price: parseFloat(form.price),
        image: imageUrl,
      }

      if (editingId) {
        await updateDoc(doc(db, 'custom_inventory', editingId), data)
        setSuccess('Item updated successfully.')
        setEditingId(null)
      } else {
        await addDoc(collection(db, 'custom_inventory'), {
          ...data,
          created_at: new Date().toISOString(),
        })
        setSuccess('Item saved successfully.')
      }

      setForm(emptyForm)
      setImageFile(null)
      setImagePreview('')
      loadItems()
    } catch (err) {
      setError('Failed to save: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return
    await deleteDoc(doc(db, 'custom_inventory', id))
    if (editingId === id) handleCancel()
    loadItems()
  }

  const inputStyle = {
    width: '100%',
    background: 'var(--bg)',
    border: '1px solid var(--rule)',
    color: 'var(--white)',
    padding: '12px 16px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  }

  if (!authed) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--white)',
      }}>
        <div style={{
          background: 'var(--bg2)',
          border: '1px solid var(--rule)',
          padding: '48px',
          width: '360px',
        }}>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '28px',
            letterSpacing: '.06em',
            marginBottom: '32px',
            color: 'var(--amber)',
          }}>ADMIN ACCESS</div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{ ...inputStyle, marginBottom: '16px' }}
          />
          {error && <div style={{ color: 'var(--amber)', fontSize: '12px', marginBottom: '16px' }}>{error}</div>}
          <button
            onClick={handleLogin}
            style={{
              width: '100%',
              background: 'var(--forest)',
              color: '#a8d4b4',
              border: 'none',
              padding: '12px',
              fontSize: '11px',
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            Enter
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ color: 'var(--white)', padding: '48px' }}>
      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: '36px',
        letterSpacing: '.06em',
        color: 'var(--amber)',
        marginBottom: '8px',
      }}>ADMIN — CUSTOM INVENTORY</div>
      <div style={{ fontSize: '13px', color: 'var(--gun)', marginBottom: '40px' }}>
        Add or edit items that appear in the Current Inventory section of the shop.
      </div>

      {/* Form */}
      <div style={{
        background: 'var(--bg2)',
        border: '1px solid var(--rule)',
        padding: '40px',
        marginBottom: '48px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
      }}>
        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '20px',
            letterSpacing: '.06em',
            color: editingId ? 'var(--amber)' : 'var(--white)',
          }}>
            {editingId ? 'EDIT ITEM' : 'ADD NEW ITEM'}
          </div>
          {editingId && (
            <button
              onClick={handleCancel}
              style={{
                background: 'transparent',
                border: '1px solid var(--rule)',
                color: 'var(--muted)',
                padding: '6px 16px',
                fontSize: '10px',
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '10px', letterSpacing: '.1em', color: 'var(--gun)', textTransform: 'uppercase', marginBottom: '8px' }}>Item Name *</label>
          <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '10px', letterSpacing: '.1em', color: 'var(--gun)', textTransform: 'uppercase', marginBottom: '8px' }}>Price *</label>
          <input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} style={inputStyle} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '10px', letterSpacing: '.1em', color: 'var(--gun)', textTransform: 'uppercase', marginBottom: '8px' }}>Category</label>
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ ...inputStyle, appearance: 'none' }}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '10px', letterSpacing: '.1em', color: 'var(--gun)', textTransform: 'uppercase', marginBottom: '8px' }}>Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ ...inputStyle, color: 'var(--gun)', padding: '10px 16px' }}
          />
          {imagePreview && (
            <img src={imagePreview} alt="preview" style={{ marginTop: '12px', maxHeight: '120px', display: 'block' }} />
          )}
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', fontSize: '10px', letterSpacing: '.1em', color: 'var(--gun)', textTransform: 'uppercase', marginBottom: '8px' }}>Description</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'sans-serif' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--gun)', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.in_stock} onChange={e => setForm({ ...form, in_stock: e.target.checked })} />
            In Stock
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--gun)', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
            Featured on Home Page
          </label>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {error && <div style={{ color: 'var(--amber)', fontSize: '12px' }}>{error}</div>}
          {success && <div style={{ color: '#a8d4b4', fontSize: '12px' }}>{success}</div>}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              background: 'var(--forest)',
              color: '#a8d4b4',
              border: 'none',
              padding: '12px 32px',
              fontSize: '11px',
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              cursor: saving ? 'not-allowed' : 'pointer',
            }}
          >
            {saving ? 'Saving...' : editingId ? 'Update Item' : 'Save Item'}
          </button>
        </div>
      </div>

      {/* Inventory list */}
      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: '24px',
        letterSpacing: '.06em',
        marginBottom: '24px',
      }}>CURRENT CUSTOM ITEMS ({items.length})</div>

      {items.length === 0 && (
        <div style={{ color: 'var(--muted)', fontSize: '14px' }}>No custom items yet.</div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '2px',
        background: 'var(--rule)',
      }}>
        {items.map(item => (
          <div key={item.id} style={{
            background: editingId === item.id ? 'var(--bg3)' : 'var(--bg2)',
            padding: '24px',
            border: editingId === item.id ? '1px solid var(--amber)' : '1px solid transparent',
          }}>
            {item.image && (
              <img src={item.image} alt={item.name} style={{ width: '100%', maxHeight: '140px', objectFit: 'contain', marginBottom: '12px' }} />
            )}
            <div style={{ fontSize: '13px', color: 'var(--white)', marginBottom: '4px' }}>{item.name}</div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>{item.category}</div>
            <div style={{ fontSize: '18px', color: 'var(--amber)', fontFamily: "'Bebas Neue', sans-serif", marginBottom: '8px' }}>${item.price?.toFixed(2)}</div>
            <div style={{ fontSize: '10px', color: item.in_stock ? '#a8d4b4' : 'var(--muted)', textTransform: 'uppercase', marginBottom: '16px' }}>
              {item.in_stock ? 'In Stock' : 'Out of Stock'}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleEdit(item)}
                style={{
                  background: 'var(--logo-blue-dim)',
                  border: '1px solid var(--rule)',
                  color: '#a8c4f4',
                  padding: '6px 16px',
                  fontSize: '10px',
                  letterSpacing: '.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--rule)',
                  color: 'var(--muted)',
                  padding: '6px 16px',
                  fontSize: '10px',
                  letterSpacing: '.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}