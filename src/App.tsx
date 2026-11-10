import { FormEvent, type ReactNode, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleUserRound,
  Clock3,
  Cloud,
  Download,
  ExternalLink,
  FileImage,
  FileText,
  Home as HomeIcon,
  Image as ImageIcon,
  Layers3,
  LayoutDashboard,
  ListChecks,
  MessageCircle,
  MoreHorizontal,
  Package,
  PanelLeft,
  Plus,
  Search,
  Settings2,
  ShoppingBag,
  Sparkles,
  Upload,
  UserRound,
  X,
} from "lucide-react";

type Section = "overview" | "deliveries" | "tasks" | "purchases";
type ViewMode = "office" | "client";
type DeliveryStatus = "Aguardando aprovação" | "Em revisão" | "Aprovado";

type Delivery = {
  id: number;
  title: string;
  stage: string;
  room: string;
  updated: string;
  version: string;
  status: DeliveryStatus;
  type: "image" | "document";
  author: string;
  note: string;
};

const navItems: { id: Section; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Visão geral", icon: LayoutDashboard },
  { id: "deliveries", label: "Entregas", icon: Layers3 },
  { id: "tasks", label: "Pendências", icon: ListChecks },
  { id: "purchases", label: "Compras", icon: ShoppingBag },
];

const initialDeliveries: Delivery[] = [
  {
    id: 1,
    title: "Cozinha integrada — imagens finais",
    stage: "Interiores",
    room: "Cozinha",
    updated: "Hoje, 10:42",
    version: "v03",
    status: "Aguardando aprovação",
    type: "image",
    author: "Elissa Toledo",
    note: "Atualização da paginação do backsplash e troca dos pendentes sobre a ilha.",
  },
  {
    id: 2,
    title: "Planta baixa humanizada",
    stage: "Estudo preliminar",
    room: "Geral",
    updated: "Ontem, 16:20",
    version: "v02",
    status: "Aprovado",
    type: "document",
    author: "Elissa Toledo",
    note: "Layout validado com ajustes de circulação e posição do banco da entrada.",
  },
  {
    id: 3,
    title: "Banho social — especificação",
    stage: "Detalhamento",
    room: "Banho social",
    updated: "25 out, 14:05",
    version: "v01",
    status: "Em revisão",
    type: "document",
    author: "Ygor Muller",
    note: "Memorial com revestimentos, metais e pontos de iluminação.",
  },
  {
    id: 4,
    title: "Moodboard sala de estar",
    stage: "Conceito",
    room: "Sala de estar",
    updated: "22 out, 09:18",
    version: "v01",
    status: "Aprovado",
    type: "image",
    author: "Elissa Toledo",
    note: "Referências aprovadas para paleta, sofá e marcenaria principal.",
  },
];

const tasks = [
  { title: "Confirmar modelo da torneira gourmet", room: "Cozinha", owner: "Ana Martins", due: "Hoje", priority: "Alta", status: "Aguardando cliente" },
  { title: "Enviar medida final da bancada", room: "Cozinha", owner: "Ygor Muller", due: "Amanhã", priority: "Média", status: "Em andamento" },
  { title: "Validar paginação do banho social", room: "Banho social", owner: "Rafael Costa", due: "31 out", priority: "Alta", status: "Aguardando cliente" },
  { title: "Cotação dos pendentes da sala", room: "Sala de estar", owner: "Elissa Toledo", due: "02 nov", priority: "Baixa", status: "Em andamento" },
];

const purchases = [
  { item: "Pendente linear preto", room: "Cozinha", supplier: "Lumini Casa", qty: "02 un.", value: "R$ 1.480", status: "Cotação" },
  { item: "Torneira gourmet monocomando", room: "Cozinha", supplier: "Deca", qty: "01 un.", value: "R$ 1.190", status: "Aguardando aprovação" },
  { item: "Porcelanato acetinado 90×90", room: "Banho social", supplier: "Portobello", qty: "12,4 m²", value: "R$ 2.232", status: "Aprovado" },
  { item: "Perfil de LED embutir", room: "Sala de estar", supplier: "BLight", qty: "08 m", value: "R$ 640", status: "Pedido feito" },
];

