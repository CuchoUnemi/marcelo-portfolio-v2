"use client";
// ============================================
// PÁGINA: /admin (Dashboard Principal)
// ============================================
// Panel de administración con pestañas para
// gestionar cada sección del CV (CRUD).
// ============================================

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

// Tipos
interface GenericItem {
  id: string;
  [key: string]: unknown;
}

import { User, Briefcase, Rocket, Zap, GraduationCap, Award, Settings, Tags, Activity, Trash2, Search, X } from "lucide-react";

// Tabs del admin
const TABS = [
  { key: "profile", label: "Perfil", icon: <User size={18} /> },
  { key: "social-links", label: "Enlaces Hero", icon: <Tags size={18} /> },
  { key: "experiences", label: "Experiencia", icon: <Briefcase size={18} /> },
  { key: "projects", label: "Proyectos", icon: <Rocket size={18} /> },
  { key: "skill-categories", label: "Cat. Habilidades", icon: <Tags size={18} /> },
  { key: "skills", label: "Habilidades", icon: <Zap size={18} /> },
  { key: "education", label: "Educación", icon: <GraduationCap size={18} /> },
  { key: "certifications", label: "Certificaciones", icon: <Award size={18} /> },
  { key: "visitors", label: "Visitas", icon: <Activity size={18} /> },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [data, setData] = useState<GenericItem[] | GenericItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<GenericItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [modal, setModal] = useState<{ type: "alert" | "confirm"; title: string; message: string; onConfirm?: () => void } | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);

  // ============================================
  // TIEMPO DE INACTIVIDAD (15 MINUTOS)
  // ============================================
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleInactivity = async () => {
      // Cerrar sesión en el backend
      await fetch("/api/auth/logout", { method: "POST" });
      // Redirigir al login
      router.push("/admin/login");
    };

    const resetTimer = () => {
      clearTimeout(timeout);
      // 15 minutos de inactividad (15 * 60 * 1000 ms)
      timeout = setTimeout(handleInactivity, 15 * 60 * 1000);
    };

    // Eventos que indican que el usuario está activo
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetTimer));

    // Iniciar el temporizador
    resetTimer();

    return () => {
      clearTimeout(timeout);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [router]);

  // Cargar datos del tab activo
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Usar cache: 'no-store' y un timestamp para forzar al navegador a obtener datos frescos
      const res = await fetch(`/api/admin/${activeTab}?t=${Date.now()}`, { cache: "no-store" });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const text = await res.text();
      let json = null;
      if (text) {
        try {
          json = JSON.parse(text);
        } catch (e) {
          console.error("No es JSON válido:", text);
          throw new Error("El servidor devolvió una respuesta no válida.");
        }
      }

      if (!res.ok) {
        console.error("Error API:", res.status, json);
        return;
      }

      setData(json);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Logout
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/admin/login" });
  };

  // Eliminar item
  const handleDelete = (id: string) => {
    const isVisitorsAll = activeTab === "visitors" && id === "";
    const title = isVisitorsAll ? "Borrar Historial Completo" : "Eliminar Elemento";
    const message = isVisitorsAll
      ? "¿Estás seguro de que deseas borrar TODO el registro de visitas? Esta acción es irreversible."
      : "¿Estás seguro de que deseas eliminar esto permanentemente?";

    setModal({
      type: "confirm",
      title,
      message,
      onConfirm: async () => {
        setModal(null);
        await fetch(`/api/admin/${activeTab}?id=${id}`, { method: "DELETE" });
        router.refresh();
        fetchData();
      }
    });
  };

  // Guardar (crear o editar)
  const handleSave = async (formData: Record<string, unknown>) => {
    const method = editItem || activeTab === "profile" ? "PUT" : "POST";
    const body = editItem ? { id: editItem.id, ...formData } : formData;

    const res = await fetch(`/api/admin/${activeTab}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.refresh();
      setShowForm(false);
      setEditItem(null);
      fetchData();
    } else if (res.status === 401) {
      router.push("/admin/login");
    } else {
      const text = await res.text();
      try {
        const error = JSON.parse(text);
        let msg = error.error || "No se pudo guardar";
        if (error.details) {
          msg += "\n\nDetalles:\n" + Object.entries(error.details)
            .map(([field, errs]) => `- ${field}: ${(errs as string[]).join(", ")}`)
            .join("\n");
        }
        setModal({ type: "alert", title: "Error al guardar", message: msg });
      } catch (e) {
        console.error("Respuesta del servidor no es JSON:", text);
        setModal({ type: "alert", title: "Error del Servidor", message: `Código: ${res.status}. Revisa la consola.` });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header del Admin */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-foreground/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="text-xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
            <Settings size={24} className="text-primary" /> Panel Admin
          </h1>
          <div className="flex items-center gap-4">
            <a href="/" target="_blank" className="text-sm text-foreground/50 hover:text-primary transition-colors">
              Ver sitio ↗
            </a>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-sm bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors cursor-pointer"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar de Tabs */}
        <aside className="w-56 shrink-0">
          <nav className="sticky top-24 flex flex-col gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setShowForm(false);
                  setEditItem(null);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${activeTab === tab.key
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
                  }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Contenido Principal */}
        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {TABS.find((t) => t.key === activeTab)?.icon}{" "}
              {TABS.find((t) => t.key === activeTab)?.label}
            </h2>

            {activeTab !== "profile" && activeTab !== "visitors" && (
              <button
                onClick={() => {
                  setEditItem(null);
                  setShowForm(true);
                }}
                className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 cursor-pointer"
              >
                + Agregar
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* PERFIL */}
                {activeTab === "profile" && data && !Array.isArray(data) && (
                  <ProfileEditor data={data} onSave={handleSave} />
                )}

                {/* CRUD GENÉRICO */}
                {activeTab !== "profile" && activeTab !== "visitors" && (
                  <>
                    {showForm && (
                      <CrudForm
                        type={activeTab}
                        item={editItem}
                        onSave={handleSave}
                        onCancel={() => {
                          setShowForm(false);
                          setEditItem(null);
                        }}
                        setModal={setModal}
                        setPdfPreview={setPdfPreview}
                      />
                    )}

                    {Array.isArray(data) && (
                      <ItemList
                        items={data}
                        type={activeTab}
                        onEdit={(item) => {
                          setEditItem(item);
                          setShowForm(true);
                        }}
                        onDelete={handleDelete}
                        setPdfPreview={setPdfPreview}
                      />
                    )}
                  </>
                )}

                {/* VISITANTES */}
                {activeTab === "visitors" && Array.isArray(data) && (
                  <VisitorsList
                    visitors={data}
                    onDelete={handleDelete}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>

      {/* MODAL GLOBAL */}
      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-background border border-foreground/10 rounded-2xl p-6 shadow-2xl"
            >
              <h3 className="text-xl font-bold mb-2">{modal.title}</h3>
              <p className="text-foreground/70 mb-6 whitespace-pre-wrap">{modal.message}</p>

              <div className="flex gap-3 justify-end">
                {modal.type === "confirm" ? (
                  <>
                    <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-foreground/5 transition-colors cursor-pointer">
                      Cancelar
                    </button>
                    <button onClick={modal.onConfirm} className="px-4 py-2 rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20 cursor-pointer">
                      Sí, eliminar
                    </button>
                  </>
                ) : (
                  <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl text-sm font-medium bg-primary text-white hover:bg-primary-hover transition-colors cursor-pointer">
                    Entendido
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL VISUALIZADOR DE PDF */}
      <AnimatePresence>
        {pdfPreview && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-sm px-4 py-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-5xl h-[90vh] bg-background border border-foreground/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="flex justify-between items-center px-6 py-4 border-b border-foreground/10 bg-foreground/[0.02]">
                <h3 className="text-lg font-bold">Visualizador de Documento</h3>
                <button
                  onClick={() => setPdfPreview(null)}
                  className="p-2 text-foreground/50 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                  title="Cerrar visualizador"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 w-full h-full bg-foreground/5 relative">
                <iframe
                  src={pdfPreview}
                  className="absolute inset-0 w-full h-full border-0"
                  title="PDF Preview"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// SUB-COMPONENTES DEL DASHBOARD
// ============================================

// Editor de Perfil
function ProfileEditor({
  data,
  onSave,
}: {
  data: GenericItem;
  onSave: (data: Record<string, unknown>) => void;
}) {
  const [form, setForm] = useState({
    fullName: (data.fullName as string) || "",
    title: (data.title as string) || "",
    location: (data.location as string) || "",
    bio: (data.bio as string) || "",
    aboutMe: (data.aboutMe as string) || "",
    avatarUrl: (data.avatarUrl as string) || "",
  });

  return (
    <div className="p-6 rounded-2xl border border-foreground/5 bg-foreground/[0.02] flex flex-col gap-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Nombre Completo" value={form.fullName} onChange={(v) => setForm({ ...form, fullName: v })} />
        <InputField label="Título Profesional" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
        <InputField label="Ubicación" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
        <InputField label="Avatar URL" value={form.avatarUrl} onChange={(v) => setForm({ ...form, avatarUrl: v })} />
      </div>
      {/* Extracto Corto → Hero Card */}
      <div>
        <label className="block text-sm font-medium text-foreground/70 mb-1">
          Perfil Profesional
          <span className="ml-2 text-xs text-foreground/40 font-normal">(extracto corto · máx. 500 car. · aparece en la tarjeta de identidad)</span>
        </label>
        <textarea
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          rows={3}
          placeholder="Escribe un resumen breve de tu perfil para la tarjeta principal..."
          className="w-full px-4 py-3 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all resize-none text-sm"
        />
      </div>

      {/* Biografía Completa → Biography Section */}
      <div>
        <label className="block text-sm font-medium text-foreground/70 mb-1">
          Biografía Completa
          <span className="ml-2 text-xs text-foreground/40 font-normal">(texto largo · aparece en la sección dedicada de biografía)</span>
        </label>
        <textarea
          value={form.aboutMe}
          onChange={(e) => setForm({ ...form, aboutMe: e.target.value })}
          rows={7}
          placeholder="Cuéntanos tu historia completa: motivaciones, trayectoria, valores profesionales..."
          className="w-full px-4 py-3 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all resize-none text-sm"
        />
      </div>
      <button
        onClick={() => {
          const processed: Record<string, unknown> = {};
          for (const [k, v] of Object.entries(form)) {
            let val = v as string;
            if (k.toLowerCase().includes("url") && val.trim() !== "" && !val.startsWith("http")) {
              val = "https://" + val.trim();
            }
            processed[k] = val === "" ? null : val;
          }
          onSave(processed);
        }}
        className="self-end px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 cursor-pointer"
      >
        Guardar Cambios
      </button>
    </div>
  );
}

function VisitorsList({
  visitors,
  onDelete,
}: {
  visitors: GenericItem[];
  onDelete: (id: string) => void;
}) {
  if (visitors.length === 0) {
    return <p className="text-foreground/40 text-center py-12">No hay visitas registradas aún.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Registro de Visitas</h2>
        <button onClick={() => onDelete("")} className="px-4 py-2 bg-red-500/10 text-red-500 text-sm font-medium rounded-lg hover:bg-red-500/20 cursor-pointer transition-colors">
          Borrar Historial
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-foreground/5 bg-foreground/[0.02]">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-foreground/5 text-foreground/70 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 font-semibold">Dirección IP</th>
              <th className="px-4 py-3 font-semibold">Ubicación</th>
              <th className="px-4 py-3 font-semibold">Dispositivo</th>
              <th className="px-4 py-3 font-semibold">Sistema</th>
              <th className="px-4 py-3 font-semibold">Visitas</th>
              <th className="px-4 py-3 font-semibold">Última Vez</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/5">
            {visitors.map((v) => (
              <tr key={v.id} className="hover:bg-foreground/[0.05] transition-colors">
                <td className="px-4 py-3 font-mono text-xs">{v.ipAddress as string}</td>
                <td className="px-4 py-3">{(v.city && v.country) ? `${v.city}, ${v.country}` : "Desconocida"}</td>
                <td className="px-4 py-3">{v.deviceType as string || "-"}</td>
                <td className="px-4 py-3">{v.os as string || "-"}</td>
                <td className="px-4 py-3 font-bold text-primary">{(v.visitCount as number) || 1}</td>
                <td className="px-4 py-3 text-foreground/60">{new Date(v.lastVisit as string || v.createdAt as string).toLocaleString("es-EC")}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => onDelete(v.id as string)} className="text-red-500/50 hover:text-red-500 transition-colors cursor-pointer" title="Eliminar visita">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Lista genérica de items
function ItemList({
  items,
  type,
  onEdit,
  onDelete,
  setPdfPreview,
}: {
  items: GenericItem[];
  type: string;
  onEdit: (item: GenericItem) => void;
  onDelete: (id: string) => void;
  setPdfPreview: (url: string | null) => void;
}) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extraer categorías únicas (Solo aplica para type === "skills")
  const categories = type === "skills"
    ? (Array.from(new Set(items.map(item => (item.category as any)?.name).filter(Boolean))) as string[])
    : [];

  const getLabel = (item: GenericItem): string => {
    if (type === "social-links") return item.label as string;
    if (type === "experiences") return `${item.position} @ ${item.company}`;
    if (type === "projects") return item.title as string;
    if (type === "skill-categories") return item.name as string;
    if (type === "skills") return item.name as string;
    if (type === "education") return `${item.degree} - ${item.institution}`;
    if (type === "certifications") return `${item.title} - ${item.issuer}`;
    return item.id;
  };

  const getSubLabel = (item: GenericItem): string | null => {
    if (type === "social-links") return (item.url as string) || "Sin enlace (Solo texto)";
    if (type === "skills" && (item.category as any)?.name) return `Categoría: ${(item.category as any).name}`;
    if (type === "projects") return item.technologies as string;
    if (type === "experiences" || type === "education") {
      const start = item.startDate ? new Date(item.startDate as string).getFullYear() : "";
      const end = item.endDate ? new Date(item.endDate as string).getFullYear() : "Presente";
      return `${start} - ${end}`;
    }
    return null;
  };

  const filteredItems = items.filter((item) => {
    // Filtro por categoría (si aplica)
    if (type === "skills" && selectedCategory) {
      if ((item.category as any)?.name !== selectedCategory) return false;
    }

    // Filtro por texto
    if (!search) return true;
    const s = search.toLowerCase();
    const label = getLabel(item).toLowerCase();
    const subLabel = (getSubLabel(item) || "").toLowerCase();
    return label.includes(s) || subLabel.includes(s);
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Barra de Búsqueda y Filtro */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-foreground/40" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar elementos..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-foreground/5 border border-foreground/10 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Filtros de Categoría (Dinámicos) */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedCategory === null
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-foreground/5 text-foreground/70 hover:bg-foreground/10"
                }`}
            >
              Todas
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedCategory === cat
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-foreground/5 text-foreground/70 hover:bg-foreground/10"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-foreground/[0.02] border border-dashed border-foreground/10 rounded-2xl">
          <p className="text-foreground/40 font-medium mb-2">No hay elementos registrados.</p>
          <p className="text-foreground/30 text-xs">Haz clic en &quot;+ Agregar&quot; para crear el primero.</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <p className="text-foreground/40 text-center py-8">No se encontraron resultados para "{search}".</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col p-4 rounded-xl border border-card-border bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all group relative overflow-hidden"
            >
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center gap-3 mb-1">
                  {Boolean(item.iconUrl || item.imageUrl) && (
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-background border border-card-border flex items-center justify-center p-1.5 overflow-hidden">
                      {((item.iconUrl || item.imageUrl) as string).startsWith("http") || ((item.iconUrl || item.imageUrl) as string).startsWith("/") ? (
                        <img
                          src={(item.iconUrl || item.imageUrl) as string}
                          alt="Media"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <i className={`${(item.iconUrl || item.imageUrl)} text-lg text-foreground/80`} />
                      )}
                    </div>
                  )}
                  <h4 className="font-bold text-sm text-foreground/90 truncate" title={getLabel(item)}>
                    {getLabel(item)}
                  </h4>
                </div>

                {getSubLabel(item) && (
                  <p className="text-xs text-text-secondary mt-1 truncate" title={getSubLabel(item) || undefined}>
                    {getSubLabel(item)}
                  </p>
                )}
                {item.order !== undefined && (
                  <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-mono bg-background border border-card-border text-text-secondary">
                    Orden: {item.order as number}
                  </span>
                )}
                {item.level !== undefined && (
                  <span className="inline-block mt-2 ml-2 px-2 py-0.5 rounded text-[10px] font-mono bg-primary/10 text-primary">
                    Nivel: {item.level as number}%
                  </span>
                )}
                {Boolean(item.fileUrl) && (
                  <button
                    onClick={() => setPdfPreview(item.fileUrl as string)}
                    className="inline-block mt-2 ml-2 px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors cursor-pointer"
                  >
                    Ver PDF
                  </button>
                )}
              </div>

              <div className="flex gap-2 mt-4 pt-3 border-t border-foreground/5 opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(item)}
                  className="flex-1 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="flex-1 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Formulario genérico CRUD
function CrudForm({
  type,
  item,
  onSave,
  onCancel,
  setModal,
  setPdfPreview,
}: {
  type: string;
  item: GenericItem | null;
  onSave: (data: Record<string, unknown>) => void;
  onCancel: () => void;
  setModal: (modal: { type: "alert" | "confirm"; title: string; message: string; onConfirm?: () => void } | null) => void;
  setPdfPreview: (url: string | null) => void;
}) {
  const [form, setForm] = useState<Record<string, string | number | boolean>>({});
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [pendingFiles, setPendingFiles] = useState<Record<string, File>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (type === "skills") {
      fetch("/api/admin/skill-categories")
        .then((r) => r.json())
        .then((data) => setCategories(data))
        .catch(console.error);
    }
  }, [type]);

  useEffect(() => {
    if (item) {
      const clean: Record<string, string | number | boolean> = {};
      for (const [key, val] of Object.entries(item)) {
        if (key === "id" || key === "createdAt" || key === "updatedAt") continue;
        if (val instanceof Date) clean[key] = (val as Date).toISOString().split("T")[0];
        else if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}T/.test(val)) clean[key] = val.split("T")[0];
        else if (val !== null && val !== undefined) clean[key] = val as string | number | boolean;
      }
      setForm(clean);
    } else {
      setForm(getDefaultForm(type));
    }
  }, [item, type]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const processedForm = { ...form };

      // Subir archivos pendientes primero
      for (const [key, file] of Object.entries(pendingFiles)) {
        // Borrar el viejo si existía
        if (item && typeof form[key] === "string" && (form[key] as string).startsWith("http")) {
          await fetch(`/api/upload?url=${encodeURIComponent(form[key] as string)}`, { method: "DELETE" }).catch(() => { });
        }

        // Subir el nuevo
        const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
          method: "POST",
          body: file,
        });
        if (!res.ok) throw new Error("Error al subir archivo");
        const blob = await res.json();
        processedForm[key] = blob.url;
      }

      // Convertir fechas al formato ISO para Zod y normalizar URLs
      const processed: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(processedForm)) {
        if (key.includes("Date") || key === "date") {
          processed[key] = val ? new Date(val as string).toISOString() : null;
        } else if (key === "level" || key === "order") {
          processed[key] = Number(val);
        } else if (key === "featured") {
          processed[key] = val === true || val === "true";
        } else if (key.toLowerCase().includes("url") && key !== "iconUrl" && key !== "imageUrl" && key !== "fileUrl" && typeof val === "string" && val.trim() !== "" && !val.startsWith("http")) {
          processed[key] = "https://" + val.trim();
        } else if (key === "iconUrl" && typeof val === "string" && val.trim() !== "" && !val.startsWith("http") && !val.startsWith("/") && val.includes(".")) {
          // Solo agregar https a iconUrl si parece un dominio (tiene punto y no tiene espacios) y no empieza por /
          processed[key] = val.includes(" ") ? val.trim() : "https://" + val.trim();
        } else {
          processed[key] = val || null;
        }
      }
      onSave(processed);
    } catch (e) {
      setModal({ type: "alert", title: "Error", message: "Hubo un problema procesando o subiendo los archivos." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = getFieldsForType(type);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-background border border-foreground/10 rounded-3xl p-6 sm:p-8 shadow-2xl my-auto"
      >
        <button
          onClick={onCancel}
          className="absolute top-6 right-6 p-2 text-foreground/40 hover:text-foreground hover:bg-foreground/5 rounded-full transition-colors cursor-pointer"
        >
          ✕
        </button>
        <h3 className="text-xl font-bold mb-6 pr-8">{item ? "Editar Elemento" : "Crear Nuevo Elemento"}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {fields.map((field) => (
            <div key={field.key} className={field.fullWidth ? "md:col-span-2" : ""}>
              {field.type === "textarea" ? (
                <>
                  <label className="block text-sm font-medium text-foreground/70 mb-1.5">{field.label}</label>
                  <textarea
                    value={(form[field.key] as string) || ""}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  />
                </>
              ) : field.type === "select" && type === "skills" ? (
                <>
                  <label className="block text-sm font-medium text-foreground/70 mb-1.5">{field.label}</label>
                  <select
                    value={(form[field.key] as string) || ""}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-foreground/10 text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                  >
                    <option value="" className="bg-background text-foreground">Selecciona una categoría...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id} className="bg-background text-foreground">{c.name}</option>
                    ))}
                  </select>
                </>
              ) : field.type === "checkbox" ? (
                <label className="flex items-center gap-2 cursor-pointer mt-6">
                  <input
                    type="checkbox"
                    checked={form[field.key] === true || form[field.key] === "true"}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.checked })}
                    className="w-4 h-4 rounded accent-primary"
                  />
                  <span className="text-sm font-medium text-foreground/70">{field.label}</span>
                </label>
              ) : field.type === "file" ? (
                <div className="flex flex-col gap-2 mt-1">
                  <label className="block text-sm font-medium text-foreground/70">{field.label}</label>
                  <div className="flex flex-col gap-3 items-start">
                    <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl text-sm font-semibold transition-colors">
                      <span>Seleccionar archivo PDF...</span>
                      <input
                        type="file"
                        accept={(field as any).accept}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setPendingFiles({ ...pendingFiles, [field.key]: file });
                        }}
                        className="hidden"
                      />
                    </label>

                    {/* Si hay un nuevo archivo seleccionado pendiente por subir */}
                    {pendingFiles[field.key] && (
                      <div className="flex items-center gap-4 bg-yellow-500/10 px-4 py-2 rounded-lg w-full justify-between border border-yellow-500/20">
                        <span className="text-sm text-yellow-500 font-medium truncate">
                          📎 {pendingFiles[field.key].name} (Pendiente)
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const newPending = { ...pendingFiles };
                            delete newPending[field.key];
                            setPendingFiles(newPending);
                          }}
                          className="text-xs text-red-500 hover:text-red-600 hover:underline cursor-pointer font-bold px-2 py-1 bg-red-500/10 rounded-md transition-colors"
                        >
                          Descartar
                        </button>
                      </div>
                    )}

                    {/* Si ya existe un archivo en base de datos y no se ha seleccionado uno nuevo */}
                    {form[field.key] && !pendingFiles[field.key] && (
                      <div className="flex items-center gap-4 bg-foreground/5 px-4 py-2 rounded-lg w-full justify-between">
                        <button
                          type="button"
                          onClick={() => setPdfPreview(form[field.key] as string)}
                          className="text-sm text-primary hover:underline font-medium cursor-pointer"
                        >
                          Ver PDF actual
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setModal({
                              type: "confirm",
                              title: "Eliminar Archivo",
                              message: "¿Borrar permanentemente este archivo del almacenamiento en la nube? Se actualizará este elemento inmediatamente.",
                              onConfirm: async () => {
                                setModal(null);
                                try {
                                  await fetch(`/api/upload?url=${encodeURIComponent(form[field.key] as string)}`, { method: "DELETE" });
                                } catch (e) {
                                  console.error("Error", e);
                                }

                                const newForm = { ...form, [field.key]: "" };
                                setForm(newForm);

                                if (item) {
                                  const processed: Record<string, unknown> = { id: item.id };
                                  for (const [k, v] of Object.entries(newForm)) {
                                    let val = v as string;
                                    if (k.toLowerCase().includes("url") && val?.trim() !== "" && !val?.startsWith("http")) {
                                      val = "https://" + val.trim();
                                    }
                                    processed[k] = val === "" ? null : val;
                                  }
                                  onSave(processed);
                                }
                              }
                            });
                          }}
                          className="text-xs text-red-500 hover:text-red-600 hover:underline cursor-pointer font-bold px-2 py-1 bg-red-500/10 rounded-md transition-colors"
                        >
                          Eliminar PDF
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <InputField
                  label={field.label}
                  type={field.type}
                  value={String(form[field.key] ?? "")}
                  onChange={(v) => setForm({ ...form, [field.key]: v })}
                  helpText={field.helpText}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-8 pt-6 border-t border-foreground/10 justify-end">
          <button onClick={onCancel} className="px-5 py-2.5 rounded-xl text-sm font-medium text-foreground/60 hover:bg-foreground/5 transition-colors cursor-pointer">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Guardando..." : (item ? "Actualizar Elemento" : "Crear Elemento")}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Campo de input reutilizable
