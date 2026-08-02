'use client';
import { useEffect, useState } from 'react';

const CLAVE_DESCARTADO = 'vips-instalar-descartado';

function corriendoInstalada() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

function esIOS() {
  if (typeof navigator === 'undefined') return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export default function InstalarApp() {
  const [promptEvento, setPromptEvento] = useState(null);
  const [mostrarInstruccionesIOS, setMostrarInstruccionesIOS] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (corriendoInstalada() || localStorage.getItem(CLAVE_DESCARTADO)) return;

    if (esIOS()) {
      // Safari en iOS no dispara beforeinstallprompt: solo se puede guiar al usuario.
      setMostrarInstruccionesIOS(true);
      setVisible(true);
      return;
    }

    function onBeforeInstallPrompt(e) {
      e.preventDefault();
      setPromptEvento(e);
      setVisible(true);
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
  }, []);

  function descartar() {
    localStorage.setItem(CLAVE_DESCARTADO, '1');
    setVisible(false);
  }

  async function instalar() {
    if (!promptEvento) return;
    promptEvento.prompt();
    await promptEvento.userChoice;
    setPromptEvento(null);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md bg-ink text-paper rounded-sm shadow-lg p-4 flex items-start gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icon-192.png" alt="Vips" width="40" height="40" className="rounded-md shrink-0" />
      <div className="flex-1 text-sm">
        {mostrarInstruccionesIOS ? (
          <p>
            Instalá Vips en tu iPhone: tocá <strong>Compartir</strong> (el ícono de flecha hacia
            arriba) y luego <strong>&quot;Agregar a pantalla de inicio&quot;</strong>.
          </p>
        ) : (
          <>
            <p className="mb-2">Instalá Vips en tu celular para acceder más rápido.</p>
            <button
              onClick={instalar}
              className="bg-ochre text-ink font-medium px-3 py-1.5 rounded-sm text-xs"
            >
              Instalar
            </button>
          </>
        )}
      </div>
      <button onClick={descartar} aria-label="Cerrar" className="text-paper/60 shrink-0 text-lg leading-none">
        ×
      </button>
    </div>
  );
}