const activity = [
  { icon: CheckCircle2, title: "Planta baixa aprovada", detail: "Ana Martins aprovou a versão v02", time: "há 2h", tone: "success" },
  { icon: MessageCircle, title: "Novo comentário", detail: "Rafael comentou em Cozinha integrada", time: "há 3h", tone: "accent" },
  { icon: Upload, title: "Nova versão publicada", detail: "Imagens finais · versão v03", time: "hoje", tone: "primary" },
];

function StatusPill({ status }: { status: string }) {
  const className = status.toLowerCase().includes("aprov") || status.toLowerCase().includes("pedido")
    ? "status-pill status-success"
    : status.toLowerCase().includes("aguard") || status.toLowerCase().includes("cotação")
      ? "status-pill status-warning"
      : "status-pill status-neutral";
  return <span className={className}><span className="status-dot" />{status}</span>;
}

function SectionHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="section-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}

function AppShell({ children, activeSection, setActiveSection, viewMode, setViewMode, onNewProject }: { children: ReactNode; activeSection: Section; setActiveSection: (section: Section) => void; viewMode: ViewMode; setViewMode: (mode: ViewMode) => void; onNewProject: () => void }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <div className="brand-mark"><span /><span /></div>
          <div><strong>ARQFLOW</strong><small>studio workspace</small></div>
        </div>
        <div className="workspace-switcher">
          <div className="workspace-avatar">CH</div>
          <div className="workspace-copy"><span>Projeto ativo</span><strong>Casa Horizonte</strong></div>
          <ChevronDown size={16} />
        </div>
        <div className="nav-section-label">Navegação</div>
        <nav className="main-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            return <button key={item.id} className={activeSection === item.id && viewMode === "office" ? "nav-item active" : "nav-item"} onClick={() => { setActiveSection(item.id); setViewMode("office"); }}><Icon size={18} /><span>{item.label}</span>{item.id === "tasks" && <b>4</b>}</button>;
          })}
        </nav>
        <div className="nav-section-label nav-section-spaced">Espaço do cliente</div>
        <button className={viewMode === "client" ? "nav-item active" : "nav-item"} onClick={() => setViewMode("client")}><ExternalLink size={18} /><span>Portal do cliente</span></button>
        <div className="sidebar-spacer" />
        <div className="pilot-note"><Sparkles size={17} /><div><strong>Protótipo em validação</strong><span>Dados demonstrativos</span></div></div>
        <button className="nav-item muted"><Settings2 size={18} /><span>Configurações</span></button>
        <div className="user-row"><div className="user-avatar">ET</div><div><strong>Elissa Toledo</strong><span>Arquiteta · admin</span></div><MoreHorizontal size={16} /></div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu"><PanelLeft size={19} /></button>
          <div className="breadcrumbs"><span>Projetos</span><span>/</span><strong>Casa Horizonte</strong></div>
          <div className="topbar-actions"><div className="sync-state"><Cloud size={15} /> Salvo agora</div><button className="icon-button" aria-label="Notificações"><Bell size={18} /><i /></button><button className="client-preview-button" onClick={() => setViewMode(viewMode === "client" ? "office" : "client")}>{viewMode === "client" ? "Voltar ao escritório" : "Prévia do cliente"}<ArrowUpRight size={15} /></button></div>
        </header>
        <div className="content-wrap">{children}</div>
      </main>
    </div>
  );
}