function InputField({
  label,
  value,
  onChange,
  type = "text",
  helpText,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  helpText?: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground/70 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
      />
      {helpText && <div className="mt-1.5">{helpText}</div>}
    </div>
  );
}

// Definición de campos por tipo de entidad
interface FieldDef {
  key: string;
  label: string;
  type?: string;
  fullWidth?: boolean;
  helpText?: React.ReactNode;
}

function getFieldsForType(type: string): FieldDef[] {
  switch (type) {
    case "profile":
      return [
        { key: "fullName", label: "Nombre Completo" },
        { key: "title", label: "Título / Profesión" },
        { key: "location", label: "Ubicación" },
        { key: "bio", label: "Biografía Corta (Hero)", type: "textarea" },
        { key: "aboutMe", label: "Biografía Completa", type: "textarea" },
        { key: "avatarUrl", label: "URL Foto Perfil" },
      ];
    case "social-links":
      return [
        { key: "label", label: "Texto / Etiqueta" },
        { key: "url", label: "URL Destino (Opcional)" },
        { key: "iconUrl", label: "Icono (URL o Clase)", helpText: <p className="text-xs text-foreground/50">Ej: "fa-brands fa-whatsapp", "devicon-react-original" o "https://..."</p> },
        { key: "order", label: "Orden", type: "number" },
      ];
    case "experiences":
      return [
        { key: "company", label: "Empresa" },
        { key: "position", label: "Cargo" },
        { key: "startDate", label: "Fecha Inicio", type: "date" },
        { key: "endDate", label: "Fecha Fin (vacío=Presente)", type: "date" },
        { key: "order", label: "Orden", type: "number" },
        { key: "description", label: "Descripción", type: "textarea", fullWidth: true },
      ];
    case "projects":
      return [
        { key: "title", label: "Título" },
        { key: "technologies", label: "Tecnologías (separadas por coma)" },
        { key: "imageUrl", label: "URL de Imagen" },
        { key: "githubUrl", label: "URL de GitHub" },
        { key: "projectUrl", label: "URL del Proyecto" },
        { key: "featured", label: "Destacado", type: "checkbox" },
        { key: "order", label: "Orden", type: "number" },
        { key: "description", label: "Descripción", type: "textarea", fullWidth: true },
      ];
    case "skill-categories":
      return [
        { key: "name", label: "Nombre de Categoría" },
        { key: "order", label: "Orden", type: "number" },
      ];
    case "skills":
      return [
        { key: "name", label: "Nombre" },
        { key: "categoryId", label: "Categoría", type: "select" },
        { key: "level", label: "Nivel (0-100)", type: "number" },
        {
          key: "iconUrl",
          label: "Icono (URL o Clase)",
          helpText: <p className="text-xs text-foreground/50">Ej: "devicon-react-original" o "https://..." (Encuentra en <a href="https://devicon.dev/" target="_blank" className="text-primary hover:underline">Devicon.dev</a>)</p>
        },
        { key: "order", label: "Orden", type: "number" },
      ];
    case "education":
      return [
        { key: "institution", label: "Institución" },
        { key: "degree", label: "Título/Grado" },
        { key: "fieldOfStudy", label: "Campo de Estudio" },
        { key: "startDate", label: "Fecha Inicio", type: "date" },
        { key: "endDate", label: "Fecha Fin (vacío=Presente)", type: "date" },
        { key: "order", label: "Orden", type: "number" },
        { key: "description", label: "Descripción", type: "textarea", fullWidth: true },
      ];
    case "certifications":
      return [
        { key: "title", label: "Título" },
        { key: "issuer", label: "Emisor" },
        { key: "date", label: "Fecha", type: "date" },
        { key: "url", label: "URL de Verificación (Opcional)" },
        { key: "fileUrl", label: "Archivo PDF", type: "file", accept: ".pdf" } as any,
        { key: "order", label: "Orden", type: "number" },
      ];
    default:
      return [];
  }
}

function getDefaultForm(type: string): Record<string, string | number | boolean> {
  switch (type) {
    case "profile":
      return { fullName: "", title: "", location: "", bio: "", aboutMe: "", avatarUrl: "" };
    case "social-links":
      return { label: "", url: "", iconUrl: "", order: 0 };
    case "experiences":
      return { company: "", position: "", startDate: "", endDate: "", description: "", order: 0 };
    case "projects":
      return { title: "", description: "", technologies: "", imageUrl: "", projectUrl: "", githubUrl: "", featured: false, order: 0 };
    case "skill-categories":
      return { name: "", order: 0 };
    case "skills":
      return { name: "", categoryId: "", level: 80, iconUrl: "", order: 0 };
    case "education":
      return { institution: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "", description: "", order: 0 };
    case "certifications":
      return { title: "", issuer: "", date: "", url: "", fileUrl: "", order: 0 };
    default:
      return {};
  }
}
