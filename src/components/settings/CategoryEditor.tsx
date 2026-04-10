import { useState } from 'react';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Edit2, Trash2, Plus, Check, X, GripVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { Category } from '@/types';

const EMOJI_OPTIONS = ['🏃', '💼', '🎯', '💊', '📌', '🎨', '📚', '🎵', '🍔', '✈️', '🏠', '🛒', '💡', '🔧', '🎮', '🧘', '📱', '🌱', '🐾', '❤️'];
const COLOR_OPTIONS = [
  'bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-red-500', 'bg-amber-500',
  'bg-pink-500', 'bg-cyan-500', 'bg-emerald-500', 'bg-indigo-500', 'bg-orange-500',
];

export default function CategoryEditor() {
  const categories = useSettingsStore((s) => s.categories);
  const setCategories = useSettingsStore((s) => s.setCategories);
  const updateCategory = useSettingsStore((s) => s.updateCategory);
  const removeCategory = useSettingsStore((s) => s.removeCategory);
  const addCategory = useSettingsStore((s) => s.addCategory);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editIcon, setEditIcon] = useState('');
  const [editColor, setEditColor] = useState('');
  const [addMode, setAddMode] = useState(false);
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('📌');
  const [newColor, setNewColor] = useState('bg-blue-500');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const startEdit = (cat: Category) => {
    setEditingId(cat.id as string);
    setEditName(cat.name);
    setEditIcon(cat.icon);
    setEditColor(cat.color);
  };

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      updateCategory(editingId, { name: editName.trim(), icon: editIcon, color: editColor });
      setEditingId(null);
    }
  };

  const handleAdd = () => {
    if (!newName.trim()) return;
    addCategory({
      id: crypto.randomUUID(),
      name: newName.trim(),
      icon: newIcon,
      color: newColor,
    });
    setNewName('');
    setNewIcon('📌');
    setNewColor('bg-blue-500');
    setAddMode(false);
  };

  const confirmDelete = (id: string) => {
    removeCategory(id);
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-2">
      <Reorder.Group axis="y" values={categories} onReorder={setCategories} className="space-y-2">
        <AnimatePresence>
          {categories.map((cat) => (
            <Reorder.Item key={cat.id} value={cat} className="list-none">
              {editingId === cat.id ? (
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="p-3 rounded-2xl bg-card border-2 border-primary/30 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 h-9"
                      autoFocus
                    />
                    <button onClick={saveEdit} className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEditingId(null)} className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground mb-1.5 uppercase">Icône</p>
                    <div className="flex flex-wrap gap-1.5">
                      {EMOJI_OPTIONS.map((e) => (
                        <button
                          key={e}
                          onClick={() => setEditIcon(e)}
                          className={cn(
                            'w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all',
                            editIcon === e ? 'bg-primary/20 ring-2 ring-primary scale-110' : 'bg-muted hover:bg-muted/80'
                          )}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground mb-1.5 uppercase">Couleur</p>
                    <div className="flex flex-wrap gap-1.5">
                      {COLOR_OPTIONS.map((c) => (
                        <button
                          key={c}
                          onClick={() => setEditColor(c)}
                          className={cn(
                            'w-7 h-7 rounded-full transition-all',
                            c,
                            editColor === c ? 'ring-2 ring-primary ring-offset-2 ring-offset-card scale-110' : 'opacity-70 hover:opacity-100'
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : deleteConfirm === cat.id ? (
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="p-3 rounded-2xl bg-destructive/10 border border-destructive/30 flex items-center gap-3"
                >
                  <p className="text-sm flex-1">Supprimer <strong>{cat.name}</strong> ?</p>
                  <button onClick={() => confirmDelete(cat.id as string)} className="px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground text-xs font-semibold">
                    Oui
                  </button>
                  <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1.5 rounded-lg bg-muted text-xs font-semibold">
                    Non
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  layout
                  className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all group"
                >
                  <GripVertical className="w-4 h-4 text-muted-foreground/40 cursor-grab active:cursor-grabbing" />
                  <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm', cat.color)}>
                    {cat.icon}
                  </div>
                  <p className="text-sm font-semibold flex-1">{cat.name}</p>
                  <button onClick={() => startEdit(cat)} className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleteConfirm(cat.id as string)} className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </button>
                </motion.div>
              )}
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>

      <AnimatePresence>
        {addMode ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 rounded-2xl bg-card border-2 border-primary/30 space-y-3"
          >
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nom de la catégorie"
              className="h-9"
              autoFocus
            />
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground mb-1.5 uppercase">Icône</p>
              <div className="flex flex-wrap gap-1.5">
                {EMOJI_OPTIONS.map((e) => (
                  <button
                    key={e}
                    onClick={() => setNewIcon(e)}
                    className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all',
                      newIcon === e ? 'bg-primary/20 ring-2 ring-primary scale-110' : 'bg-muted hover:bg-muted/80'
                    )}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground mb-1.5 uppercase">Couleur</p>
              <div className="flex flex-wrap gap-1.5">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setNewColor(c)}
                    className={cn(
                      'w-7 h-7 rounded-full transition-all',
                      c,
                      newColor === c ? 'ring-2 ring-primary ring-offset-2 ring-offset-card scale-110' : 'opacity-70 hover:opacity-100'
                    )}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleAdd} className="flex-1 h-9 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">
                Ajouter
              </button>
              <button onClick={() => setAddMode(false)} className="h-9 px-4 rounded-xl bg-muted text-sm font-semibold">
                Annuler
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            layout
            onClick={() => setAddMode(true)}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl border-2 border-dashed border-border hover:border-primary/30 text-muted-foreground hover:text-primary transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-semibold">Nouvelle catégorie</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
