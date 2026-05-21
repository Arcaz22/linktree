'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  AlertCircle,
  Check,
  Eye,
  GripVertical,
  Loader2,
  PencilLine,
  Plus,
  Save,
  Trash2,
} from 'lucide-react'
import { ProfileData, Product } from '@/types'
import FilterBar from '@/components/FilterBar'

type Tab = 'products' | 'profile'
type StatusFilter = 'All' | 'Published' | 'Draft'

type ProductDraft = Omit<Product, 'id' | 'position' | 'isActive'>

const EMPTY_PRODUCT: ProductDraft = {
  name: '',
  category: '',
  image: '',
  description: '',
  affiliateUrl: '',
}

function SortableReviewRow({
  product,
  onEdit,
  onDelete,
  onToggle,
}: {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
  onToggle: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: product.id })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.45 : 1,
      }}
      className="grid gap-4 rounded-3xl border p-4 sm:grid-cols-[auto_72px_minmax(0,1fr)_auto]"
      >
      <button
        {...attributes}
        {...listeners}
        className="flex h-10 w-10 items-center justify-center rounded-full border"
        style={{ borderColor: 'var(--border)', color: 'var(--ink-hint)', background: 'var(--paper)' }}
        aria-label={`Reorder ${product.name}`}
      >
        <GripVertical size={16} />
      </button>

      <div className="relative h-18 w-18 overflow-hidden rounded-[18px] border"
        style={{ borderColor: 'var(--border)', background: 'var(--cream-deep)' }}>
        <Image src={product.image} alt={product.name} fill className="object-cover" sizes="72px" />
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>{product.name}</h3>
          <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
            style={{
              background: product.isActive ? 'rgba(174, 92, 61, 0.12)' : 'rgba(109, 95, 84, 0.08)',
              color: product.isActive ? 'var(--terracotta)' : 'var(--ink-muted)',
            }}>
            {product.isActive ? 'Active' : 'Draft'}
          </span>
        </div>
        <p className="mt-2 text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--ink-hint)' }}>
          {product.category}
        </p>
        <p className="mt-2 line-clamp-2 text-sm leading-6" style={{ color: 'var(--ink-soft)' }}>
          {product.description}
        </p>
      </div>

      <div className="flex items-center gap-2 sm:flex-col sm:items-end">
        <button
          onClick={() => onToggle(product.id)}
          className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold"
          style={{
            background: product.isActive ? 'var(--ink)' : 'var(--paper)',
            color: product.isActive ? 'var(--paper)' : 'var(--ink-muted)',
            border: product.isActive ? 'none' : '1px solid var(--border)',
          }}
        >
          <Eye size={14} />
          {product.isActive ? 'Published' : 'Keep Draft'}
        </button>
        <button
          onClick={() => onEdit(product)}
          className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold"
          style={{ borderColor: 'var(--border)', color: 'var(--ink-soft)' }}
        >
          <PencilLine size={14} />
          Edit
        </button>
        <button
          onClick={() => onDelete(product.id)}
          className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold"
          style={{ borderColor: 'rgba(160, 38, 38, 0.18)', color: '#B44833' }}
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  )
}

