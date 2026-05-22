'use client'

import { type FormEvent, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import {
  DndContext, PointerSensor, closestCenter,
  useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext, arrayMove, useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  AlertCircle, Check, Eye, GripVertical, Link2, Loader2,
  LockKeyhole, LogOut, PencilLine, Plus, Save, Trash2,
} from 'lucide-react'

import FilterBar from '@/components/FilterBar'
import { getProductImage } from '@/app/lib/product-image'
import { useAdminSession } from '@/app/hooks/useAdminSession'
import { Product, ProfileData } from '@/types'

type StatusFilter = 'All' | 'Published' | 'Draft'
type ProductDraft = Omit<Product, 'id' | 'position' | 'isActive'>

const EMPTY_PRODUCT: ProductDraft = {
  name: '',
  category: '',
  image: '',
  description: '',
  affiliateUrl: '',
}

async function parseJson<T>(response: Response): Promise<T> {
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.error || 'Request failed')
  }

  return data as T
}

function LoginForm({
  loading,
  error,
  onSubmit,
}: {
  loading: boolean
  error: string
  onSubmit: (username: string, password: string) => Promise<void>
}) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await onSubmit(username, password)
  }

  const inputCls = 'w-full rounded-[20px] border px-4 py-3 text-sm outline-none'
  const inputStyle = { borderColor: 'var(--border)', background: 'var(--paper)', color: 'var(--ink)' }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-8" style={{ background: 'var(--cream)' }}>
      <section className="w-full max-w-md rounded-4xl border p-6 sm:p-8"
        style={{ borderColor: 'var(--border)', background: 'rgba(255,251,245,0.96)' }}>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full"
            style={{ background: 'rgba(174,92,61,0.12)', color: 'var(--terracotta)' }}>
            <LockKeyhole size={20} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em]" style={{ color: 'var(--terracotta)' }}>
              Admin Access
            </p>
            <h1 className="mt-1 font-display text-3xl" style={{ color: 'var(--ink)' }}>
              Masuk Dashboard
            </h1>
          </div>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em]"
              style={{ color: 'var(--ink-muted)' }}>
              Username
            </label>
            <input
              className={inputCls}
              style={inputStyle}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="admin"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em]"
              style={{ color: 'var(--ink-muted)' }}>
              Password
            </label>
            <input
              type="password"
              className={inputCls}
              style={inputStyle}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-[20px] border px-4 py-3 text-sm"
              style={{ borderColor: '#F3C0B6', background: '#FFF2EE', color: '#B44833' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !username || !password}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold disabled:opacity-70"
            style={{ background: 'var(--terracotta)', color: 'var(--paper)' }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <LockKeyhole size={16} />}
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
      </section>
    </main>
  )
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
    <div ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
      className="grid gap-4 rounded-3xl border p-4 sm:grid-cols-[auto_72px_minmax(0,1fr)_auto]">
      <button {...attributes} {...listeners}
        className="flex h-10 w-10 items-center justify-center rounded-full border"
        style={{ borderColor: 'var(--border)', color: 'var(--ink-hint)', background: 'var(--paper)' }}>
        <GripVertical size={16} />
      </button>

      <div className="relative h-18 w-18 overflow-hidden rounded-[18px] border shrink-0"
        style={{ borderColor: 'var(--border)', background: 'var(--cream-deep)' }}>
        <Image
          src={getProductImage(product.image)}
          alt={product.name}
          fill
          className="object-cover"
          sizes="72px"
        />
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>{product.name}</h3>
          <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
            style={{
              background: product.isActive ? 'rgba(174,92,61,0.12)' : 'rgba(109,95,84,0.08)',
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
        <button onClick={() => onToggle(product.id)}
          className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold"
          style={{
            background: product.isActive ? 'var(--ink)' : 'var(--paper)',
            color: product.isActive ? 'var(--paper)' : 'var(--ink-muted)',
            border: product.isActive ? 'none' : '1px solid var(--border)',
          }}>
          <Eye size={14} />
          {product.isActive ? 'Published' : 'Keep Draft'}
        </button>
        <button onClick={() => onEdit(product)}
          className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold"
          style={{ borderColor: 'var(--border)', color: 'var(--ink-soft)' }}>
          <PencilLine size={14} /> Edit
        </button>
        <button onClick={() => onDelete(product.id)}
          className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold"
          style={{ borderColor: 'rgba(160,38,38,0.18)', color: '#B44833' }}>
          <Trash2 size={14} /> Delete
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
  categories,
}: {
  initialValue: ProductDraft
  title: string
  onCancel: () => void
  onSave: (value: ProductDraft) => void
  categories: string[]
}) {
  const [form, setForm] = useState(initialValue)

  function update<K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const inputCls = 'w-full rounded-[20px] border px-4 py-3 text-sm outline-none'
  const inputStyle = { borderColor: 'var(--border)', background: 'var(--paper)', color: 'var(--ink)' }
  const imageSrc = getProductImage(form.image)

  return (
    <div className="rounded-[28px] border p-5"
      style={{ borderColor: 'var(--border)', background: 'rgba(255,250,243,0.92)' }}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--ink-hint)' }}>
            {title === 'Review Terbaru' ? 'Tambah Produk' : 'Edit Produk'}
          </p>
          <h3 className="mt-2 font-display text-2xl" style={{ color: 'var(--ink)' }}>{title}</h3>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em]"
            style={{ color: 'var(--ink-muted)' }}>
            Link Afiliasi *
          </label>
          <div className="relative">
            <Link2 size={15} className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--ink-hint)' }} />
            <input className={inputCls + ' pl-10'} style={inputStyle}
              placeholder="https://produk-..."
              value={form.affiliateUrl}
              onChange={(event) => update('affiliateUrl', event.target.value)} />
          </div>
        </div>

        {/* <div className="flex items-center gap-4 rounded-[20px] border p-3"
          style={{ borderColor: 'var(--border)', background: 'var(--cream-deep)' }}>
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
            <Image src={imageSrc} alt="preview" fill className="object-cover" sizes="64px" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium" style={{ color: 'var(--ink-muted)' }}>Preview gambar default</p>
            <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--ink-hint)' }}>{imageSrc}</p>
          </div>
        </div> */}

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em]"
            style={{ color: 'var(--ink-muted)' }}>Nama Produk *</label>
          <input className={inputCls} style={inputStyle}
            placeholder="Nama Produk"
            value={form.name}
            onChange={(event) => update('name', event.target.value)} />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em]"
            style={{ color: 'var(--ink-muted)' }}>Kategori</label>
          <div className="flex gap-2">
            <select className={inputCls} style={inputStyle}
              value={categories.includes(form.category) ? form.category : ''}
              onChange={(event) => update('category', event.target.value)}>
              <option value="">Pilih kategori...</option>
              {categories.filter((category) => category !== 'All').map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <input className={inputCls} style={{ ...inputStyle, width: '160px', flexShrink: 0 }}
              placeholder="atau ketik baru"
              value={!categories.includes(form.category) ? form.category : ''}
              onChange={(event) => update('category', event.target.value)} />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em]"
            style={{ color: 'var(--ink-muted)' }}>Personal Review</label>
          <textarea rows={4} className={inputCls + ' resize-none'} style={inputStyle}
            placeholder="Apa yang membuat produk ini layak dibagikan?"
            value={form.description}
            onChange={(event) => update('description', event.target.value)} />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button onClick={() => onSave(form)}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold"
          style={{ background: 'var(--terracotta)', color: 'var(--paper)' }}>
          <Check size={15} /> Save
        </button>
        <button onClick={onCancel}
          className="rounded-full border px-4 py-2.5 text-sm font-semibold"
          style={{ borderColor: 'var(--border)', color: 'var(--ink-muted)' }}>
          Cancel
        </button>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const { status, error: authError, submitting, login, logout } = useAdminSession()
  const [data, setData] = useState<ProfileData | null>(null)
  const [loadingData, setLoadingData] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeStatus, setActiveStatus] = useState<StatusFilter>('All')

  const sensors = useSensors(useSensor(PointerSensor))

  useEffect(() => {
    if (status !== 'authenticated') return

    fetch('/api/admin/data', { cache: 'no-store' })
      .then((response) => parseJson<ProfileData>(response))
      .then(setData)
      .catch((loadError) => {
        setError(loadError instanceof Error ? loadError.message : 'Gagal memuat data.')
      })
  }, [status])

  const sorted = useMemo(
    () => [...(data?.products ?? [])].sort((left, right) => left.position - right.position),
    [data?.products],
  )

  const allCategories = useMemo(
    () => Array.from(new Set(sorted.map((product) => product.category).filter(Boolean))),
    [sorted],
  )

  const categoryOptions = useMemo(() => ['All', ...allCategories], [allCategories])
  const statusOptions: StatusFilter[] = ['All', 'Published', 'Draft']

  const filteredProducts = useMemo(() => {
    return sorted.filter((product) => {
      const categoryMatch = activeCategory === 'All' || product.category === activeCategory
      const statusMatch = activeStatus === 'All'
        || (activeStatus === 'Published' && product.isActive)
        || (activeStatus === 'Draft' && !product.isActive)

      return categoryMatch && statusMatch
    })
  }, [activeCategory, activeStatus, sorted])

  const publishedCount = useMemo(
    () => sorted.filter((product) => product.isActive).length,
    [sorted],
  )

  async function loadAdminData() {
    setLoadingData(true)
    setError('')

    try {
      setData(await parseJson<ProfileData>(await fetch('/api/admin/data', { cache: 'no-store' })))
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Gagal memuat data.')
    } finally {
      setLoadingData(false)
    }
  }

  async function saveChanges() {
    if (!data) return

    setSaving(true)
    setError('')

    try {
      for (const product of data.products) {
        await parseJson<{ success: true }>(
          await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
          }),
        )
      }

      await parseJson<{ success: true }>(
        await fetch('/api/products/reorder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            positions: data.products.map((product) => ({
              id: product.id,
              position: product.position,
            })),
          }),
        }),
      )

      setSaved(true)
      window.setTimeout(() => setSaved(false), 2200)
      await loadAdminData()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Gagal menyimpan. Coba lagi.')
    } finally {
      setSaving(false)
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!data || !over || active.id === over.id) return

    const oldIndex = filteredProducts.findIndex((product) => product.id === active.id)
    const newIndex = filteredProducts.findIndex((product) => product.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const reorderedVisible = arrayMove(filteredProducts, oldIndex, newIndex)
    const visibleIds = new Set(filteredProducts.map((product) => product.id))
    let visibleIndex = 0

    const products = sorted
      .map((product) => {
        if (!visibleIds.has(product.id)) return product
        return { ...reorderedVisible[visibleIndex++] }
      })
      .map((product, index) => ({ ...product, position: index + 1 }))

    setData({ ...data, products })
  }

  function addProduct(value: ProductDraft) {
    if (!data) return

    const product: Product = {
      ...value,
      id: crypto.randomUUID(),
      isActive: true,
      position: data.products.length + 1,
    }

    setData({ ...data, products: [...data.products, product] })
    setShowAddForm(false)
  }

  function saveEdit(value: ProductDraft) {
    if (!data || !editingProduct) return

    setData({
      ...data,
      products: data.products.map((product) =>
        product.id === editingProduct.id ? { ...product, ...value } : product,
      ),
    })
    setEditingProduct(null)
  }

  async function deleteProduct(id: string) {
    if (!data || !window.confirm('Hapus produk ini?')) return

    try {
      await parseJson<{ success: true }>(await fetch(`/api/products/${id}`, { method: 'DELETE' }))
      setData({
        ...data,
        products: data.products
          .filter((product) => product.id !== id)
          .map((product, index) => ({ ...product, position: index + 1 })),
      })
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Gagal menghapus produk.')
    }
  }

  function toggleProduct(id: string) {
    if (!data) return

    setData({
      ...data,
      products: data.products.map((product) =>
        product.id === id ? { ...product, isActive: !product.isActive } : product,
      ),
    })
  }

  async function handleLogin(nextUsername: string, nextPassword: string) {
    await login(nextUsername, nextPassword)
  }

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--cream)' }}>
        <Loader2 size={20} className="animate-spin" style={{ color: 'var(--ink-muted)' }} />
      </div>
    )
  }

  if (status !== 'authenticated') {
    return <LoginForm loading={submitting} error={authError} onSubmit={handleLogin} />
  }

  if (loadingData || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--cream)' }}>
        <Loader2 size={20} className="animate-spin" style={{ color: 'var(--ink-muted)' }} />
      </div>
    )
  }

  return (
    <main className="min-h-screen" style={{ background: 'var(--cream)' }}>
      <div className="mx-auto max-w-5xl px-5 py-6 sm:px-8 sm:py-8">
        <section className="rounded-4xl border px-6 py-6 sm:px-8"
          style={{ borderColor: 'var(--border)', background: 'rgba(255,251,245,0.88)' }}>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em]" style={{ color: 'var(--terracotta)' }}>
                Dashboard
              </p>
              <h1 className="mt-3 font-display text-4xl leading-none" style={{ color: 'var(--ink)' }}>
                Management Konten
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">

              <a href="/" target="_blank"
                className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold"
                style={{ borderColor: 'var(--border)', color: 'var(--ink-soft)' }}>
                Lihat Tampilan Publik
              </a>
              <button
                onClick={logout}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold disabled:opacity-70"
                style={{ borderColor: 'var(--border)', color: 'var(--ink-soft)' }}
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>
        </section>

        {error && (
          <div className="mt-5 flex items-center gap-2 rounded-[20px] border px-4 py-3 text-sm"
            style={{ borderColor: '#F3C0B6', background: '#FFF2EE', color: '#B44833' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <section className="mt-6 space-y-5">
          <section className="rounded-4xl border p-6"
            style={{ borderColor: 'var(--border)', background: 'rgba(255,251,245,0.96)' }}>
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="font-display text-3xl" style={{ color: 'var(--ink)' }}>Daftar Produk</h2>
                <p className="mt-2 text-sm" style={{ color: 'var(--ink-muted)' }}>
                  {publishedCount} published / {sorted.length} total
                </p>
              </div>
              <button
                onClick={() => { setShowAddForm((current) => !current); setEditingProduct(null) }}
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
                style={{ background: 'var(--terracotta)', color: 'var(--paper)' }}>
                <Plus size={16} /> Tambah Produk
              </button>
            </div>

            <div className="my-6 h-px w-full" style={{ background: 'rgba(109,95,84,0.08)' }} />

            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="lg:max-w-60">
                <p className="text-xs uppercase tracking-[0.22em]" style={{ color: 'var(--ink-hint)' }}>Filter Data</p>
                <p className="mt-2 text-sm leading-6" style={{ color: 'var(--ink-muted)' }}>
                  Menampilkan {filteredProducts.length} produk
                </p>
              </div>
              <div className="flex w-full flex-col gap-3 lg:max-w-3xl">
                <FilterBar categories={categoryOptions} activeCategory={activeCategory} onSelect={setActiveCategory} />
                <FilterBar categories={statusOptions} activeCategory={activeStatus} onSelect={(value) => setActiveStatus(value as StatusFilter)} />
              </div>
            </div>
          </section>

          {showAddForm && (
            <ProductForm title="Review Terbaru" initialValue={EMPTY_PRODUCT} categories={categoryOptions}
              onCancel={() => setShowAddForm(false)} onSave={addProduct} />
          )}
          {editingProduct && (
            <ProductForm title={editingProduct.name} categories={categoryOptions}
              initialValue={{
                name: editingProduct.name,
                category: editingProduct.category,
                image: editingProduct.image,
                description: editingProduct.description,
                affiliateUrl: editingProduct.affiliateUrl,
              }}
              onCancel={() => setEditingProduct(null)} onSave={saveEdit} />
          )}

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={filteredProducts.map((product) => product.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {filteredProducts.length ? filteredProducts.map((product) => (
                  <SortableReviewRow key={product.id} product={product}
                    onEdit={(nextProduct) => { setEditingProduct(nextProduct); setShowAddForm(false) }}
                    onDelete={deleteProduct} onToggle={toggleProduct} />
                )) : (
                  <div className="rounded-[28px] border px-6 py-14 text-center"
                    style={{ borderColor: 'var(--border)', background: 'var(--paper)' }}>
                    <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>Tidak ada produk.</p>
                  </div>
                )}
              </div>
            </SortableContext>
          </DndContext>
        </section>

        <div className="mt-8">
          <button onClick={saveChanges} disabled={saving}
            className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold disabled:opacity-70"
            style={{ background: saved ? '#2F7A5A' : 'var(--terracotta)', color: 'var(--paper)' }}>
            {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</>
              : saved ? <><Check size={16} /> Saved</>
              : <><Save size={16} /> Save Changes</>}
          </button>
        </div>
      </div>
    </main>
  )
}