function Overview({ onNewProject, setSection, setViewMode, feedback }: { onNewProject: () => void; setSection: (section: Section) => void; setViewMode: (mode: ViewMode) => void; feedback: string }) {
  return <>
    <SectionHeading eyebrow="Projeto residencial · Curitiba, PR" title="Casa Horizonte" description="Um panorama único para decisões claras entre escritório, cliente e obra." action={<button className="primary-button" onClick={onNewProject}><Plus size={17} /> Novo projeto</button>} />
    <div className="demo-strip"><Sparkles size={16} /><span>Protótipo navegável</span><em>Os dados desta demonstração são fictícios. Autenticação e persistência entram na próxima fase.</em><button onClick={() => setViewMode("client")}>Ver como cliente <ArrowUpRight size={14} /></button></div>
    <div className="project-meta"><div><span>Status do projeto</span><strong><span className="status-dot solid-success" /> Em andamento</strong></div><div><span>Cliente</span><strong>Ana Martins & Rafael Costa</strong></div><div><span>Próximo marco</span><strong><CalendarDays size={16} /> Aprovação de interiores · 31 out</strong></div><div><span>Equipe</span><strong><span className="avatar-stack"><i>ET</i><i>YM</i><i>+1</i></span></strong></div></div>
    <div className="overview-grid">
      <section className="project-progress-panel">
        <div className="panel-topline"><div><span className="eyebrow">Progresso geral</span><h2>O projeto continua em movimento.</h2></div><span className="progress-number">68%</span></div>
        <div className="progress-track"><span style={{ width: "68%" }} /></div>
        <div className="progress-legend"><span><i className="legend-dot done" />Concluído <b>12</b></span><span><i className="legend-dot active" />Em andamento <b>5</b></span><span><i className="legend-dot pending" />Aguardando <b>3</b></span></div>
        <div className="project-sketch"><div className="sketch-label">CASA HORIZONTE <span>01 / 04</span></div><div className="floorplan"><div className="room room-living"><span>SALA</span></div><div className="room room-kitchen"><span>COZINHA</span></div><div className="room room-bed"><span>SUÍTE</span></div><div className="room room-bath"><span>BANHO</span></div><div className="floor-line one" /><div className="floor-line two" /><div className="floor-line three" /></div></div>
      </section>
      <section className="milestones-panel">
        <div className="panel-header"><div><span className="eyebrow">Próximos marcos</span><h2>O que vem a seguir</h2></div><button className="text-button">Ver cronograma <ArrowUpRight size={15} /></button></div>
        <div className="milestone-list"><div className="milestone current"><span className="milestone-date">31 <small>OUT</small></span><div><strong>Aprovação de interiores</strong><span>Cliente · Cozinha e banho social</span></div><Clock3 size={16} /></div><div className="milestone"><span className="milestone-date">04 <small>NOV</small></span><div><strong>Início das compras</strong><span>Escritório · 8 itens pendentes</span></div><Clock3 size={16} /></div><div className="milestone"><span className="milestone-date">11 <small>NOV</small></span><div><strong>Detalhamento executivo</strong><span>Equipe · Marcenaria e iluminação</span></div><Clock3 size={16} /></div></div>
        <div className="milestone-footer"><div><span className="eyebrow">Saúde do projeto</span><strong><span className="status-dot solid-success" /> Dentro do prazo</strong></div><button className="small-outline-button" onClick={() => setSection("tasks")}>4 pendências <ArrowUpRight size={14} /></button></div>
      </section>
    </div>
    <div className="bottom-grid">
      <section className="activity-panel"><div className="panel-header"><div><span className="eyebrow">Atividade recente</span><h2>Últimas decisões</h2></div><button className="text-button" onClick={() => setSection("deliveries")}>Ver entregas <ArrowUpRight size={15} /></button></div><div className="activity-list">{activity.map((item, index) => { const Icon = item.icon; return <div className="activity-item" key={index}><div className={`activity-icon ${item.tone}`}><Icon size={16} /></div><div><strong>{item.title}</strong><span>{item.detail}</span></div><time>{item.time}</time></div>; })}</div></section>
      <section className="attention-panel"><div className="panel-header"><div><span className="eyebrow">Atenção nesta semana</span><h2>Decisões pendentes</h2></div><AlertCircle size={19} color="#c45a3d" /></div><div className="attention-item"><div><strong>2 aprovações aguardando</strong><span>Cozinha integrada e torneira gourmet</span></div><button onClick={() => { setViewMode("client"); }}><ArrowUpRight size={15} /></button></div><div className="attention-item"><div><strong>R$ 3.990 em compras abertas</strong><span>4 itens ligados a ambientes</span></div><button onClick={() => setSection("purchases")}><ArrowUpRight size={15} /></button></div></section>
    </div>
    {feedback && <div className="feedback-toast"><Check size={16} /> {feedback}</div>}
  </>;
}

