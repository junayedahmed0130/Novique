const { useState, useEffect, useRef } = React;

// Starfield Component
function Starfield() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const stars = Array.from({ length: 400 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.2, alpha: 0.3 + Math.random() * 0.7,
      depth: 0.2 + Math.random() * 0.8
    }));

    const onMove = (e) => { mouseRef.current = { x: (e.clientX / w - 0.5) * 2, y: (e.clientY / h - 0.5) * 2 }; };
    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    
    window.addEventListener('mousemove', onMove);
    window.addEventListener('resize', onResize);

    let raf;
    const render = () => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const px = s.x + mouseRef.current.x * 20 * s.depth;
        const py = s.y + mouseRef.current.y * 20 * s.depth;
        ctx.beginPath();
        ctx.arc(((px % w) + w) % w, ((py % h) + h) % h, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(render);
    };
    render();

    return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove', onMove); window.removeEventListener('resize', onResize); };
  }, []);

  return <canvas ref={canvasRef} id="starfield" />;
}

// Custom Cursor Component
function TargetingCursor() {
  const reticleRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      if (reticleRef.current) { reticleRef.current.style.left = e.clientX + 'px'; reticleRef.current.style.top = e.clientY + 'px'; }
      if (dotRef.current) { dotRef.current.style.left = e.clientX + 'px'; dotRef.current.style.top = e.clientY + 'px'; }
    };
    const onOver = (e) => { if (e.target.closest('button, a, .nav-link, .feature-card, .product-card')) reticleRef.current?.classList.add('hover'); };
    const onOut = (e) => { if (e.target.closest('button, a, .nav-link, .feature-card, .product-card')) reticleRef.current?.classList.remove('hover'); };
    
    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    return () => { window.removeEventListener('mousemove', onMove); document.removeEventListener('mouseover', onOver); document.removeEventListener('mouseout', onOut); };
  }, []);

  return (
    <>
      <div className="cursor-reticle" ref={reticleRef} />
      <div className="cursor-dot" ref={dotRef} />
    </>
  );
}

// Header Component
function Header({ currentPage, navigate }) {
  return (
    <header>
      <div className="header-logo" onClick={() => navigate('landing')}>
        NOVIQUE<span>//</span>CORP
      </div>
      <nav className="nav-links">
        <span className="nav-link" onClick={() => navigate('landing')}>HOME</span>
        <span className="nav-link" onClick={() => navigate('market')}>MARKET</span>
        <span className="nav-link" onClick={() => navigate('login')}>LOGIN</span>
      </nav>
      <div className="sys-status">SYSTEM ONLINE</div>
    </header>
  );
}