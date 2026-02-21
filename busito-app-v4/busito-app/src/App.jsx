import { useState, useEffect } from "react";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return isMobile;
}

const USUARIOS = [
  { id: 1, nombre: "Carlos Méndez", rol: "chofer",   email: "chofer@busito.com",   password: "1234", iniciales: "CM" },
  { id: 2, nombre: "María López",   rol: "pasajero", email: "pasajero@busito.com", password: "1234", iniciales: "ML", cedula: "8-234-567" },
  { id: 3, nombre: "Juan Pérez",    rol: "pasajero", email: "juan@busito.com",     password: "1234", iniciales: "JP", cedula: "4-567-890" },
];

const RUTAS = [
  { id:1, nombre:"Ciudad → Playa",         origen:"Ciudad",   destino:"Playa",       distancia:"45 km",  duracion:"1h 20min", precio:15.00, activa:true,  color:"#0ea5e9", salidas:["06:00 AM","08:00 AM","10:00 AM","02:00 PM"] },
  { id:2, nombre:"Centro → Aeropuerto",    origen:"Centro",   destino:"Aeropuerto",  distancia:"30 km",  duracion:"55 min",   precio:22.00, activa:true,  color:"#8b5cf6", salidas:["05:00 AM","07:00 AM","09:00 AM","11:00 AM"] },
  { id:3, nombre:"Mercado → Universidad",  origen:"Mercado",  destino:"Universidad", distancia:"12 km",  duracion:"25 min",   precio:8.00,  activa:true,  color:"#10b981", salidas:["06:30 AM","07:30 AM","12:00 PM","05:00 PM"] },
  { id:4, nombre:"Terminal → Chorrera",    origen:"Terminal", destino:"Chorrera",    distancia:"38 km",  duracion:"1h 05min", precio:18.00, activa:false, color:"#f59e0b", salidas:["07:00 AM","01:00 PM"] },
];

const RESERVAS_INICIALES = [
  { id:1, pasajero:"María López",    cedula:"8-234-567", ruta:"Ciudad → Playa",        fecha:"2026-02-21", hora:"08:00 AM", asiento:"A1", estado:"confirmada", monto:15.00, pagado:true,  usuarioId:2 },
  { id:2, pasajero:"Juan Pérez",     cedula:"4-567-890", ruta:"Centro → Aeropuerto",   fecha:"2026-02-21", hora:"10:30 AM", asiento:"B3", estado:"pendiente",  monto:22.00, pagado:false, usuarioId:3 },
  { id:3, pasajero:"Ana Torres",     cedula:"6-112-334", ruta:"Mercado → Universidad", fecha:"2026-02-21", hora:"07:00 AM", asiento:"A2", estado:"confirmada", monto:8.00,  pagado:true,  usuarioId:null },
  { id:4, pasajero:"Pedro Gómez",    cedula:"2-456-789", ruta:"Ciudad → Playa",        fecha:"2026-02-22", hora:"08:00 AM", asiento:"C1", estado:"cancelada",  monto:15.00, pagado:false, usuarioId:null },
  { id:5, pasajero:"Luisa Fernández",cedula:"9-321-654", ruta:"Terminal → Chorrera",   fecha:"2026-02-22", hora:"06:00 AM", asiento:"A3", estado:"pendiente",  monto:18.00, pagado:false, usuarioId:null },
];

const EC = {
  confirmada:{ label:"Confirmada", bg:"#dcfce7", color:"#166534", dot:"#16a34a" },
  pendiente: { label:"Pendiente",  bg:"#fef3c7", color:"#92400e", dot:"#d97706" },
  cancelada: { label:"Cancelada",  bg:"#fee2e2", color:"#991b1b", dot:"#dc2626" },
};

// ── UTILIDADES ────────────────────────────────────────────────────────────────
const Pill = ({ estado }) => {
  const c = EC[estado];
  return <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700, background:c.bg, color:c.color }}><span style={{ width:5, height:5, borderRadius:"50%", background:c.dot }}/>{c.label}</span>;
};
const Avatar = ({ iniciales, size=34, color="#1e40af" }) => (
  <div style={{ width:size, height:size, borderRadius:"50%", background:color, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:size*0.33, flexShrink:0 }}>{iniciales}</div>
);

