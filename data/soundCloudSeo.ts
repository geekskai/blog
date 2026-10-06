export const SOUNDCLOUD_SEO_UPDATED = "2026-09-13"

export type SoundCloudEvidencePage = "wav" | "mp3" | "playlist"

type SoundCloudPageCopy = {
  metadataTitle: string
  metadataDescription: string
  pageTitle: string
  heroDescription: string
  badgeLabel: string
  formTitle: string
  relatedToolText: string
  relatedToolLabel: string
  directAnswer: string
  facts: readonly string[]
  steps: readonly string[]
  limits: readonly string[]
}

type SoundCloudSectionCopy = {
  verified: string
  directAnswer: string
  facts: string
  steps: string
  limits: string
  rights: string
  rightsCopy: string
}

export const soundCloudSectionCopy: Record<string, SoundCloudSectionCopy> = {
  en: {
    verified: "Current implementation reviewed on August 30, 2026",
    directAnswer: "Direct answer",
    facts: "What the current downloader actually does",
    steps: "How the browser download works",
    limits: "Known limits and failure cases",
    rights: "Use content you are allowed to download",
    rightsCopy:
      "This tool does not grant a license or bypass access controls. Download only audio you own, content the creator has made downloadable, or material you otherwise have permission to use.",
  },
  fr: {
    verified: "Implémentation actuelle examinée le 30 août 2026",
    directAnswer: "Réponse directe",
    facts: "Ce que le téléchargeur fait réellement",
    steps: "Fonctionnement du téléchargement dans le navigateur",
    limits: "Limites et cas d'échec connus",
    rights: "Téléchargez uniquement les contenus autorisés",
    rightsCopy:
      "Cet outil n'accorde aucune licence et ne contourne aucun contrôle d'accès. Téléchargez seulement vos propres fichiers, les contenus rendus téléchargeables par leur auteur ou ceux pour lesquels vous avez une autorisation.",
  },
  es: {
    verified: "Implementación actual revisada el 30 de agosto de 2026",
    directAnswer: "Respuesta directa",
    facts: "Qué hace realmente el descargador",
    steps: "Cómo funciona la descarga en el navegador",
    limits: "Límites y fallos conocidos",
    rights: "Descarga solo contenido autorizado",
    rightsCopy:
      "Esta herramienta no concede licencias ni evita controles de acceso. Descarga únicamente audio propio, contenido que el creador permita descargar o material para el que tengas autorización.",
  },
  de: {
    verified: "Aktuelle Implementierung am 30. August 2026 geprüft",
    directAnswer: "Direkte Antwort",
    facts: "Was der Downloader tatsächlich macht",
    steps: "So funktioniert der Browser-Download",
    limits: "Bekannte Grenzen und Fehlerfälle",
    rights: "Nur erlaubte Inhalte herunterladen",
    rightsCopy:
      "Dieses Tool erteilt keine Lizenz und umgeht keine Zugriffskontrollen. Lade nur eigene Audiodateien, vom Urheber zum Download freigegebene Inhalte oder Material mit entsprechender Erlaubnis herunter.",
  },
}

