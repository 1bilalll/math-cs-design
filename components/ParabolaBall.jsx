import React, { useRef, useEffect, useState, useCallback } from 'react';

const CANVAS_SIZE = 340;
const NODE_RADIUS = 12;
const MIN_NODE_COUNT = 8;
const MAX_NODE_COUNT = 15;
const BACKGROUND_COLOR = '#F8F9FA';
const NODE_DEFAULT_COLOR = '#CED4DA';
const NODE_TEXT_COLOR = '#343A40';
const EDGE_COLOR = '#E9ECEF';
const PATH_COLOR = '#2193B0';
const ERROR_COLOR = '#DC3545';

export default function HamiltonianPathGame() {
  const canvasRef = useRef(null);

  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [overlay, setOverlay] = useState(null);

  const [playerName, setPlayerName] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);

  const gameRef = useRef({
    nodes: [],
    edges: [],
    currentPath: [],
    totalNodes: 0,
  });

  const levelTime = lvl => Math.max(10, 20 + Math.floor(lvl / 1) * 5);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("hpath-leaderboard") || "[]");
    setLeaderboard(saved);
  }, []);

  const generateGraph = useCallback((lvl) => {
    const nodeCount = Math.min(MAX_NODE_COUNT, MIN_NODE_COUNT + Math.floor((lvl - 1) / 2));
    const nodes = [];
    const edges = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        id: i,
        x: Math.random() * (CANVAS_SIZE - NODE_RADIUS * 4) + NODE_RADIUS * 2,
        y: Math.random() * (CANVAS_SIZE - NODE_RADIUS * 4) + NODE_RADIUS * 2,
        connections: new Set(),
      });
    }

    for (let i = 0; i < nodeCount; i++) {
      const nodeA = nodes[i];

      // 🔥 10. seviyeden sonra zorlaştırma
      const want = lvl >= 10 ? 1 + Math.floor(Math.random() * 2) : 2 + Math.floor(Math.random() * 3);

      let attempts = 0;
      while (nodeA.connections.size < want && attempts < nodeCount * 3) {
        const j = Math.floor(Math.random() * nodeCount);
        const nodeB = nodes[j];
        if (nodeA.id !== nodeB.id && !nodeA.connections.has(nodeB.id)) {
          nodeA.connections.add(nodeB.id);
          nodeB.connections.add(nodeA.id);
          edges.push({ from: nodeA.id, to: nodeB.id });
        }
        attempts++;
      }
    }

    return { nodes, edges };
  }, []);

  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { nodes, edges, currentPath } = gameRef.current;
    const finished = currentPath.length === gameRef.current.totalNodes;

    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    edges.forEach(e => {
      const A = nodes.find(n => n.id === e.from);
      const B = nodes.find(n => n.id === e.to);
      ctx.beginPath();
      ctx.moveTo(A.x, A.y);
      ctx.lineTo(B.x, B.y);
      ctx.strokeStyle = EDGE_COLOR;
      ctx.lineWidth = 1.6;
      ctx.stroke();
    });

    if (currentPath.length > 1) {
      ctx.beginPath();
      const start = nodes.find(n => n.id === currentPath[0]);
      ctx.moveTo(start.x, start.y);
      for (let i = 1; i < currentPath.length; i++) {
        const nd = nodes.find(n => n.id === currentPath[i]);
        ctx.lineTo(nd.x, nd.y);
      }
      ctx.strokeStyle = PATH_COLOR;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    nodes.forEach(node => {
      let fill = NODE_DEFAULT_COLOR;
      let border = NODE_TEXT_COLOR;

      if (currentPath.includes(node.id)) {
        fill = PATH_COLOR;
        border = PATH_COLOR;
        if (!finished && currentPath.indexOf(node.id) !== currentPath.lastIndexOf(node.id)) {
          fill = ERROR_COLOR;
          border = ERROR_COLOR;
        }
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, NODE_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = border;
      ctx.stroke();

      const idx = currentPath.indexOf(node.id);
      if (idx !== -1) {
        ctx.fillStyle = BACKGROUND_COLOR;
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(idx + 1), node.x, node.y + 1);
      }
    });
  }, []);

  useEffect(() => {
    let raf = null;
    const loop = () => {
      drawGraph();
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [drawGraph]);

  const handlePos = useCallback((pos) => {
    if (overlay) return;
    const { nodes, currentPath } = gameRef.current;
    const clicked = nodes.find(n => Math.hypot(n.x - pos.x, n.y - pos.y) < NODE_RADIUS * 2);
    if (!clicked) return;

    if (currentPath.length === 0) {
      gameRef.current.currentPath = [clicked.id];
      setMessage(`1/${gameRef.current.totalNodes} - Devam et`);
      setRunning(true);
      return;
    }

    if (!running) return;

    const lastId = currentPath[currentPath.length - 1];
    const lastNode = nodes.find(n => n.id === lastId);

    if (!lastNode.connections.has(clicked.id) || currentPath.includes(clicked.id)) {
      setRunning(false);
      setMessage('GAME OVER');
      setOverlay('gameover');
      setPlayerName("");
      return;
    }

    gameRef.current.currentPath = [...currentPath, clicked.id];
    setMessage(`${gameRef.current.currentPath.length}/${gameRef.current.totalNodes}`);

    if (gameRef.current.currentPath.length === gameRef.current.totalNodes) {
      setScore(s => s + 100 * gameRef.current.totalNodes * level);
      setRunning(false);

      // ✨ 15. level bitince özel ödül ekranı
      if (level === 15) {
        setOverlay("reward");
        return;
      }
      setOverlay('success');
      setMessage('Tebrikler!');
    }
  }, [running, overlay, level]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = () => canvas.getBoundingClientRect();
    const onClick = e => handlePos({ x: e.clientX - rect().left, y: e.clientY - rect().top });
    canvas.addEventListener('click', onClick);
    return () => canvas.removeEventListener('click', onClick);
  }, [handlePos]);

  const prepareLevel = useCallback((lvl) => {
    const g = generateGraph(lvl);
    gameRef.current.nodes = g.nodes;
    gameRef.current.edges = g.edges;
    gameRef.current.currentPath = [];
    gameRef.current.totalNodes = g.nodes.length;
    setMessage('Başlamak için bir düğüme tıklayın');
    setOverlay(null);
    setRunning(false);
    setTimeLeft(levelTime(lvl));
  }, [generateGraph]);

  useEffect(() => {
    prepareLevel(level);
  }, [level, prepareLevel]);

  useEffect(() => {
    if (!running || overlay) return;
    if (timeLeft <= 0) {
      setRunning(false);
      setMessage('GAME OVER');
      setOverlay('gameover');
      setPlayerName("");
      return;
    }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [running, timeLeft, overlay]);

  const onNextLevel = () => {
    if (level < 15) {
      setLevel(l => l + 1);
      setOverlay(null);
      setTimeout(() => {
        setRunning(true);
        setMessage(`1/${gameRef.current.totalNodes} - Devam et`);
      }, 120);
    }
  };

  const saveScore = () => {
    if (!playerName.trim()) return;
    const newBoard = [...leaderboard, { name: playerName.trim(), score }];
    newBoard.sort((a, b) => b.score - a.score);
    const top2 = newBoard.slice(0, 2);
    localStorage.setItem("hpath-leaderboard", JSON.stringify(top2));
    setLeaderboard(top2);
    setPlayerName("");
  };

  return (
    <div style={{
      // Yeni ana div stilleri: Genişliği esnek yaptık ve max genişlik belirledik
      width: 'auto', 
      maxWidth: '680px', 
      margin: '24px auto',
      textAlign: 'center',
      fontFamily: "Segoe UI, Roboto, Arial, sans-serif",
      color: NODE_TEXT_COLOR,
      position: 'relative',
    }}>
      
      {/* 1. BAŞLIK VE SKOR BİLGİLERİ (Üst Kısım) */}
      
      
      <h3 style={{ margin: '2px 0 0 0', color: PATH_COLOR }}>
        🌙 Ayın Oyunu🔗 Hamilton Yolu🎁 
      </h3>
      
      <div style={{ marginBottom: 8, fontWeight: 600 }}>
        Seviye: {level} / 15 | Skor: {score}
      </div>


      {/* 2. OYUN VE LİDERLİK TABLOSUNU SARAN FLEX CONTAINER */}
      <div style={{
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'flex-start', // İçeriğin üstten hizalanmasını sağlar
          gap: '20px', // Oyun kutusu ve liderlik tablosu arasındaki boşluk
      }}>
          
          {/* A. OYUN KUTUSU (Sol Taraf) */}
          <div style={{ 
              width: CANVAS_SIZE + 'px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center' 
          }}>
              {/* Canvas */}
              <canvas
                ref={canvasRef}
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                style={{
                  display: 'block',
                  borderRadius: 8,
                  background: '#fff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  border: '1px solid #e6e6e6',
                  opacity: 0.85
                }}
              />
              
              {/* Mesaj ve Zamanlayıcı */}
              <div style={{ marginTop: 12, width: '100%' }}>
                <div style={{ minHeight: 20, fontWeight: 700, color: PATH_COLOR }}>{message}</div>
                <div style={{ height: 20 }}>
                  {running && !overlay && <span style={{ fontWeight: 700 }}>⏳ {timeLeft}s</span>}
                </div>
              </div>
          </div> 


          {/* B. LİDERLİK TABLOSU (Sağ Taraf) */}
          {leaderboard.length > 0 && (
            <div style={{ 
                marginTop: 0, 
                width: '180px', // Sabit genişlik verdik
                textAlign: 'left',
                paddingTop: '20px' // Kanvasın üst kenarına hizalamak için boşluk
            }}>
              <h4 style={{ color: PATH_COLOR, marginBottom: 6, textAlign: 'center' }}>🏆 En İyi {leaderboard.length < 6 ? leaderboard.length : 5} Oyuncu</h4> 
              {leaderboard.slice(0, 5).map((p, i) => ( 
                <div key={i} style={{ fontWeight: 600, marginTop: 4, paddingLeft: 10 }}>
                  {i + 1}. {p.name} — {p.score} puan
                </div>
              ))}
            </div>
          )}

      </div>
      {/* 3. OVERLAY'LER (Hala ana div içinde olmalılar) */}
      
      {/* GAME OVER */}
      {overlay === 'gameover' && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.45)', borderRadius: 8
        }}>
          <div style={{
            background: '#fff', padding: 24, borderRadius: 10,
            width: 300, textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.25)'
          }}>
            <h1 style={{ color: ERROR_COLOR, marginBottom: 6 }}>GAME OVER</h1>
            <p style={{ marginTop: 4, marginBottom: 14 }}>Hatalı hamle yaptınız.</p>

            <button
              onClick={() => {
                setScore(0);
                setLevel(1);
                prepareLevel(1);
                setOverlay(null);
                setMessage('Başlamak için bir düğüme tıklayın');
                setRunning(false);
              }}
              style={{
                padding: '10px 20px', background: PATH_COLOR, color: '#fff',
                border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 16
              }}
            >
              TEKRAR BAŞLAT
            </button>

            <div style={{ marginTop: 14 }}>
              <input
                type="text"
                placeholder="Oyuncu adı"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                style={{
                  padding: "8px",
                  width: "80%",
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  marginBottom: 8
                }}
              />
              <button
                onClick={saveScore}
                style={{
                  padding: "8px 16px",
                  background: "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontWeight: 400
                }}
              >
                Skoru Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEVEL SUCCESS */}
      {overlay === 'success' && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.30)', borderRadius: 8
        }}>
          <div style={{
            background: '#fff', padding: 22, borderRadius: 10,
            width: 320, textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.18)'
          }}>
            <h2 style={{ color: PATH_COLOR, marginBottom: 6 }}>Tebrikler!</h2>
            <p style={{ marginTop: 4, marginBottom: 12 }}>Seviyeyi tamamladınız.</p>

            <button
              onClick={onNextLevel}
              style={{
                padding: '10px 18px', background: PATH_COLOR, color: '#fff',
                border: 'none', borderRadius: 8, cursor: 'pointer'
              }}
            >
              Sonraki Seviye
            </button>
          </div>
        </div>
      )}

      {/* 🎁 15. LEVEL ÖDÜL */}
      {overlay === 'reward' && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.35)', borderRadius: 8
        }}>
          <div style={{
            background: '#fff', padding: 26, borderRadius: 10,
            width: 330, textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.25)'
          }}>
            <h1 style={{ color: PATH_COLOR, marginBottom: 14 }}>🏆 Şampiyonsun!</h1>
            <p style={{ fontSize: 16, marginBottom: 16 }}>
              🎉 Tebrikler — <b>Bir aylık Student paket üyeliği</b> kazandınız<br />
              <span style={{ fontSize: 13 }}>(özel ders olmadan)</span>
            </p>

            <button
              onClick={() => {
                setScore(0);
                setLevel(1);
                prepareLevel(1);
                setOverlay(null);
                setRunning(false);
                setMessage("Başlamak için bir düğüme tıklayın");
              }}
              style={{
                padding: '10px 18px', background: PATH_COLOR, color: '#fff',
                border: 'none', borderRadius: 8, cursor: 'pointer'
              }}
            >
              Baştan Oyna
            </button>
          </div>
        </div>
      )}
    </div>
  );
}