function Deliveries({ deliveries, selectedId, setSelectedId, onClientPreview }: { deliveries: Delivery[]; selectedId: number; setSelectedId: (id: number) => void; onClientPreview: () => void }) {
  const selected = deliveries.find(item => item.id === selectedId) ?? deliveries[0];
  return <>
    <SectionHeading eyebrow="Documentos e versões" title="Entregas" description="A versão certa, no lugar certo, com a decisão registrada." action={<><button className="secondary-button"><Upload size={16} /> Nova entrega</button><button className="primary-button" onClick={onClientPreview}><ExternalLink size={16} /> Abrir portal</button></>} />
    <div className="filter-row"><div className="search-field"><Search size={16} /><input placeholder="Buscar entrega, ambiente ou etapa" /></div><button className="filter-button">Todos os status <ChevronDown size={15} /></button><button className="filter-button">Todos os ambientes <ChevronDown size={15} /></button></div>
    <div className="deliveries-layout"><div className="deliveries-list">{deliveries.map(item => <button key={item.id} className={selected.id === item.id ? "delivery-row selected" : "delivery-row"} onClick={() => setSelectedId(item.id)}><div className={`file-icon ${item.type}`} >{item.type === "image" ? <ImageIcon size={20} /> : <FileText size={20} />}</div><div className="delivery-row-copy"><strong>{item.title}</strong><span>{item.stage} · {item.room}</span><small>{item.version} · atualizado {item.updated}</small></div><StatusPill status={item.status} /></button>)}<button className="empty-add-row"><Plus size={17} /> Adicionar entrega</button></div><div className="delivery-detail"><div className="detail-header"><div><span className="eyebrow">Detalhe da entrega</span><h2>{selected.title}</h2><p>{selected.stage} · {selected.room}</p></div><button className="icon-button"><MoreHorizontal size={18} /></button></div><div className="preview-canvas"><div className="preview-toolbar"><span><span className="status-dot solid-success" /> {selected.version} · versão atual</span><span><Download size={14} /> Baixar</span></div>{selected.type === "image" ? <div className="render-preview"><div className="render-window"><div className="render-bar"><i /><i /><i /></div><div className="render-scene"><div className="scene-wall" /><div className="scene-window" /><div className="scene-counter" /><div className="scene-island" /><div className="scene-lamp" /><span>COZINHA · ESTUDO 03</span></div></div></div> : <div className="document-preview"><FileText size={42} /><strong>Planta baixa humanizada — {selected.version}</strong><span>PDF · 4 páginas · 6,2 MB</span></div>}</div><div className="detail-note"><div className="note-avatar">{selected.author.split(" ").map(x => x[0]).join("").slice(0, 2)}</div><div><strong>{selected.author}</strong><p>{selected.note}</p></div></div><div className="versions-block"><div className="panel-header"><div><span className="eyebrow">Histórico</span><h3>Versões publicadas</h3></div><button className="text-button">Ver tudo <ArrowUpRight size={14} /></button></div><div className="version-line"><span className="version-badge current">v03</span><div><strong>Hoje, 10:42</strong><span>Atual · aguardando aprovação do cliente</span></div><StatusPill status="Aguardando aprovação" /></div><div className="version-line muted-line"><span className="version-badge">v02</span><div><strong>28 out, 17:30</strong><span>Ajuste de marcenaria · Elissa Toledo</span></div><span className="version-link">Comparar</span></div></div><div className="comment-box"><MessageCircle size={16} /><input placeholder="Adicionar comentário contextual..." /><button><ArrowUpRight size={16} /></button></div></div></div>
  </>;
}

function Tasks() {
  const [taskFilter, setTaskFilter] = useState("Todas");
  const filtered = taskFilter === "Todas" ? tasks : tasks.filter(task => task.status === taskFilter);
  return <><SectionHeading eyebrow="Controle operacional" title="Pendências" description="Uma lista de decisões claras para manter o projeto avançando." action={<button className="primary-button"><Plus size={17} /> Nova pendência</button>} /><div className="task-summary"><div><span>Total abertas</span><strong>4</strong></div><div><span>Aguardando cliente</span><strong className="accent-number">2</strong></div><div><span>Vencem esta semana</span><strong>3</strong></div><div><span>Responsáveis</span><strong>3</strong></div></div><div className="task-toolbar"><div className="filter-tabs">{["Todas", "Aguardando cliente", "Em andamento"].map(item => <button key={item} className={taskFilter === item ? "active" : ""} onClick={() => setTaskFilter(item)}>{item}</button>)}</div><button className="filter-button">Ordenar por prazo <ChevronDown size={15} /></button></div><div className="task-table"><div className="table-header"><span>Pendência</span><span>Responsável</span><span>Prazo</span><span>Prioridade</span><span>Status</span><span /></div>{filtered.map(task => <div className="table-row" key={task.title}><div className="task-title"><div className="task-check"><Check size={14} /></div><div><strong>{task.title}</strong><span>{task.room}</span></div></div><div className="owner-cell"><div className="mini-avatar">{task.owner.split(" ").map(x => x[0]).join("").slice(0, 2)}</div>{task.owner}</div><div className={task.due === "Hoje" ? "due-cell urgent" : "due-cell"}><CalendarDays size={15} />{task.due}</div><div><span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span></div><div><StatusPill status={task.status} /></div><button className="row-more"><MoreHorizontal size={17} /></button></div>)}</div></>;
}