const copyByLocale: Record<string, Record<SoundCloudEvidencePage, SoundCloudPageCopy>> = {
  en: {
    wav: {
      metadataTitle: "SoundCloud to WAV Downloader",
      metadataDescription:
        "Prepare a WAV file from an accessible SoundCloud track. Conversion does not restore audio detail lost in the source.",
      pageTitle: "SoundCloud to WAV Downloader",
      heroDescription:
        "Prepare a WAV file from an accessible SoundCloud track. Conversion does not restore audio detail lost in the source.",
      badgeLabel: "Prepare a download",
      formTitle: "Prepare a download",
      relatedToolText: "Need a different SoundCloud download flow?",
      relatedToolLabel: "Open SoundCloud Downloader",
      directAnswer:
        "The server converts the available MP3 or AAC/M4A source into a real PCM WAV file. This produces a larger file without restoring lost source detail.",
      facts: [
        "Choose MP3, M4A or WAV; conversion does not improve source quality.",
        "Files are prepared on the download server and delivered directly to your browser.",
        "Progress describes server preparation; 100% does not mean the file is saved on your device.",
      ],
      steps: [
        "Paste a public SoundCloud URL and load its information.",
        "Choose a format and start preparation.",
        "When ready, your browser starts the file download. Check its download manager for completion.",
      ],
      limits: [
        "Private, restricted, removed or unsupported tracks cannot be downloaded.",
        "Preparation can queue or fail; links expire and browsers may require permission for multiple downloads.",
        "Each launched track uses one allowance. When the allowance runs out, the batch stops.",
      ],
    },
    mp3: {
      metadataTitle: "SoundCloud to MP3 Downloader",
      metadataDescription:
        "Prepare an MP3 file from an accessible SoundCloud track, then download directly from the download server.",
      pageTitle: "SoundCloud to MP3 Downloader",
      heroDescription:
        "Prepare an MP3 file from an accessible SoundCloud track, then download directly from the download server.",
      badgeLabel: "Prepare a download",
      formTitle: "Prepare a download",
      relatedToolText: "Need a different SoundCloud download flow?",
      relatedToolLabel: "Open SoundCloud Downloader",
      directAnswer:
        "The service uses an available MP3 source or converts AAC/M4A to MP3 when needed. Conversion does not improve the source quality.",
      facts: [
        "Choose MP3, M4A or WAV; conversion does not improve source quality.",
        "Files are prepared on the download server and delivered directly to your browser.",
        "Progress describes server preparation; 100% does not mean the file is saved on your device.",
      ],
      steps: [
        "Paste a public SoundCloud URL and load its information.",
        "Choose a format and start preparation.",
        "When ready, your browser starts the file download. Check its download manager for completion.",
      ],
      limits: [
        "Private, restricted, removed or unsupported tracks cannot be downloaded.",
        "Preparation can queue or fail; links expire and browsers may require permission for multiple downloads.",
        "Each launched track uses one allowance. When the allowance runs out, the batch stops.",
      ],
    },
    playlist: {
      metadataTitle: "SoundCloud Playlist Downloader",
      metadataDescription:
        "Prepare accessible playlist tracks individually in your selected MP3, M4A or WAV format.",
      pageTitle: "SoundCloud Playlist Downloader",
      heroDescription:
        "Prepare accessible playlist tracks individually in your selected MP3, M4A or WAV format.",
      badgeLabel: "Prepare a download",
      formTitle: "Prepare a download",
      relatedToolText: "Need a different SoundCloud download flow?",
      relatedToolLabel: "Open SoundCloud Downloader",
      directAnswer:
        "Each track is prepared separately and uses one download allowance when its download link is launched. The browser downloads files directly from the download server.",
      facts: [
        "Choose MP3, M4A or WAV; conversion does not improve source quality.",
        "Files are prepared on the download server and delivered directly to your browser.",
        "Progress describes server preparation; 100% does not mean the file is saved on your device.",
      ],
      steps: [
        "Paste a public SoundCloud URL and load its information.",
        "Choose a format and start preparation.",
        "When ready, your browser starts the file download. Check its download manager for completion.",
      ],
      limits: [
        "Private, restricted, removed or unsupported tracks cannot be downloaded.",
        "Preparation can queue or fail; links expire and browsers may require permission for multiple downloads.",
        "Each launched track uses one allowance. When the allowance runs out, the batch stops.",
      ],
    },
  },
  fr: {
    wav: {
      metadataTitle: "Téléchargeur SoundCloud vers WAV",
      metadataDescription:
        "Préparez un fichier WAV depuis une piste accessible. La conversion ne restaure pas les détails perdus.",
      pageTitle: "Téléchargeur SoundCloud vers WAV",
      heroDescription:
        "Préparez un fichier WAV depuis une piste accessible. La conversion ne restaure pas les détails perdus.",
      badgeLabel: "Préparer un téléchargement",
      formTitle: "Préparer un téléchargement",
      relatedToolText: "Besoin d'un autre parcours de téléchargement SoundCloud ?",
      relatedToolLabel: "Ouvrir le téléchargeur SoundCloud",
      directAnswer:
        "Le serveur convertit la source MP3 ou AAC/M4A disponible en véritable WAV PCM. Le fichier est plus volumineux, sans restaurer les détails perdus.",
      facts: [
        "Choisissez MP3, M4A ou WAV ; la conversion n’améliore pas la qualité.",
        "Le serveur prépare les fichiers et les livre directement au navigateur.",
        "100 % indique la fin de la préparation, pas l’enregistrement sur votre appareil.",
      ],
      steps: [
        "Collez une URL SoundCloud publique et chargez ses informations.",
        "Choisissez un format et lancez la préparation.",
        "Le navigateur lance le téléchargement une fois prêt ; vérifiez son gestionnaire de téléchargements.",
      ],
      limits: [
        "Les pistes privées, restreintes, supprimées ou non prises en charge sont indisponibles.",
        "La préparation peut attendre ou échouer ; les liens expirent et les téléchargements multiples peuvent demander une autorisation.",
        "Chaque piste lancée consomme une autorisation. Le lot s’arrête lorsque le quota est épuisé.",
      ],
    },
    mp3: {
      metadataTitle: "Téléchargeur SoundCloud vers MP3",
      metadataDescription: "Préparez un MP3 puis téléchargez-le directement depuis le serveur.",
      pageTitle: "Téléchargeur SoundCloud vers MP3",
      heroDescription: "Préparez un MP3 puis téléchargez-le directement depuis le serveur.",
      badgeLabel: "Préparer un téléchargement",
      formTitle: "Préparer un téléchargement",
      relatedToolText: "Besoin d'un autre parcours de téléchargement SoundCloud ?",
      relatedToolLabel: "Ouvrir le téléchargeur SoundCloud",
      directAnswer:
        "Le service utilise le MP3 disponible ou convertit AAC/M4A en MP3 si nécessaire. La conversion n’améliore pas la qualité source.",
      facts: [
        "Choisissez MP3, M4A ou WAV ; la conversion n’améliore pas la qualité.",
        "Le serveur prépare les fichiers et les livre directement au navigateur.",
        "100 % indique la fin de la préparation, pas l’enregistrement sur votre appareil.",
      ],
      steps: [
        "Collez une URL SoundCloud publique et chargez ses informations.",
        "Choisissez un format et lancez la préparation.",
        "Le navigateur lance le téléchargement une fois prêt ; vérifiez son gestionnaire de téléchargements.",
      ],
      limits: [
        "Les pistes privées, restreintes, supprimées ou non prises en charge sont indisponibles.",
        "La préparation peut attendre ou échouer ; les liens expirent et les téléchargements multiples peuvent demander une autorisation.",
        "Chaque piste lancée consomme une autorisation. Le lot s’arrête lorsque le quota est épuisé.",
      ],
    },
    playlist: {
      metadataTitle: "Téléchargeur de playlists SoundCloud",
      metadataDescription: "Préparez les pistes accessibles en MP3, M4A ou WAV, une par une.",
      pageTitle: "Téléchargeur de playlists SoundCloud",
      heroDescription: "Préparez les pistes accessibles en MP3, M4A ou WAV, une par une.",
      badgeLabel: "Préparer un téléchargement",
      formTitle: "Préparer un téléchargement",
      relatedToolText: "Besoin d'un autre parcours de téléchargement SoundCloud ?",
      relatedToolLabel: "Ouvrir le téléchargeur SoundCloud",
      directAnswer:
        "Chaque piste est préparée séparément et utilise une autorisation lorsque son lien est lancé. Le navigateur télécharge directement depuis le serveur.",
      facts: [
        "Choisissez MP3, M4A ou WAV ; la conversion n’améliore pas la qualité.",
        "Le serveur prépare les fichiers et les livre directement au navigateur.",
        "100 % indique la fin de la préparation, pas l’enregistrement sur votre appareil.",
      ],
      steps: [
        "Collez une URL SoundCloud publique et chargez ses informations.",
        "Choisissez un format et lancez la préparation.",
        "Le navigateur lance le téléchargement une fois prêt ; vérifiez son gestionnaire de téléchargements.",
      ],
      limits: [
        "Les pistes privées, restreintes, supprimées ou non prises en charge sont indisponibles.",
        "La préparation peut attendre ou échouer ; les liens expirent et les téléchargements multiples peuvent demander une autorisation.",
        "Chaque piste lancée consomme une autorisation. Le lot s’arrête lorsque le quota est épuisé.",
      ],
    },
  },
  es: {
    wav: {
      metadataTitle: "Descargador de SoundCloud a WAV",
      metadataDescription:
        "Prepara un WAV de una pista accesible. La conversión no recupera los detalles perdidos.",
      pageTitle: "Descargador de SoundCloud a WAV",
      heroDescription:
        "Prepara un WAV de una pista accesible. La conversión no recupera los detalles perdidos.",
      badgeLabel: "Preparar descarga",
      formTitle: "Preparar descarga",
      relatedToolText: "¿Necesitas otro flujo de descarga de SoundCloud?",
      relatedToolLabel: "Abrir SoundCloud Downloader",
      directAnswer:
        "El servidor convierte la fuente MP3 o AAC/M4A disponible en un WAV PCM real. El archivo aumenta de tamaño sin recuperar los detalles perdidos.",
      facts: [
        "Elige MP3, M4A o WAV; convertir no mejora la calidad original.",
        "El servidor prepara los archivos y los entrega directamente al navegador.",
        "100 % indica que la preparación terminó, no que el archivo esté guardado en tu dispositivo.",
      ],
      steps: [
        "Pega una URL pública de SoundCloud y carga sus datos.",
        "Elige el formato e inicia la preparación.",
        "El navegador inicia la descarga cuando está lista; comprueba su gestor de descargas.",
      ],
      limits: [
        "No se admiten pistas privadas, restringidas, eliminadas o incompatibles.",
        "La preparación puede esperar o fallar; los enlaces caducan y varias descargas pueden requerir permiso.",
        "Cada pista iniciada consume una autorización. El lote se detiene al agotarse la cuota.",
      ],
    },
    mp3: {
      metadataTitle: "Descargador de SoundCloud a MP3",
      metadataDescription: "Prepara un MP3 y descárgalo directamente desde el servidor.",
      pageTitle: "Descargador de SoundCloud a MP3",
      heroDescription: "Prepara un MP3 y descárgalo directamente desde el servidor.",
      badgeLabel: "Preparar descarga",
      formTitle: "Preparar descarga",
      relatedToolText: "¿Necesitas otro flujo de descarga de SoundCloud?",
      relatedToolLabel: "Abrir SoundCloud Downloader",
      directAnswer:
        "El servicio utiliza el MP3 disponible o convierte AAC/M4A a MP3 cuando hace falta. La conversión no mejora la calidad original.",
      facts: [
        "Elige MP3, M4A o WAV; convertir no mejora la calidad original.",
        "El servidor prepara los archivos y los entrega directamente al navegador.",
        "100 % indica que la preparación terminó, no que el archivo esté guardado en tu dispositivo.",
      ],
      steps: [
        "Pega una URL pública de SoundCloud y carga sus datos.",
        "Elige el formato e inicia la preparación.",
        "El navegador inicia la descarga cuando está lista; comprueba su gestor de descargas.",
      ],
      limits: [
        "No se admiten pistas privadas, restringidas, eliminadas o incompatibles.",
        "La preparación puede esperar o fallar; los enlaces caducan y varias descargas pueden requerir permiso.",
        "Cada pista iniciada consume una autorización. El lote se detiene al agotarse la cuota.",
      ],
    },
    playlist: {
      metadataTitle: "Descargador de playlists de SoundCloud",
      metadataDescription: "Prepara las pistas accesibles en MP3, M4A o WAV, una a una.",
      pageTitle: "Descargador de playlists de SoundCloud",
      heroDescription: "Prepara las pistas accesibles en MP3, M4A o WAV, una a una.",
      badgeLabel: "Preparar descarga",
      formTitle: "Preparar descarga",
      relatedToolText: "¿Necesitas otro flujo de descarga de SoundCloud?",
      relatedToolLabel: "Abrir SoundCloud Downloader",
      directAnswer:
        "Cada pista se prepara por separado y consume una autorización al iniciar su enlace de descarga. El navegador descarga directamente desde el servidor.",
      facts: [
        "Elige MP3, M4A o WAV; convertir no mejora la calidad original.",
        "El servidor prepara los archivos y los entrega directamente al navegador.",
        "100 % indica que la preparación terminó, no que el archivo esté guardado en tu dispositivo.",
      ],
      steps: [
        "Pega una URL pública de SoundCloud y carga sus datos.",
        "Elige el formato e inicia la preparación.",
        "El navegador inicia la descarga cuando está lista; comprueba su gestor de descargas.",
      ],
      limits: [
        "No se admiten pistas privadas, restringidas, eliminadas o incompatibles.",
        "La preparación puede esperar o fallar; los enlaces caducan y varias descargas pueden requerir permiso.",
        "Cada pista iniciada consume una autorización. El lote se detiene al agotarse la cuota.",
      ],
    },
  },
  de: {
    wav: {
      metadataTitle: "SoundCloud zu WAV Downloader",
      metadataDescription:
        "Bereite eine WAV-Datei aus einem zugänglichen Track vor. Die Konvertierung stellt verlorene Details nicht wieder her.",
      pageTitle: "SoundCloud zu WAV Downloader",
      heroDescription:
        "Bereite eine WAV-Datei aus einem zugänglichen Track vor. Die Konvertierung stellt verlorene Details nicht wieder her.",
      badgeLabel: "Download vorbereiten",
      formTitle: "Download vorbereiten",
      relatedToolText: "Du brauchst einen anderen SoundCloud-Downloadablauf?",
      relatedToolLabel: "SoundCloud Downloader öffnen",
      directAnswer:
        "Der Server wandelt die verfügbare MP3- oder AAC/M4A-Quelle in eine echte PCM-WAV-Datei um. Die Datei wird größer, verlorene Details werden nicht wiederhergestellt.",
      facts: [
        "Wähle MP3, M4A oder WAV; Konvertierung verbessert die Qualität nicht.",
        "Dateien werden auf dem Server vorbereitet und direkt an den Browser geliefert.",
        "100 % bedeutet bereit zum Download, nicht auf dem Gerät gespeichert.",
      ],
      steps: [
        "Öffentliche SoundCloud-URL einfügen und Informationen laden.",
        "Format wählen und Vorbereitung starten.",
        "Der Browser startet den fertigen Download; den Abschluss im Downloadmanager prüfen.",
      ],
      limits: [
        "Private, eingeschränkte, entfernte oder nicht unterstützte Tracks sind nicht verfügbar.",
        "Vorbereitung kann warten oder scheitern; Links laufen ab und mehrere Downloads können eine Erlaubnis benötigen.",
        "Jeder gestartete Track verbraucht eine Freigabe. Bei erschöpftem Kontingent stoppt der Durchlauf.",
      ],
    },
    mp3: {
      metadataTitle: "SoundCloud zu MP3 Downloader",
      metadataDescription: "Bereite eine MP3-Datei vor und lade sie direkt vom Downloadserver.",
      pageTitle: "SoundCloud zu MP3 Downloader",
      heroDescription: "Bereite eine MP3-Datei vor und lade sie direkt vom Downloadserver.",
      badgeLabel: "Download vorbereiten",
      formTitle: "Download vorbereiten",
      relatedToolText: "Du brauchst einen anderen SoundCloud-Downloadablauf?",
      relatedToolLabel: "SoundCloud Downloader öffnen",
      directAnswer:
        "Der Dienst verwendet verfügbares MP3 oder konvertiert AAC/M4A bei Bedarf zu MP3. Die Konvertierung verbessert die Quellqualität nicht.",
      facts: [
        "Wähle MP3, M4A oder WAV; Konvertierung verbessert die Qualität nicht.",
        "Dateien werden auf dem Server vorbereitet und direkt an den Browser geliefert.",
        "100 % bedeutet bereit zum Download, nicht auf dem Gerät gespeichert.",
      ],
      steps: [
        "Öffentliche SoundCloud-URL einfügen und Informationen laden.",
        "Format wählen und Vorbereitung starten.",
        "Der Browser startet den fertigen Download; den Abschluss im Downloadmanager prüfen.",
      ],
      limits: [
        "Private, eingeschränkte, entfernte oder nicht unterstützte Tracks sind nicht verfügbar.",
        "Vorbereitung kann warten oder scheitern; Links laufen ab und mehrere Downloads können eine Erlaubnis benötigen.",
        "Jeder gestartete Track verbraucht eine Freigabe. Bei erschöpftem Kontingent stoppt der Durchlauf.",
      ],
    },
    playlist: {
      metadataTitle: "SoundCloud Playlist Downloader",
      metadataDescription: "Bereite zugängliche Tracks einzeln als MP3, M4A oder WAV vor.",
      pageTitle: "SoundCloud Playlist Downloader",
      heroDescription: "Bereite zugängliche Tracks einzeln als MP3, M4A oder WAV vor.",
      badgeLabel: "Download vorbereiten",
      formTitle: "Download vorbereiten",
      relatedToolText: "Du brauchst einen anderen SoundCloud-Downloadablauf?",
      relatedToolLabel: "SoundCloud Downloader öffnen",
      directAnswer:
        "Jeder Track wird einzeln vorbereitet und verbraucht beim Start seines Downloadlinks eine Freigabe. Der Browser lädt direkt vom Downloadserver.",
      facts: [
        "Wähle MP3, M4A oder WAV; Konvertierung verbessert die Qualität nicht.",
        "Dateien werden auf dem Server vorbereitet und direkt an den Browser geliefert.",
        "100 % bedeutet bereit zum Download, nicht auf dem Gerät gespeichert.",
      ],
      steps: [
        "Öffentliche SoundCloud-URL einfügen und Informationen laden.",
        "Format wählen und Vorbereitung starten.",
        "Der Browser startet den fertigen Download; den Abschluss im Downloadmanager prüfen.",
      ],
      limits: [
        "Private, eingeschränkte, entfernte oder nicht unterstützte Tracks sind nicht verfügbar.",
        "Vorbereitung kann warten oder scheitern; Links laufen ab und mehrere Downloads können eine Erlaubnis benötigen.",
        "Jeder gestartete Track verbraucht eine Freigabe. Bei erschöpftem Kontingent stoppt der Durchlauf.",
      ],
    },
  },
}

export function getSoundCloudPageCopy(page: SoundCloudEvidencePage, locale: string) {
  return (copyByLocale[locale] ?? copyByLocale.en)[page]
}