function generarPNG(r) {
  const canvas = document.createElement("canvas");
  const W = 600, H = 840;
  canvas.width = W*2; canvas.height = H*2;
  const ctx = canvas.getContext("2d");
  ctx.scale(2,2);
  const eBg  = EC[r.estado].bg;
  const eClr = EC[r.estado].color;
  const eDot = EC[r.estado].dot;
  const eLbl = EC[r.estado].label;

  ctx.fillStyle="#fff"; ctx.beginPath(); ctx.roundRect(0,0,W,H,16); ctx.fill();

  const gr = ctx.createLinearGradient(0,0,W,190);
  gr.addColorStop(0,"#0f172a"); gr.addColorStop(1,"#1e40af");
  ctx.fillStyle=gr;
  ctx.beginPath(); ctx.moveTo(0,16); ctx.quadraticCurveTo(0,0,16,0); ctx.lineTo(W-16,0); ctx.quadraticCurveTo(W,0,W,16); ctx.lineTo(W,190); ctx.lineTo(0,190); ctx.closePath(); ctx.fill();

  ctx.fillStyle="rgba(255,255,255,0.12)"; ctx.beginPath(); ctx.arc(W/2,70,40,0,Math.PI*2); ctx.fill();
  ctx.font="34px serif"; ctx.textAlign="center"; ctx.fillText("🚌",W/2,84);
  ctx.fillStyle="#fff"; ctx.font="bold 22px 'Segoe UI',sans-serif"; ctx.fillText("BusitoGest",W/2,124);
  ctx.fillStyle="rgba(255,255,255,0.55)"; ctx.font="600 10px 'Segoe UI',sans-serif"; ctx.fillText("COMPROBANTE DE RESERVACIÓN",W/2,144);
  ctx.fillStyle="rgba(255,255,255,0.35)"; ctx.font="10px 'Segoe UI',sans-serif"; ctx.fillText(`Nº ${String(r.id).padStart(6,"0")}`,W/2,162);

  ctx.fillStyle="#f8fafc"; ctx.beginPath(); ctx.roundRect(20,202,W-40,500,12); ctx.fill();

  const filas=[["Pasajero",r.pasajero],["Cédula",r.cedula||"—"],["Ruta",r.ruta],["Fecha",r.fecha],["Hora",r.hora||"—"],["Asiento",r.asiento||"—"],["Estado","badge"],["Pago",r.pagado?"Pagado":"Pendiente"]];
  filas.forEach(([k,v],i)=>{
    const y=240+i*54;
    if(i>0){ ctx.strokeStyle="#e5e7eb"; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(40,y-10); ctx.lineTo(W-40,y-10); ctx.stroke(); }
    ctx.fillStyle="#374151"; ctx.font="500 13px 'Segoe UI',sans-serif"; ctx.textAlign="left"; ctx.fillText(k,40,y+8);
    if(k==="Estado"){
      ctx.fillStyle=eBg; ctx.beginPath(); ctx.roundRect(W-160,y-5,120,22,11); ctx.fill();
      ctx.fillStyle=eDot; ctx.beginPath(); ctx.arc(W-148,y+6,4,0,Math.PI*2); ctx.fill();
      ctx.fillStyle=eClr; ctx.font="bold 11px 'Segoe UI',sans-serif"; ctx.textAlign="right"; ctx.fillText(eLbl,W-44,y+9);
    } else if(k==="Pago"){
      ctx.fillStyle=r.pagado?"#10b981":"#f59e0b"; ctx.font="600 13px 'Segoe UI',sans-serif"; ctx.textAlign="right"; ctx.fillText(r.pagado?"✅ Pagado":"⏳ Pendiente",W-40,y+8);
    } else {
      ctx.fillStyle="#0f172a"; ctx.font="600 13px 'Segoe UI',sans-serif"; ctx.textAlign="right"; ctx.fillText(v,W-40,y+8);
    }
  });

  const ty=240+filas.length*54+10;
  ctx.setLineDash([6,4]); ctx.strokeStyle="#d1d5db"; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(40,ty); ctx.lineTo(W-40,ty); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle="#0f172a"; ctx.font="bold 15px 'Segoe UI',sans-serif"; ctx.textAlign="left"; ctx.fillText("TOTAL",40,ty+30);
  ctx.fillStyle="#1e40af"; ctx.font="bold 30px 'Segoe UI',sans-serif"; ctx.textAlign="right"; ctx.fillText(`$${r.monto.toFixed(2)}`,W-40,ty+34);
  ctx.fillStyle="#94a3b8"; ctx.font="11px 'Segoe UI',sans-serif"; ctx.textAlign="center";
  ctx.fillText("Gracias por viajar con BusitoGest",W/2,ty+68);
  ctx.fillText("Conserve este comprobante durante su viaje",W/2,ty+84);

  const link=document.createElement("a");
  link.download=`comprobante-${String(r.id).padStart(6,"0")}-${r.pasajero.replace(/ /g,"-")}.png`;
  link.href=canvas.toDataURL("image/png",1.0); link.click();
}