function Purchases() {
  return <><SectionHeading eyebrow="Materiais e fornecedores" title="Compras" description="Cada item ligado a um ambiente, uma decisão e uma próxima ação." action={<button className="primary-button"><Plus size={17} /> Adicionar item</button>} /><div className="purchase-summary"><div><span>Valor estimado aberto</span><strong>R$ 5.542</strong><small>4 itens no fluxo</small></div><div><span>Em cotação</span><strong>R$ 1.480</strong><small>1 item</small></div><div><span>Aguardando aprovação</span><strong className="accent-number">R$ 1.190</strong><small>1 item</small></div><div><span>Pedido feito</span><strong className="success-number">R$ 640</strong><small>1 item</small></div></div><div className="purchase-toolbar"><div className="search-field"><Search size={16} /><input placeholder="Buscar item ou fornecedor" /></div><button className="filter-button">Todos os ambientes <ChevronDown size={15} /></button><button className="filter-button">Exportar <Download size={15} /></button></div><div className="purchase-table"><div className="table-header"><span>Item</span><span>Fornecedor</span><span>Quantidade</span><span>Valor estimado</span><span>Status</span><span /></div>{purchases.map(purchase => <div className="table-row" key={purchase.item}><div className="purchase-name"><div className="purchase-icon"><Package size={17} /></div><div><strong>{purchase.item}</strong><span>{purchase.room}</span></div></div><div className="supplier-cell">{purchase.supplier}</div><div>{purchase.qty}</div><div className="value-cell">{purchase.value}</div><div><StatusPill status={purchase.status} /></div><button className="row-more"><MoreHorizontal size={17} /></button></div>)}</div></>;
}