function ProductForm({
  initialValue,
  title,
  onCancel,
  onSave,
}: {
  initialValue: ProductDraft
  title: string
  onCancel: () => void
  onSave: (value: ProductDraft) => void
}) {
  const [form, setForm] = useState(initialValue)

  function update<K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) {
    setForm(current => ({ ...current, [key]: value }))
  }

  const fields: Array<{ key: keyof ProductDraft; label: string; placeholder: string }> = [
    { key: 'name', label: 'Nama', placeholder: 'Sony WH-1000XM5' },
    { key: 'category', label: 'Kategori', placeholder: 'Buku' },
    { key: 'image', label: 'Image', placeholder: 'https://...' },
    { key: 'affiliateUrl', label: 'Destination URL', placeholder: 'https://...' },
    { key: 'description', label: 'Personal review', placeholder: 'Apa yang membuat ini layak dibagikan?' },
  ]

  return (
    <div className="rounded-[28px] border p-5"
      style={{ borderColor: 'var(--border)', background: 'rgba(255, 250, 243, 0.92)' }}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--ink-hint)' }}>Tambah Produk</p>
          <h3 className="mt-2 font-display text-2xl" style={{ color: 'var(--ink)' }}>{title}</h3>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {fields.map(field => (
          <div key={field.key}>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em]"
              style={{ color: 'var(--ink-muted)' }}>
              {field.label}
            </label>
            {field.key === 'description' ? (
              <textarea
                rows={5}
                className="w-full rounded-[20px] border px-4 py-3 text-sm leading-6 outline-none"
                style={{ borderColor: 'var(--border)', background: 'var(--paper)', color: 'var(--ink)' }}
                placeholder={field.placeholder}
                value={form.description}
                onChange={event => update('description', event.target.value)}
              />
            ) : (
              <input
                className="w-full rounded-[20px] border px-4 py-3 text-sm outline-none"
                style={{ borderColor: 'var(--border)', background: 'var(--paper)', color: 'var(--ink)' }}
                placeholder={field.placeholder}
                value={form[field.key] as string}
                onChange={event => update(field.key, event.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          onClick={() => onSave(form)}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold"
          style={{ background: 'var(--terracotta)', color: 'var(--paper)' }}
        >
          <Check size={15} />
          Save Review
        </button>
        <button
          onClick={onCancel}
          className="rounded-full border px-4 py-2.5 text-sm font-semibold"
          style={{ borderColor: 'var(--border)', color: 'var(--ink-muted)' }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [data, setData] = useState<ProfileData | null>(null)
  const [tab, setTab] = useState<Tab>('products')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeStatus, setActiveStatus] = useState<StatusFilter>('All')

  const sensors = useSensors(useSensor(PointerSensor))

  useEffect(() => {
    fetch('/api/profile')
      .then(response => response.json())
      .then(setData)
      .catch(() => setError('Failed to load profile data.'))
  }, [])

  async function saveChanges() {
    if (!data) return

    setSaving(true)
    setError('')

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('save_failed')
      }

      setSaved(true)
      window.setTimeout(() => setSaved(false), 2200)
    } catch {
      setError('Failed to save changes.')
    } finally {
      setSaving(false)
    }
  }

  function isProductVisible(product: Product) {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory
    const matchesStatus = activeStatus === 'All'
      || (activeStatus === 'Published' && product.isActive)
      || (activeStatus === 'Draft' && !product.isActive)

    return matchesCategory && matchesStatus
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!data || !over || active.id === over.id) return

    const orderedProducts = [...data.products].sort((a, b) => a.position - b.position)
    const visibleProducts = orderedProducts.filter(product => isProductVisible(product))
    const oldIndex = visibleProducts.findIndex(product => product.id === active.id)
    const newIndex = visibleProducts.findIndex(product => product.id === over.id)

    if (oldIndex === -1 || newIndex === -1) return

    const reorderedVisibleProducts = arrayMove(visibleProducts, oldIndex, newIndex)
    const visibleIds = new Set(visibleProducts.map(product => product.id))
    let nextVisibleIndex = 0

    const products = orderedProducts
      .map(product => {
        if (!visibleIds.has(product.id)) {
          return product
        }

        const nextProduct = reorderedVisibleProducts[nextVisibleIndex]
        nextVisibleIndex += 1
        return nextProduct
      })
      .map((product, index) => ({
        ...product,
        position: index + 1,
      }))

    setData({ ...data, products })
  }

  function toggleProduct(id: string) {
    if (!data) return

    setData({
      ...data,
      products: data.products.map(product =>
        product.id === id ? { ...product, isActive: !product.isActive } : product),
    })
  }

  function addProduct(value: ProductDraft) {
    if (!data) return

    const nextProduct: Product = {
      ...value,
      id: crypto.randomUUID(),
      isActive: true,
      position: data.products.length + 1,
    }

    setData({ ...data, products: [...data.products, nextProduct] })
    setShowAddForm(false)
  }

  function saveEditedProduct(value: ProductDraft) {
    if (!data || !editingProduct) return

    setData({
      ...data,
      products: data.products.map(product =>
        product.id === editingProduct.id
          ? { ...product, ...value }
          : product),
    })
    setEditingProduct(null)
  }

  function deleteProduct(id: string) {
    if (!data || !window.confirm('Delete this review?')) return

    const products = data.products
      .filter(product => product.id !== id)
      .map((product, index) => ({ ...product, position: index + 1 }))

    setData({ ...data, products })
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-(--cream)">
        <Loader2 size={20} className="animate-spin" style={{ color: 'var(--ink-muted)' }} />
      </div>
    )
  }

  const orderedProducts = [...data.products].sort((a, b) => a.position - b.position)
  const categoryOptions = ['All', ...Array.from(new Set(orderedProducts.map(product => product.category)))]
  const statusOptions: StatusFilter[] = ['All', 'Published', 'Draft']
  const publishedCount = orderedProducts.filter(product => product.isActive).length
  const filteredProducts = orderedProducts.filter(isProductVisible)

  return (
    <main className="min-h-screen bg-(--cream)">
      <div className="mx-auto max-w-5xl px-5 py-6 sm:px-8 sm:py-8">
        <section className="rounded-4xl border px-6 py-6 sm:px-8"
          style={{ borderColor: 'var(--border)', background: 'rgba(255, 251, 245, 0.88)' }}>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em]" style={{ color: 'var(--terracotta)' }}>
                Dashboard
              </p>
              <h1 className="mt-3 font-display text-4xl leading-none" style={{ color: 'var(--ink)' }}>
                Management Konten
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7" style={{ color: 'var(--ink-soft)' }}>
                Kelola feed ulasan publik dengan praktis: geser untuk mengatur urutan, terbitkan instan, dan jaga data tetap ringkas hanya dengan lima kolom utama
              </p>
            </div>

            <a
              href="/"
              target="_blank"
              className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold"
              style={{ borderColor: 'var(--border)', color: 'var(--ink-soft)' }}
            >
              Lihat Tampilan Publik
            </a>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {[
              { id: 'products' as Tab, label: 'Produk' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className="rounded-full px-4 py-2 text-sm font-semibold"
                style={tab === item.id
                  ? { background: 'var(--ink)', color: 'var(--paper)' }
                  : { background: 'var(--paper)', color: 'var(--ink-muted)', border: '1px solid var(--border)' }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>

        {error && (
          <div className="mt-5 flex items-center gap-2 rounded-[20px] border px-4 py-3 text-sm"
            style={{ borderColor: '#F3C0B6', background: '#FFF2EE', color: '#B44833' }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {tab === 'products' && (
          <section className="mt-6 space-y-5">
            {/* UNIFIED PRODUCT HEADER + FILTER */}
            <section
              className="rounded-4xl border p-6"
              style={{
                borderColor: 'var(--border)',
                background: 'rgba(255, 251, 245, 0.96)',
              }}
            >
              {/* TOP */}
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2
                    className="font-display text-3xl"
                    style={{ color: 'var(--ink)' }}
                  >
                    Daftar Produk
                  </h2>

                  <p
                    className="mt-2 text-sm"
                    style={{ color: 'var(--ink-muted)' }}
                  >
                    {publishedCount} published / {orderedProducts.length} total
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowAddForm(current => !current)
                    setEditingProduct(null)
                  }}
                  className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all hover:scale-[1.02]"
                  style={{
                    background: 'var(--terracotta)',
                    color: 'var(--paper)',
                  }}
                >
                  <Plus size={16} />
                  Tambah Produk
                </button>
              </div>

              {/* DIVIDER */}
              <div
                className="my-6 h-px w-full"
                style={{
                  background: 'rgba(109,95,84,0.08)',
                }}
              />

              {/* FILTER SECTION */}
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                {/* FILTER INFO */}
                <div className="lg:max-w-60">
                  <p
                    className="text-xs uppercase tracking-[0.22em]"
                    style={{ color: 'var(--ink-hint)' }}
                  >
                    Filter Data
                  </p>

                  <p
                    className="mt-2 text-sm leading-6"
                    style={{ color: 'var(--ink-muted)' }}
                  >
                    Menampilkan {filteredProducts.length} produk berdasarkan filter saat ini
                  </p>
                </div>

                {/* FILTER CHIPS */}
                <div className="flex w-full flex-col gap-3 lg:max-w-3xl">
                  <FilterBar
                    categories={categoryOptions}
                    activeCategory={activeCategory}
                    onSelect={setActiveCategory}
                  />

                  <FilterBar
                    categories={statusOptions}
                    activeCategory={activeStatus}
                    onSelect={value =>
                      setActiveStatus(value as StatusFilter)
                    }
                  />
                </div>
              </div>
            </section>

            {/* ADD FORM */}
            {showAddForm && (
              <ProductForm
                title="Review Terbaru"
                initialValue={EMPTY_PRODUCT}
                onCancel={() => setShowAddForm(false)}
                onSave={addProduct}
              />
            )}

            {/* EDIT FORM */}
            {editingProduct && (
              <ProductForm
                title={editingProduct.name}
                initialValue={{
                  name: editingProduct.name,
                  category: editingProduct.category,
                  image: editingProduct.image,
                  description: editingProduct.description,
                  affiliateUrl: editingProduct.affiliateUrl,
                }}
                onCancel={() => setEditingProduct(null)}
                onSave={saveEditedProduct}
              />
            )}

            {/* SORTABLE PRODUCT LIST */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={filteredProducts.map(product => product.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {filteredProducts.length ? (
                    filteredProducts.map(product => (
                      <SortableReviewRow
                        key={product.id}
                        product={product}
                        onEdit={nextProduct => {
                          setEditingProduct(nextProduct)
                          setShowAddForm(false)
                        }}
                        onDelete={deleteProduct}
                        onToggle={toggleProduct}
                      />
                    ))
                  ) : (
                    <div
                      className="rounded-[28px] border px-6 py-14 text-center"
                      style={{
                        borderColor: 'var(--border)',
                        background: 'var(--paper)',
                      }}
                    >
                      <p
                        className="text-sm"
                        style={{ color: 'var(--ink-muted)' }}
                      >
                        Produk Tidak Tersedia
                      </p>
                    </div>
                  )}
                </div>
              </SortableContext>
            </DndContext>
          </section>
        )}

        <div className="mt-8">
          <button
            onClick={saveChanges}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold disabled:opacity-70"
            style={{ background: saved ? '#2F7A5A' : 'var(--terracotta)', color: 'var(--paper)' }}
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <Check size={16} /> : <Save size={16} />}
            {saving ? 'Saving...' : saved ? 'Saved' : 'Save changes'}
          </button>
        </div>
      </div>
    </main>
  )
}