// ── MODAL COMPROBANTE ─────────────────────────────────────────────────────────
function ModalComprobante({ reserva, onClose, isMobile }) {
  if(!reserva) return null;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.65)", display:"flex", alignItems:isMobile?"flex-end":"center", justifyContent:"center", zIndex:200, padding:isMobile?0:20, backdropFilter:"blur(4px)" }}>
      <div style={{ background:"#fff", borderRadius:isMobile?"20px 20px 0 0":16, width:"100%", maxWidth:isMobile?"100%":400, overflow:"hidden", boxShadow:"0 20px 60px rgba(0,0,0,0.25)" }}>
        <div style={{ background:"linear-gradient(135deg,#0f172a,#1e40af)", padding:"24px 24px 20px", textAlign:"center" }}>
          <div style={{ fontSize:36, marginBottom:8 }}>🚌</div>
          <div style={{ color:"#fff", fontWeight:800, fontSize:18 }}>BusitoGest</div>
          <div style={{ color:"rgba(255,255,255,0.6)", fontSize:11, fontWeight:600, letterSpacing:"0.08em", marginTop:2 }}>COMPROBANTE DE RESERVACIÓN</div>
          <div style={{ color:"rgba(255,255,255,0.4)", fontSize:11, marginTop:4 }}>Nº {String(reserva.id).padStart(6,"0")}</div>
        </div>
        <div style={{ padding:"20px 24px" }}>
          <div style={{ background:"#f8fafc", borderRadius:12, padding:16, marginBottom:18 }}>
            {[["Pasajero",reserva.pasajero],["Cédula",reserva.cedula],["Ruta",reserva.ruta],["Fecha",reserva.fecha],["Hora",reserva.hora],["Asiento",reserva.asiento]].map(([k,v])=>(
              <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #f1f5f9", fontSize:13 }}>
                <span style={{ color:"#374151", fontWeight:500 }}>{k}</span>
                <span style={{ color:"#0f172a", fontWeight:600 }}>{v||"—"}</span>
              </div>
            ))}
            <div style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #f1f5f9", fontSize:13 }}>
              <span style={{ color:"#374151", fontWeight:500 }}>Estado</span><Pill estado={reserva.estado}/>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", paddingTop:14, marginTop:8, borderTop:"2px dashed #e5e7eb" }}>
              <span style={{ fontWeight:800, fontSize:15, color:"#0f172a" }}>TOTAL</span>
              <span style={{ fontWeight:800, fontSize:24, color:"#1e40af" }}>${reserva.monto.toFixed(2)}</span>
            </div>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={onClose} style={{ flex:1, padding:13, borderRadius:10, border:"1.5px solid #e5e7eb", background:"#fff", color:"#64748b", fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Cerrar</button>
            <button onClick={()=>generarPNG(reserva)} style={{ flex:2, padding:13, borderRadius:10, border:"none", background:"linear-gradient(135deg,#0f172a,#1e40af)", color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>⬇ Descargar PNG</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [email,setEmail]=useState(""); const [pw,setPw]=useState(""); const [err,setErr]=useState(""); const [loading,setLoading]=useState(false);
  const isMobile=useIsMobile();
  const inp={ width:"100%", padding:"12px 14px", borderRadius:10, border:"1.5px solid #e5e7eb", background:"#f9fafb", color:"#111827", fontSize:14, outline:"none", fontFamily:"inherit", boxSizing:"border-box" };
  function login(){ if(!email||!pw){setErr("Completa todos los campos.");return;} setLoading(true); setTimeout(()=>{ const u=USUARIOS.find(x=>x.email===email&&x.password===pw); if(u)onLogin(u); else{setErr("Credenciales incorrectas.");setLoading(false);}},600); }
  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans','Segoe UI',sans-serif", background:"linear-gradient(135deg,#0f172a,#1e3a5f)", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:isMobile?16:24 }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      <div style={{ width:"100%", maxWidth:400 }}>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ width:64, height:64, background:"rgba(255,255,255,0.1)", borderRadius:18, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, margin:"0 auto 10px", border:"1px solid rgba(255,255,255,0.15)" }}>🚌</div>
          <div style={{ color:"#fff", fontWeight:800, fontSize:22 }}>BusitoGest</div>
          <div style={{ color:"rgba(255,255,255,0.5)", fontSize:12, marginTop:2 }}>Sistema de Gestión de Transporte</div>
        </div>
        <div style={{ background:"#fff", borderRadius:16, padding:isMobile?22:28, boxShadow:"0 24px 60px rgba(0,0,0,0.3)" }}>
          <div style={{ fontWeight:700, fontSize:17, color:"#0f172a", marginBottom:18 }}>Iniciar Sesión</div>
          <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:5 }}>CORREO</label>
          <input value={email} onChange={e=>{setEmail(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&login()} style={{ ...inp, marginBottom:12 }} placeholder="usuario@busito.com"/>
          <label style={{ fontSize:12, fontWeight:600, color:"#374151", display:"block", marginBottom:5 }}>CONTRASEÑA</label>
          <input type="password" value={pw} onChange={e=>{setPw(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&login()} style={{ ...inp, marginBottom:err?10:18 }} placeholder="••••••••"/>
          {err&&<div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:8, padding:"8px 12px", color:"#dc2626", fontSize:12, marginBottom:14 }}>⚠ {err}</div>}
          <button onClick={login} disabled={loading} style={{ width:"100%", padding:13, borderRadius:10, border:"none", background:loading?"#94a3b8":"linear-gradient(135deg,#0f172a,#1e40af)", color:"#fff", fontWeight:700, fontSize:15, cursor:loading?"wait":"pointer", fontFamily:"inherit" }}>{loading?"Verificando...":"Ingresar"}</button>
          <div style={{ marginTop:18, paddingTop:14, borderTop:"1px solid #f1f5f9" }}>
            <div style={{ fontSize:11, fontWeight:600, color:"#9ca3af", marginBottom:8 }}>ACCESOS DE PRUEBA</div>
            {USUARIOS.map(u=>(
              <div key={u.id} onClick={()=>{setEmail(u.email);setPw("1234");setErr("");}} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:8, cursor:"pointer", marginBottom:6, border:"1px solid #f1f5f9", background:"#f9fafb" }}>
                <Avatar iniciales={u.iniciales} size={30} color={u.rol==="chofer"?"#0f172a":"#0ea5e9"}/>
                <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:600, color:"#111827" }}>{u.nombre}</div><div style={{ fontSize:11, color:"#6b7280" }}>{u.email}</div></div>
                <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:4, background:u.rol==="chofer"?"#0f172a":"#eff6ff", color:u.rol==="chofer"?"#fff":"#1d4ed8" }}>{u.rol.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── VISTA PASAJERO ────────────────────────────────────────────────────────────
function VistaPasajero({ user, reservas, setReservas, onLogout }) {
  const isMobile=useIsMobile();
  const [tab,setTab]=useState("Rutas");
  const [rutaSel,setRutaSel]=useState(null);
  const [form,setForm]=useState({ ruta:"", fecha:"", hora:"", asiento:"" });
  const [showFactura,setShowFactura]=useState(null);
  const [confirmado,setConfirmado]=useState(null);
  const misReservas=reservas.filter(r=>r.usuarioId===user.id);
  const inp={ width:"100%", padding:"11px 14px", borderRadius:10, border:"1.5px solid #e5e7eb", background:"#f9fafb", color:"#111827", fontSize:13, outline:"none", fontFamily:"inherit", boxSizing:"border-box", marginBottom:12 };
  const lbl={ fontSize:11, fontWeight:600, color:"#374151", display:"block", marginBottom:5 };

  function hacerReserva(){
    if(!form.ruta||!form.fecha){alert("Selecciona ruta y fecha.");return;}
    const ri=RUTAS.find(r=>r.nombre===form.ruta);
    const nueva={ id:Date.now(), pasajero:user.nombre, cedula:user.cedula||"—", ruta:form.ruta, fecha:form.fecha, hora:form.hora||"—", asiento:form.asiento||"—", estado:"pendiente", monto:ri?.precio||0, pagado:false, usuarioId:user.id };
    setReservas(p=>[...p,nueva]); setConfirmado(nueva); setForm({ ruta:"", fecha:"", hora:"", asiento:"" }); setTab("MisViajes");
  }

  const TABS=[{key:"Rutas",icon:"🗺️",label:"Rutas"},{key:"Reservar",icon:"🎫",label:"Reservar"},{key:"MisViajes",icon:"📋",label:"Mis Viajes"}];

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans','Segoe UI',sans-serif", background:"#f8fafc", minHeight:"100vh", paddingBottom:isMobile?72:0 }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      {/* Header */}
      <div style={{ background:"#fff", borderBottom:"1px solid #f1f5f9", padding:`0 ${isMobile?16:24}px`, height:58, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:34, height:34, background:"linear-gradient(135deg,#0f172a,#1e40af)", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🚌</div>
          <div><div style={{ fontWeight:800, fontSize:15, color:"#0f172a" }}>BusitoGest</div>{!isMobile&&<div style={{ fontSize:10, color:"#94a3b8", fontWeight:600 }}>PORTAL DEL PASAJERO</div>}</div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          {!isMobile&&TABS.map(t=><button key={t.key} onClick={()=>setTab(t.key)} style={{ padding:"7px 14px", borderRadius:8, border:"none", cursor:"pointer", fontWeight:600, fontSize:13, fontFamily:"inherit", background:tab===t.key?"#f1f5f9":"transparent", color:tab===t.key?"#0f172a":"#64748b" }}>{t.label}</button>)}
          <Avatar iniciales={user.iniciales} size={32} color="#0ea5e9"/>
          <button onClick={onLogout} style={{ background:"none", border:"1px solid #e5e7eb", color:"#64748b", borderRadius:7, padding:"5px 10px", cursor:"pointer", fontWeight:600, fontSize:12, fontFamily:"inherit" }}>Salir</button>
        </div>
      </div>
      {isMobile&&<div style={{ position:"fixed", bottom:0, left:0, right:0, background:"#fff", borderTop:"1px solid #f1f5f9", display:"flex", zIndex:50, boxShadow:"0 -4px 20px rgba(0,0,0,0.08)" }}>
        {TABS.map(t=><button key={t.key} onClick={()=>setTab(t.key)} style={{ flex:1, padding:"10px 0 8px", border:"none", background:"transparent", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2, fontFamily:"inherit" }}><span style={{ fontSize:20 }}>{t.icon}</span><span style={{ fontSize:10, fontWeight:600, color:tab===t.key?"#1e40af":"#94a3b8" }}>{t.label}</span>{tab===t.key&&<div style={{ width:4, height:4, borderRadius:"50%", background:"#1e40af" }}/>}</button>)}
      </div>}

      <div style={{ padding:isMobile?"16px":"24px", maxWidth:800, margin:"0 auto" }}>

        {/* RUTAS */}
        {tab==="Rutas"&&<div>
          <div style={{ fontSize:isMobile?18:22, fontWeight:800, color:"#0f172a", marginBottom:4 }}>Rutas Disponibles</div>
          <div style={{ fontSize:13, color:"#64748b", marginBottom:18 }}>Toca una ruta para ver horarios y reservar</div>
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:14 }}>
            {RUTAS.filter(r=>r.activa).map(r=>(
              <div key={r.id} onClick={()=>setRutaSel(rutaSel?.id===r.id?null:r)} style={{ background:"#fff", borderRadius:14, border:`1.5px solid ${rutaSel?.id===r.id?r.color:"#f1f5f9"}`, overflow:"hidden", cursor:"pointer", boxShadow:rutaSel?.id===r.id?`0 4px 20px ${r.color}25`:"0 1px 4px rgba(0,0,0,0.04)", transition:"all 0.2s" }}>
                <div style={{ height:4, background:r.color }}/>
                <div style={{ padding:18 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                    <div style={{ fontWeight:700, fontSize:15, color:"#0f172a" }}>{r.nombre}</div>
                    <div style={{ fontWeight:800, fontSize:20, color:r.color }}>${r.precio.toFixed(2)}</div>
                  </div>
                  <div style={{ display:"flex", gap:8, marginBottom:10, flexWrap:"wrap" }}>
                    <span style={{ background:"#f1f5f9", padding:"3px 10px", borderRadius:6, fontSize:11, fontWeight:600, color:"#475569" }}>📍 {r.distancia}</span>
                    <span style={{ background:"#f1f5f9", padding:"3px 10px", borderRadius:6, fontSize:11, fontWeight:600, color:"#475569" }}>⏱ {r.duracion}</span>
                  </div>
                  {rutaSel?.id===r.id?(
                    <div style={{ borderTop:"1px solid #f1f5f9", paddingTop:12 }}>
                      <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", marginBottom:8 }}>HORARIOS</div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
                        {r.salidas.map((s,i)=><div key={i} style={{ background:`${r.color}12`, border:`1px solid ${r.color}30`, borderRadius:8, padding:"8px 12px", textAlign:"center" }}><div style={{ fontSize:14, fontWeight:700, color:r.color }}>🕐 {s}</div></div>)}
                      </div>
                      <button onClick={e=>{e.stopPropagation();setForm(f=>({...f,ruta:r.nombre}));setTab("Reservar");}} style={{ width:"100%", padding:"10px", borderRadius:9, border:"none", background:`linear-gradient(135deg,${r.color},${r.color}bb)`, color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Reservar esta ruta →</button>
                    </div>
                  ):<div style={{ fontSize:12, color:r.color, fontWeight:600 }}>Toca para ver horarios →</div>}
                </div>
              </div>
            ))}
          </div>
          {RUTAS.filter(r=>!r.activa).length>0&&<div style={{ marginTop:20 }}>
            <div style={{ fontSize:12, fontWeight:700, color:"#94a3b8", marginBottom:10 }}>NO DISPONIBLES</div>
            {RUTAS.filter(r=>!r.activa).map(r=><div key={r.id} style={{ background:"#fff", borderRadius:10, border:"1px solid #f1f5f9", padding:"13px 18px", marginBottom:8, display:"flex", justifyContent:"space-between", alignItems:"center", opacity:0.6 }}><div style={{ fontWeight:600, fontSize:13, color:"#64748b" }}>{r.nombre}</div><span style={{ background:"#f1f5f9", padding:"3px 10px", borderRadius:6, fontSize:11, fontWeight:600, color:"#94a3b8" }}>No disponible</span></div>)}
          </div>}
        </div>}

        {/* RESERVAR */}
        {tab==="Reservar"&&<div style={{ maxWidth:480 }}>
          <div style={{ fontSize:isMobile?18:20, fontWeight:800, color:"#0f172a", marginBottom:4 }}>Nueva Reservación</div>
          <div style={{ fontSize:13, color:"#64748b", marginBottom:20 }}>Selecciona tu ruta y horario</div>
          <div style={{ background:"#eff6ff", borderRadius:12, padding:"14px 16px", marginBottom:18, border:"1px solid #dbeafe" }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#1d4ed8", marginBottom:6 }}>TUS DATOS</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              <div><div style={{ fontSize:10, color:"#64748b" }}>NOMBRE</div><div style={{ fontSize:13, fontWeight:600, color:"#0f172a" }}>{user.nombre}</div></div>
              <div><div style={{ fontSize:10, color:"#64748b" }}>CÉDULA</div><div style={{ fontSize:13, fontWeight:600, color:"#0f172a" }}>{user.cedula||"—"}</div></div>
            </div>
          </div>
          <div style={{ background:"#fff", borderRadius:14, border:"1px solid #f1f5f9", padding:20 }}>
            <label style={lbl}>RUTA *</label>
            <select style={inp} value={form.ruta} onChange={e=>setForm({...form,ruta:e.target.value})}>
              <option value="">Seleccionar ruta...</option>
              {RUTAS.filter(r=>r.activa).map(r=><option key={r.id} value={r.nombre}>{r.nombre} — ${r.precio}</option>)}
            </select>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div><label style={lbl}>FECHA *</label><input style={{ ...inp, marginBottom:0 }} type="date" value={form.fecha} onChange={e=>setForm({...form,fecha:e.target.value})}/></div>
              <div><label style={lbl}>HORA</label>
                <select style={{ ...inp, marginBottom:0 }} value={form.hora} onChange={e=>setForm({...form,hora:e.target.value})}>
                  <option value="">Seleccionar...</option>
                  {form.ruta&&RUTAS.find(r=>r.nombre===form.ruta)?.salidas.map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={{ height:12 }}/>
            <label style={lbl}>ASIENTO (opcional)</label>
            <input style={inp} value={form.asiento} onChange={e=>setForm({...form,asiento:e.target.value})} placeholder="Ej: A1, B3"/>
            {form.ruta&&<div style={{ background:"#f8fafc", borderRadius:8, padding:"10px 14px", marginBottom:14, fontSize:13 }}>
              <span style={{ color:"#64748b" }}>Total: </span><span style={{ fontWeight:800, color:"#1e40af", fontSize:16 }}>${RUTAS.find(r=>r.nombre===form.ruta)?.precio.toFixed(2)}</span>
            </div>}
            <button onClick={hacerReserva} style={{ width:"100%", padding:13, borderRadius:10, border:"none", background:"linear-gradient(135deg,#0f172a,#1e40af)", color:"#fff", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit" }}>Confirmar Reservación 🎫</button>
          </div>
        </div>}

        {/* MIS VIAJES */}
        {tab==="MisViajes"&&<div>
          <div style={{ fontSize:isMobile?18:20, fontWeight:800, color:"#0f172a", marginBottom:4 }}>Mis Viajes</div>
          <div style={{ fontSize:13, color:"#64748b", marginBottom:18 }}>{misReservas.length} reservación(es)</div>
          {misReservas.length===0?<div style={{ background:"#fff", borderRadius:14, border:"1px solid #f1f5f9", padding:40, textAlign:"center" }}>
            <div style={{ fontSize:40, marginBottom:8 }}>🎫</div>
            <div style={{ fontWeight:600, color:"#374151", marginBottom:4 }}>Sin reservaciones aún</div>
            <button onClick={()=>setTab("Reservar")} style={{ marginTop:12, padding:"10px 20px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#0f172a,#1e40af)", color:"#fff", fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Reservar ahora →</button>
          </div>:<div style={{ display:"grid", gap:12 }}>
            {misReservas.map(r=>(
              <div key={r.id} style={{ background:"#fff", borderRadius:14, border:"1px solid #f1f5f9", borderLeft:`4px solid ${EC[r.estado].dot}`, padding:"16px 18px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                  <div><div style={{ fontWeight:700, fontSize:15, color:"#0f172a" }}>{r.ruta}</div><div style={{ fontSize:11, color:"#94a3b8", marginTop:2 }}>{r.fecha} · {r.hora}</div></div>
                  <Pill estado={r.estado}/>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:14 }}>
                  {[["Asiento",r.asiento],["Cédula",r.cedula],["Total",`$${r.monto.toFixed(2)}`]].map(([k,v])=>(
                    <div key={k} style={{ background:"#f9fafb", borderRadius:8, padding:"8px 10px" }}>
                      <div style={{ fontSize:10, fontWeight:600, color:"#94a3b8" }}>{k}</div>
                      <div style={{ fontSize:13, fontWeight:700, color:k==="Total"?"#1e40af":"#0f172a", marginTop:2 }}>{v}</div>
                    </div>
                  ))}
                </div>
                <button onClick={()=>setShowFactura(r)} style={{ width:"100%", padding:"10px", borderRadius:10, border:"1.5px solid #e5e7eb", background:"#fff", color:"#0f172a", fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>🧾 Ver y Descargar Comprobante</button>
              </div>
            ))}
          </div>}
        </div>}
      </div>

      {confirmado&&<div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.65)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, padding:20, backdropFilter:"blur(4px)" }}>
        <div style={{ background:"#fff", borderRadius:16, padding:28, maxWidth:340, width:"100%", textAlign:"center" }}>
          <div style={{ fontSize:48, marginBottom:10 }}>🎉</div>
          <div style={{ fontWeight:800, fontSize:18, color:"#0f172a", marginBottom:4 }}>¡Reservación Exitosa!</div>
          <div style={{ fontSize:13, color:"#64748b", marginBottom:20 }}>Tu lugar está reservado en {confirmado.ruta}</div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={()=>setConfirmado(null)} style={{ flex:1, padding:12, borderRadius:10, border:"1.5px solid #e5e7eb", background:"#fff", color:"#64748b", fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Cerrar</button>
            <button onClick={()=>{generarPNG(confirmado);setConfirmado(null);}} style={{ flex:2, padding:12, borderRadius:10, border:"none", background:"linear-gradient(135deg,#0f172a,#1e40af)", color:"#fff", fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>⬇ Descargar Comprobante</button>
          </div>
        </div>
      </div>}
      <ModalComprobante reserva={showFactura} onClose={()=>setShowFactura(null)} isMobile={isMobile}/>
    </div>
  );
}

// ── VISTA CHOFER ──────────────────────────────────────────────────────────────
function VistaChofer({ user, reservas, setReservas, onLogout }) {
  const isMobile=useIsMobile();
  const [tab,setTab]=useState("Hoy");
  const [showFactura,setShowFactura]=useState(null);
  const [scanActivo,setScanActivo]=useState(false);
  const [scanResult,setScanResult]=useState(null);
  const [formScan,setFormScan]=useState({ ruta:"", fecha:"", hora:"", asiento:"" });
  const [buscar,setBuscar]=useState("");
  const hoy="2026-02-21";
  const reservasHoy=reservas.filter(r=>r.fecha===hoy);
  const reservasFiltradas=buscar?reservas.filter(r=>r.pasajero.toLowerCase().includes(buscar.toLowerCase())||r.cedula.includes(buscar)):reservas;
  const inp={ width:"100%", padding:"11px 14px", borderRadius:10, border:"1.5px solid #e5e7eb", background:"#f9fafb", color:"#111827", fontSize:13, outline:"none", fontFamily:"inherit", boxSizing:"border-box", marginBottom:12 };
  const lbl={ fontSize:11, fontWeight:600, color:"#374151", display:"block", marginBottom:5 };

  function simularEscaneo(){
    setScanActivo(true);
    setTimeout(()=>{
      const lista=[{nombre:"Roberto Sánchez",cedula:"7-123-456"},{nombre:"Carmen Díaz",cedula:"3-987-654"},{nombre:"Luis Moreno",cedula:"5-456-789"},{nombre:"Diana Castillo",cedula:"1-234-567"}];
      setScanResult(lista[Math.floor(Math.random()*lista.length)]); setScanActivo(false);
    },1500);
  }

  function registrarEscaneado(){
    if(!formScan.ruta||!formScan.fecha){alert("Selecciona ruta y fecha.");return;}
    const ri=RUTAS.find(r=>r.nombre===formScan.ruta);
    const nueva={ id:Date.now(), pasajero:scanResult.nombre, cedula:scanResult.cedula, ruta:formScan.ruta, fecha:formScan.fecha, hora:formScan.hora||"—", asiento:formScan.asiento||"—", estado:"confirmada", monto:ri?.precio||0, pagado:true, usuarioId:null };
    setReservas(p=>[...p,nueva]); setScanResult(null); setFormScan({ ruta:"", fecha:"", hora:"", asiento:"" }); setTab("Hoy");
  }

  function confirmarPago(id){ setReservas(reservas.map(r=>r.id===id?{...r,estado:"confirmada",pagado:true}:r)); }

  const TABS=[{key:"Hoy",icon:"📅"},{key:"Escanear",icon:"📷"},{key:"Todos",icon:"📋"},{key:"Cobros",icon:"💰"}];

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans','Segoe UI',sans-serif", background:"#f8fafc", minHeight:"100vh", paddingBottom:isMobile?72:0 }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      <div style={{ background:"#fff", borderBottom:"1px solid #f1f5f9", padding:`0 ${isMobile?16:24}px`, height:58, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:34, height:34, background:"linear-gradient(135deg,#0f172a,#1e40af)", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🚌</div>
          <div><div style={{ fontWeight:800, fontSize:15, color:"#0f172a" }}>BusitoGest</div>{!isMobile&&<div style={{ fontSize:10, color:"#94a3b8", fontWeight:600 }}>PANEL DEL CHOFER</div>}</div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          {!isMobile&&TABS.map(t=><button key={t.key} onClick={()=>setTab(t.key)} style={{ padding:"7px 14px", borderRadius:8, border:"none", cursor:"pointer", fontWeight:600, fontSize:13, fontFamily:"inherit", background:tab===t.key?"#f1f5f9":"transparent", color:tab===t.key?"#0f172a":"#64748b" }}>{t.key}</button>)}
          {reservas.filter(r=>r.estado==="pendiente").length>0&&<div style={{ background:"#fef3c7", color:"#92400e", borderRadius:20, padding:"3px 8px", fontSize:11, fontWeight:700 }}>{reservas.filter(r=>r.estado==="pendiente").length}</div>}
          <Avatar iniciales={user.iniciales} size={32} color="#0f172a"/>
          <button onClick={onLogout} style={{ background:"none", border:"1px solid #e5e7eb", color:"#64748b", borderRadius:7, padding:"5px 10px", cursor:"pointer", fontWeight:600, fontSize:12, fontFamily:"inherit" }}>Salir</button>
        </div>
      </div>
      {isMobile&&<div style={{ position:"fixed", bottom:0, left:0, right:0, background:"#fff", borderTop:"1px solid #f1f5f9", display:"flex", zIndex:50, boxShadow:"0 -4px 20px rgba(0,0,0,0.08)" }}>
        {TABS.map(t=><button key={t.key} onClick={()=>setTab(t.key)} style={{ flex:1, padding:"10px 0 8px", border:"none", background:"transparent", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2, fontFamily:"inherit" }}><span style={{ fontSize:20 }}>{t.icon}</span><span style={{ fontSize:10, fontWeight:600, color:tab===t.key?"#1e40af":"#94a3b8" }}>{t.key}</span>{tab===t.key&&<div style={{ width:4, height:4, borderRadius:"50%", background:"#1e40af" }}/>}</button>)}
      </div>}

      <div style={{ padding:isMobile?"16px":"24px", maxWidth:1000, margin:"0 auto" }}>

        {/* HOY */}
        {tab==="Hoy"&&<div>
          <div style={{ fontSize:isMobile?18:20, fontWeight:800, color:"#0f172a", marginBottom:4 }}>Pasajeros de Hoy</div>
          <div style={{ fontSize:13, color:"#64748b", marginBottom:18 }}>{reservasHoy.length} pasajero(s) registrado(s)</div>
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr 1fr":"repeat(3,1fr)", gap:10, marginBottom:18 }}>
            {[{l:"Total",v:reservasHoy.length,c:"#3b82f6",i:"👥"},{l:"Confirmados",v:reservasHoy.filter(r=>r.estado==="confirmada").length,c:"#10b981",i:"✅"},{l:"Pendientes",v:reservasHoy.filter(r=>r.estado==="pendiente").length,c:"#f59e0b",i:"⏳"}].map(k=>(
              <div key={k.l} style={{ background:"#fff", borderRadius:12, padding:isMobile?"12px":"16px", border:"1px solid #f1f5f9", textAlign:"center" }}>
                <div style={{ fontSize:20, marginBottom:4 }}>{k.i}</div>
                <div style={{ fontSize:isMobile?22:26, fontWeight:800, color:k.c }}>{k.v}</div>
                <div style={{ fontSize:11, color:"#94a3b8", fontWeight:600 }}>{k.l}</div>
              </div>
            ))}
          </div>
          <div style={{ background:"#fff", borderRadius:14, border:"1px solid #f1f5f9", overflow:"hidden" }}>
            <div style={{ padding:"14px 18px", borderBottom:"1px solid #f8fafc", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontWeight:700, fontSize:14, color:"#0f172a" }}>Lista del Día</div>
              <button onClick={()=>setTab("Escanear")} style={{ padding:"7px 14px", borderRadius:8, border:"none", background:"linear-gradient(135deg,#0f172a,#1e40af)", color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>📷 + Agregar</button>
            </div>
            {reservasHoy.length===0?<div style={{ padding:32, textAlign:"center", color:"#94a3b8" }}>No hay pasajeros para hoy</div>:
            reservasHoy.map((r,i)=>(
              <div key={r.id} style={{ padding:"12px 18px", borderBottom:i<reservasHoy.length-1?"1px solid #f8fafc":"none", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:r.pagado?"#f0fdf4":"#fffbeb", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>{r.pagado?"✅":"⏳"}</div>
                  <div><div style={{ fontWeight:600, fontSize:13, color:"#0f172a" }}>{r.pasajero}</div><div style={{ fontSize:11, color:"#94a3b8" }}>{r.cedula} · {r.ruta} · {r.hora}</div></div>
                </div>
                <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                  <span style={{ fontWeight:700, fontSize:14, color:"#0f172a" }}>${r.monto.toFixed(2)}</span>
                  {r.estado==="pendiente"&&<button onClick={()=>confirmarPago(r.id)} style={{ padding:"5px 10px", borderRadius:6, border:"none", background:"#dcfce7", color:"#166534", fontWeight:700, fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>✓ Cobrar</button>}
                  <button onClick={()=>setShowFactura(r)} style={{ padding:"5px 10px", borderRadius:6, border:"none", background:"#eff6ff", color:"#1d4ed8", fontWeight:700, fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>🧾</button>
                </div>
              </div>
            ))}
          </div>
        </div>}

        {/* ESCANEAR */}
        {tab==="Escanear"&&<div style={{ maxWidth:500 }}>
          <div style={{ fontSize:isMobile?18:20, fontWeight:800, color:"#0f172a", marginBottom:4 }}>Registrar Pasajero</div>
          <div style={{ fontSize:13, color:"#64748b", marginBottom:20 }}>Escanea cédula o QR para registrar rápido</div>
          {!scanResult?<div>
            <div style={{ background:"#fff", borderRadius:14, border:"2px dashed #d1d5db", padding:"36px 24px", textAlign:"center", marginBottom:14 }}>
              {scanActivo?<div>
                <div style={{ fontSize:48, marginBottom:10 }}>📡</div>
                <div style={{ fontWeight:700, color:"#0f172a", marginBottom:4 }}>Escaneando...</div>
                <div style={{ fontSize:12, color:"#64748b", marginBottom:16 }}>Acerca la cédula a la cámara</div>
                <div style={{ height:4, background:"#f1f5f9", borderRadius:20, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:"70%", background:"linear-gradient(90deg,#0f172a,#1e40af)", borderRadius:20 }}/>
                </div>
              </div>:<div>
                <div style={{ fontSize:60, marginBottom:12 }}>📷</div>
                <div style={{ fontWeight:700, fontSize:16, color:"#0f172a", marginBottom:6 }}>Escanear Cédula o QR</div>
                <div style={{ fontSize:13, color:"#64748b", marginBottom:20 }}>Abre la cámara y escanea la cédula del pasajero en menos de 2 segundos</div>
                <button onClick={simularEscaneo} style={{ padding:"13px 28px", borderRadius:12, border:"none", background:"linear-gradient(135deg,#0f172a,#1e40af)", color:"#fff", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit" }}>📷 Activar Cámara</button>
              </div>}
            </div>
            <div style={{ textAlign:"center", fontSize:11, color:"#94a3b8" }}>Compatible con cédulas panameñas y códigos QR</div>
          </div>:<div>
            <div style={{ background:"#f0fdf4", border:"2px solid #86efac", borderRadius:14, padding:"16px 20px", marginBottom:18 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:48, height:48, borderRadius:12, background:"#dcfce7", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>✅</div>
                <div>
                  <div style={{ fontWeight:800, fontSize:16, color:"#0f172a" }}>{scanResult.nombre}</div>
                  <div style={{ fontSize:13, color:"#166534", fontWeight:600 }}>Cédula: {scanResult.cedula}</div>
                  <div style={{ fontSize:11, color:"#64748b", marginTop:2 }}>✓ Identificado correctamente</div>
                </div>
              </div>
            </div>
            <div style={{ background:"#fff", borderRadius:14, border:"1px solid #f1f5f9", padding:20 }}>
              <div style={{ fontWeight:700, fontSize:14, color:"#0f172a", marginBottom:14 }}>Completar Datos del Viaje</div>
              <label style={lbl}>RUTA *</label>
              <select style={inp} value={formScan.ruta} onChange={e=>setFormScan({...formScan,ruta:e.target.value})}>
                <option value="">Seleccionar...</option>
                {RUTAS.filter(r=>r.activa).map(r=><option key={r.id} value={r.nombre}>{r.nombre} — ${r.precio}</option>)}
              </select>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div><label style={lbl}>FECHA *</label><input style={{ ...inp, marginBottom:0 }} type="date" value={formScan.fecha} onChange={e=>setFormScan({...formScan,fecha:e.target.value})}/></div>
                <div><label style={lbl}>HORA</label>
                  <select style={{ ...inp, marginBottom:0 }} value={formScan.hora} onChange={e=>setFormScan({...formScan,hora:e.target.value})}>
                    <option value="">Seleccionar...</option>
                    {formScan.ruta&&RUTAS.find(r=>r.nombre===formScan.ruta)?.salidas.map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ height:12 }}/>
              <label style={lbl}>ASIENTO</label>
              <input style={inp} value={formScan.asiento} onChange={e=>setFormScan({...formScan,asiento:e.target.value})} placeholder="Ej: A1"/>
              <div style={{ display:"flex", gap:10 }}>
                <button onClick={()=>{setScanResult(null);setFormScan({ ruta:"", fecha:"", hora:"", asiento:"" });}} style={{ flex:1, padding:12, borderRadius:10, border:"1.5px solid #e5e7eb", background:"#fff", color:"#64748b", fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>← Escanear otro</button>
                <button onClick={registrarEscaneado} style={{ flex:2, padding:12, borderRadius:10, border:"none", background:"linear-gradient(135deg,#0f172a,#1e40af)", color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>✓ Registrar y Confirmar</button>
              </div>
            </div>
          </div>}
        </div>}

        {/* TODOS */}
        {tab==="Todos"&&<div>
          <div style={{ fontSize:isMobile?18:20, fontWeight:800, color:"#0f172a", marginBottom:14 }}>Todos los Pasajeros</div>
          <div style={{ position:"relative", marginBottom:14 }}>
            <span style={{ position:"absolute", left:12, top:11, fontSize:14 }}>🔍</span>
            <input value={buscar} onChange={e=>setBuscar(e.target.value)} placeholder="Buscar por nombre o cédula..." style={{ width:"100%", padding:"10px 14px 10px 36px", borderRadius:10, border:"1.5px solid #e5e7eb", background:"#fff", fontSize:13, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}/>
          </div>
          {!isMobile?<div style={{ background:"#fff", borderRadius:14, border:"1px solid #f1f5f9", overflow:"hidden" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr style={{ background:"#f8fafc" }}>{["Pasajero","Ruta","Fecha","Estado","Monto",""].map(h=><th key={h} style={{ padding:"11px 16px", textAlign:"left", fontSize:11, fontWeight:700, color:"#94a3b8", letterSpacing:"0.06em", borderBottom:"1px solid #f1f5f9" }}>{h}</th>)}</tr></thead>
              <tbody>{reservasFiltradas.map((r,i)=>(
                <tr key={r.id} style={{ borderBottom:i<reservasFiltradas.length-1?"1px solid #f8fafc":"none" }}>
                  <td style={{ padding:"12px 16px" }}><div style={{ fontWeight:600, fontSize:13, color:"#0f172a" }}>{r.pasajero}</div><div style={{ fontSize:11, color:"#94a3b8" }}>{r.cedula}</div></td>
                  <td style={{ padding:"12px 16px", fontSize:13, color:"#475569" }}>{r.ruta}</td>
                  <td style={{ padding:"12px 16px", fontSize:13, color:"#475569" }}>{r.fecha}</td>
                  <td style={{ padding:"12px 16px" }}><Pill estado={r.estado}/></td>
                  <td style={{ padding:"12px 16px", fontWeight:700, color:r.pagado?"#10b981":"#0f172a" }}>${r.monto.toFixed(2)}</td>
                  <td style={{ padding:"12px 16px" }}><div style={{ display:"flex", gap:5 }}>
                    {r.estado==="pendiente"&&<button onClick={()=>confirmarPago(r.id)} style={{ padding:"5px 9px", borderRadius:6, border:"none", background:"#dcfce7", color:"#166534", fontWeight:700, fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>✓</button>}
                    <button onClick={()=>setShowFactura(r)} style={{ padding:"5px 9px", borderRadius:6, border:"none", background:"#eff6ff", color:"#1d4ed8", fontWeight:700, fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>🧾</button>
                  </div></td>
                </tr>
              ))}</tbody>
            </table>
          </div>:<div style={{ display:"grid", gap:10 }}>
            {reservasFiltradas.map(r=>(
              <div key={r.id} style={{ background:"#fff", borderRadius:12, border:"1px solid #f1f5f9", borderLeft:`4px solid ${EC[r.estado].dot}`, padding:"13px 16px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}><div><div style={{ fontWeight:600, fontSize:13, color:"#0f172a" }}>{r.pasajero}</div><div style={{ fontSize:11, color:"#94a3b8" }}>{r.cedula}</div></div><Pill estado={r.estado}/></div>
                <div style={{ fontSize:12, color:"#64748b", marginBottom:10 }}>{r.ruta} · {r.fecha} · {r.hora}</div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontWeight:700, fontSize:16, color:r.pagado?"#10b981":"#0f172a" }}>${r.monto.toFixed(2)}</span>
                  <div style={{ display:"flex", gap:6 }}>
                    {r.estado==="pendiente"&&<button onClick={()=>confirmarPago(r.id)} style={{ padding:"6px 12px", borderRadius:7, border:"none", background:"#dcfce7", color:"#166534", fontWeight:700, fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>✓ Cobrar</button>}
                    <button onClick={()=>setShowFactura(r)} style={{ padding:"6px 10px", borderRadius:7, border:"none", background:"#eff6ff", color:"#1d4ed8", fontWeight:700, fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>🧾</button>
                  </div>
                </div>
              </div>
            ))}
          </div>}
        </div>}

        {/* COBROS */}
        {tab==="Cobros"&&<div>
          <div style={{ fontSize:isMobile?18:20, fontWeight:800, color:"#0f172a", marginBottom:18 }}>Resumen de Cobros</div>
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(3,1fr)", gap:12, marginBottom:18 }}>
            {[
              { l:"Total Cobrado", v:`$${reservas.filter(r=>r.pagado).reduce((a,b)=>a+b.monto,0).toFixed(2)}`, c:"#10b981", i:"💵" },
              { l:"Por Cobrar",    v:`$${reservas.filter(r=>!r.pagado&&r.estado==="pendiente").reduce((a,b)=>a+b.monto,0).toFixed(2)}`, c:"#f59e0b", i:"⏳" },
              { l:"Pasajeros",     v:reservas.length, c:"#3b82f6", i:"👥" },
            ].map(k=><div key={k.l} style={{ background:"#fff", borderRadius:14, padding:18, border:"1px solid #f1f5f9", borderTop:`3px solid ${k.c}` }}><div style={{ fontSize:22, marginBottom:8 }}>{k.i}</div><div style={{ fontSize:26, fontWeight:800, color:k.c }}>{k.v}</div><div style={{ fontSize:12, color:"#94a3b8", fontWeight:600 }}>{k.l}</div></div>)}
          </div>
          {reservas.filter(r=>r.estado==="pendiente").length>0&&<div style={{ background:"#fff", borderRadius:14, border:"1px solid #f1f5f9", overflow:"hidden" }}>
            <div style={{ padding:"14px 18px", borderBottom:"1px solid #f8fafc", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontWeight:700, fontSize:14, color:"#0f172a" }}>Pendientes de Cobro</div>
              <button onClick={()=>setReservas(reservas.map(r=>r.estado==="pendiente"?{...r,estado:"confirmada",pagado:true}:r))} style={{ padding:"7px 14px", borderRadius:8, border:"none", background:"#0f172a", color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>✓ Cobrar Todos</button>
            </div>
            {reservas.filter(r=>r.estado==="pendiente").map((r,i,arr)=>(
              <div key={r.id} style={{ padding:"12px 18px", borderBottom:i<arr.length-1?"1px solid #f8fafc":"none", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div><div style={{ fontWeight:600, fontSize:13, color:"#0f172a" }}>{r.pasajero}</div><div style={{ fontSize:11, color:"#94a3b8" }}>{r.ruta} · {r.fecha}</div></div>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <span style={{ fontWeight:700, fontSize:14 }}>${r.monto.toFixed(2)}</span>
                  <button onClick={()=>confirmarPago(r.id)} style={{ padding:"6px 12px", borderRadius:7, border:"none", background:"#dcfce7", color:"#166534", fontWeight:700, fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>✓ Cobrar</button>
                </div>
              </div>
            ))}
          </div>}
        </div>}
      </div>
      <ModalComprobante reserva={showFactura} onClose={()=>setShowFactura(null)} isMobile={isMobile}/>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [user,setUser]=useState(null);
  const [reservas,setReservas]=useState(RESERVAS_INICIALES);
  if(!user) return <Login onLogin={setUser}/>;
  if(user.rol==="pasajero") return <VistaPasajero user={user} reservas={reservas} setReservas={setReservas} onLogout={()=>setUser(null)}/>;
  if(user.rol==="chofer")   return <VistaChofer user={user} reservas={reservas} setReservas={setReservas} onLogout={()=>setUser(null)}/>;
}