function ClientPortal({ deliveries, onApprove, onRequestChange }: { deliveries: Delivery[]; onApprove: () => void; onRequestChange: () => void }) {
  const pending = deliveries.find(item => item.status === "Aguardando aprovação") ?? deliveries[0];
  return <div className="client-portal"><div className="client-portal-top"><div className="client-brand"><div className="brand-mark small"><span /><span /></div><strong>ARQFLOW</strong><span className="portal-label">PORTAL DO CLIENTE</span></div><div className="client-top-right"><span>Casa Horizonte</span><div className="client-avatar">AR</div></div></div><div className="client-intro"><span className="eyebrow">Olá, Ana e Rafael</span><h1>Vamos deixar a casa com a cara de vocês.</h1><p>Acompanhe as decisões do projeto, aprove entregas e mantenha tudo organizado em um só lugar.</p><div className="client-progress"><div><span>Progresso do projeto</span><strong>68%</strong></div><div className="progress-track"><span style={{ width: "68%" }} /></div></div></div><div className="client-main-grid"><section><div className="client-section-head"><div><span className="eyebrow">Aguardando vocês</span><h2>Uma decisão pendente</h2></div><span className="priority high">Ação necessária</span></div><div className="client-approval-card"><div className="approval-visual"><div className="render-window client-render"><div className="render-bar"><i /><i /><i /></div><div className="render-scene"><div className="scene-wall" /><div className="scene-window" /><div className="scene-counter" /><div className="scene-island" /><div className="scene-lamp" /><span>COZINHA · ESTUDO 03</span></div></div></div><div className="approval-copy"><span className="eyebrow">{pending.stage} · {pending.room}</span><h3>{pending.title}</h3><p>{pending.note}</p><div className="approval-meta"><span><FileImage size={15} /> {pending.version} · publicado hoje</span><span><MessageCircle size={15} /> 2 comentários</span></div><div className="approval-actions"><button className="secondary-button" onClick={onRequestChange}><MessageCircle size={16} /> Solicitar alteração</button><button className="primary-button" onClick={onApprove}><Check size={16} /> Aprovar entrega</button></div></div></div></section><aside className="client-side"><div className="client-side-panel"><div className="panel-header"><div><span className="eyebrow">Seu projeto</span><h2>Resumo rápido</h2></div></div><div className="client-stat"><span>Entregas aprovadas</span><strong>12 <small>de 16</small></strong></div><div className="client-stat"><span>Próximo encontro</span><strong>31 out <small>· 16:00</small></strong></div><div className="client-stat"><span>Compras decididas</span><strong>8 <small>itens</small></strong></div></div><div className="client-side-panel comment-highlight"><MessageCircle size={19} /><div><span className="eyebrow">Último comentário</span><p>“A composição ficou linda. Podemos testar uma opção mais quente para a luz?”</p><strong>Rafael · há 3h</strong></div></div></aside></div><div className="client-footer"><span>Uma decisão clara evita três retrabalhos.</span><span>ArqFlow · espaço seguro do seu projeto</span></div></div>;
}

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>("overview");
  const [viewMode, setViewMode] = useState<ViewMode>("office");
  const [deliveries, setDeliveries] = useState(initialDeliveries);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState(1);
  const [showNewProject, setShowNewProject] = useState(false);
  const [feedback, setFeedback] = useState("");

  const showFeedback = (message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(""), 3800);
  };

  const approve = () => {
    setDeliveries(current => current.map(item => item.id === 1 ? { ...item, status: "Aprovado" } : item));
    showFeedback("Entrega aprovada e registrada no histórico.");
  };

  const requestChange = () => showFeedback("Solicitação registrada. O escritório será notificado.");

  const content = useMemo(() => {
    if (viewMode === "client") return <ClientPortal deliveries={deliveries} onApprove={approve} onRequestChange={requestChange} />;
    if (activeSection === "deliveries") return <Deliveries deliveries={deliveries} selectedId={selectedDeliveryId} setSelectedId={setSelectedDeliveryId} onClientPreview={() => setViewMode("client")} />;
    if (activeSection === "tasks") return <Tasks />;
    if (activeSection === "purchases") return <Purchases />;
    return <Overview onNewProject={() => setShowNewProject(true)} setSection={setActiveSection} setViewMode={setViewMode} feedback={feedback} />;
  }, [activeSection, deliveries, feedback, selectedDeliveryId, viewMode]);

  const handleNewProject = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowNewProject(false);
    showFeedback("Projeto criado como rascunho para a demonstração.");
  };

  return <AppShell activeSection={activeSection} setActiveSection={setActiveSection} viewMode={viewMode} setViewMode={setViewMode} onNewProject={() => setShowNewProject(true)}>
    {content}
    {feedback && viewMode === "client" && <div className="feedback-toast"><Check size={16} /> {feedback}</div>}
    {showNewProject && <div className="modal-backdrop" onMouseDown={() => setShowNewProject(false)}><div className="modal" onMouseDown={event => event.stopPropagation()}><div className="modal-header"><div><span className="eyebrow">Novo projeto</span><h2>Começar um novo fluxo</h2></div><button className="icon-button" onClick={() => setShowNewProject(false)}><X size={18} /></button></div><form onSubmit={handleNewProject}><label>Nome do projeto<input required placeholder="Ex.: Apartamento Aurora" /></label><label>Nome do cliente<input required placeholder="Ex.: Marina e Pedro" /></label><div className="form-grid"><label>Tipologia<select defaultValue="Residencial"><option>Residencial</option><option>Interiores</option><option>Comercial</option></select></label><label>Cidade<input defaultValue="Curitiba, PR" /></label></div><div className="modal-note"><Sparkles size={16} /><span>O projeto será criado como rascunho com dados demonstrativos.</span></div><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setShowNewProject(false)}>Cancelar</button><button type="submit" className="primary-button"><Plus size={16} /> Criar projeto</button></div></form></div></div>}
  </AppShell>;
}
