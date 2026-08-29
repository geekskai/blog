export const SOUNDCLOUD_SEO_UPDATED = "2026-08-29"

export type SoundCloudEvidencePage = "wav" | "mp3" | "playlist"

type SoundCloudPageCopy = {
  metadataTitle: string
  metadataDescription: string
  pageTitle: string
  heroDescription: string
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
    verified: "Current implementation reviewed on August 29, 2026",
    directAnswer: "Direct answer",
    facts: "What the current downloader actually does",
    steps: "How the browser download works",
    limits: "Known limits and failure cases",
    rights: "Use content you are allowed to download",
    rightsCopy:
      "This tool does not grant a license or bypass access controls. Download only audio you own, content the creator has made downloadable, or material you otherwise have permission to use.",
  },
  fr: {
    verified: "Implémentation actuelle examinée le 29 août 2026",
    directAnswer: "Réponse directe",
    facts: "Ce que le téléchargeur fait réellement",
    steps: "Fonctionnement du téléchargement dans le navigateur",
    limits: "Limites et cas d'échec connus",
    rights: "Téléchargez uniquement les contenus autorisés",
    rightsCopy:
      "Cet outil n'accorde aucune licence et ne contourne aucun contrôle d'accès. Téléchargez seulement vos propres fichiers, les contenus rendus téléchargeables par leur auteur ou ceux pour lesquels vous avez une autorisation.",
  },
  es: {
    verified: "Implementación actual revisada el 29 de agosto de 2026",
    directAnswer: "Respuesta directa",
    facts: "Qué hace realmente el descargador",
    steps: "Cómo funciona la descarga en el navegador",
    limits: "Límites y fallos conocidos",
    rights: "Descarga solo contenido autorizado",
    rightsCopy:
      "Esta herramienta no concede licencias ni evita controles de acceso. Descarga únicamente audio propio, contenido que el creador permita descargar o material para el que tengas autorización.",
  },
  de: {
    verified: "Aktuelle Implementierung am 29. August 2026 geprüft",
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
      metadataTitle: "SoundCloud to WAV: Source Format Checker & Downloader",
      metadataDescription:
        "Check the audio stream a public SoundCloud track exposes and save the available MP3 or M4A file. No fake WAV upconversion or quality-upgrade claim.",
      pageTitle: "SoundCloud to WAV: Download the Available Source Format",
      heroDescription:
        "Paste a public track URL to inspect it and save the browser-readable MP3 or M4A stream SoundCloud actually provides.",
      directAnswer:
        "This page does not synthesize a WAV file. It prefers SoundCloud's AAC/M4A stream for the WAV-oriented workflow, then falls back to progressive MP3, and saves the file with its true extension. Converting a lossy stream into a WAV container would make a larger file without restoring lost audio detail, so the downloader does not claim to do that.",
      facts: [
        "Output is the available MP3 or AAC/M4A stream, never a renamed WAV file.",
        "The tool does not increase bitrate, sample rate, or source quality.",
        "Track metadata and the download URL are resolved only after you submit a public URL.",
      ],
      steps: [
        "Paste one public SoundCloud track URL and fetch its track information.",
        "Choose MP3 or the source-oriented M4A option; availability depends on that track.",
        "Download in the browser. The saved filename is corrected to .mp3 or .m4a.",
      ],
      limits: [
        "Private, restricted, removed, or non-streamable tracks are not supported.",
        "Signed media URLs can expire, and some browser or CORS combinations can fail.",
        "No fixed speed, file size, bitrate, or lossless-quality guarantee is published.",
      ],
    },
    mp3: {
      metadataTitle: "SoundCloud to MP3 Downloader - Source-Quality Audio",
      metadataDescription:
        "Save the progressive MP3 stream exposed for a public SoundCloud track. If MP3 is unavailable, the downloader keeps the available M4A format and true extension.",
      pageTitle: "SoundCloud to MP3 Downloader",
      heroDescription:
        "Paste one public track URL. The downloader prefers a progressive MP3 stream and clearly reports when SoundCloud only provides AAC/M4A.",
      directAnswer:
        "The downloader saves a progressive MP3 when SoundCloud exposes one. It does not re-encode audio to 320 kbps or improve the source stream. When a progressive MP3 is unavailable but a browser-readable AAC stream exists, it saves M4A instead of disguising that file as MP3.",
      facts: [
        "Progressive MP3 is preferred; AAC/M4A is the transparent fallback.",
        "The output bitrate and quality come from the available SoundCloud stream.",
        "The workflow handles one track URL; playlist URLs are sent to the playlist tool.",
      ],
      steps: [
        "Paste a public SoundCloud track URL and fetch its metadata.",
        "Keep MP3 selected and start the browser download.",
        "Check the saved extension: it remains .mp3 or changes to .m4a when that is the real stream.",
      ],
      limits: [
        "Private, restricted, removed, or non-streamable tracks cannot be downloaded.",
        "A progressive MP3 is not guaranteed for every public track.",
        "Processing time depends on SoundCloud, track length, browser, and connection speed.",
      ],
    },
    playlist: {
      metadataTitle: "SoundCloud Playlist Downloader - Public Tracks, One by One",
      metadataDescription:
        "Inspect a public SoundCloud /sets/ playlist and download its accessible tracks sequentially as the MP3 or M4A stream each track exposes.",
      pageTitle: "SoundCloud Playlist Downloader",
      heroDescription:
        "Load a public /sets/ playlist, review accessible tracks, and download them sequentially in each track's available MP3 or M4A format.",
      directAnswer:
        "The playlist tool fetches accessible tracks from a public SoundCloud /sets/ URL and downloads them sequentially in the browser. Each track is resolved separately, uses one download allowance, and may save as MP3 or M4A. A failed or restricted track is counted without changing the format of successful files.",
      facts: [
        "Public playlist URLs containing /sets/ are supported; private tracks are omitted and counted.",
        "Downloads run one track at a time with a short delay to keep the browser stable.",
        "Each track keeps its available MP3 or M4A format; the tool does not create a ZIP or WAV archive.",
      ],
      steps: [
        "Paste a public /sets/ playlist URL and fetch the track list.",
        "Review accessible and restricted-track counts, then choose MP3 or source-oriented M4A.",
        "Download all or selected tracks; progress and partial failures are reported per item.",
      ],
      limits: [
        "Private playlists, private tracks, empty sets, and removed tracks are unavailable.",
        "Browsers may ask permission for multiple downloads and signed URLs can expire.",
        "A partial failure does not mean the entire playlist was saved successfully.",
      ],
    },
  },
  fr: {
    wav: {
      metadataTitle: "SoundCloud vers WAV : vérifier et télécharger le format source",
      metadataDescription:
        "Vérifiez le flux d'une piste SoundCloud publique et enregistrez le MP3 ou M4A disponible, sans fausse conversion WAV ni promesse sans perte.",
      pageTitle: "SoundCloud vers WAV : télécharger le format réellement disponible",
      heroDescription:
        "Collez l'URL d'une piste publique pour inspecter et enregistrer le flux MP3 ou M4A réellement fourni par SoundCloud.",
      directAnswer:
        "Cette page ne fabrique pas de fichier WAV. Pour le flux orienté qualité, elle préfère l'AAC/M4A fourni par SoundCloud puis utilise le MP3 progressif en repli, toujours avec la bonne extension. Transformer un flux compressé en WAV créerait un fichier plus lourd sans restaurer les détails perdus.",
      facts: [
        "La sortie est le flux MP3 ou AAC/M4A disponible, jamais un faux WAV renommé.",
        "Le débit, la fréquence d'échantillonnage et la qualité source ne sont pas augmentés.",
        "Les métadonnées et l'URL signée sont résolues après l'envoi d'une URL publique.",
      ],
      steps: [
        "Collez l'URL d'une piste SoundCloud publique et chargez ses informations.",
        "Choisissez MP3 ou l'option M4A source selon les formats disponibles.",
        "Téléchargez dans le navigateur ; l'extension finale reste .mp3 ou .m4a.",
      ],
      limits: [
        "Les pistes privées, restreintes, supprimées ou non diffusables ne sont pas prises en charge.",
        "Les URL signées peuvent expirer et certains navigateurs peuvent bloquer le transfert.",
        "Aucune vitesse, taille, qualité sans perte ou valeur de débit fixe n'est garantie.",
      ],
    },
    mp3: {
      metadataTitle: "Téléchargeur SoundCloud vers MP3 - qualité du flux source",
      metadataDescription:
        "Enregistrez le MP3 progressif d'une piste SoundCloud publique. Si aucun MP3 n'est disponible, le format M4A réel est conservé.",
      pageTitle: "Téléchargeur SoundCloud vers MP3",
      heroDescription:
        "Collez l'URL d'une piste publique : le téléchargeur préfère le MP3 progressif et signale clairement le repli AAC/M4A.",
      directAnswer:
        "Le téléchargeur enregistre un MP3 progressif lorsque SoundCloud en fournit un. Il ne réencode pas le son en 320 kbit/s et n'améliore pas le flux source. Si seul un flux AAC lisible dans le navigateur est disponible, il enregistre un fichier M4A au lieu de le présenter comme un MP3.",
      facts: [
        "Le MP3 progressif est prioritaire ; AAC/M4A est le repli transparent.",
        "Le débit et la qualité proviennent du flux SoundCloud disponible.",
        "Cette page traite une piste ; les URL de playlists vont vers l'outil dédié.",
      ],
      steps: [
        "Collez l'URL d'une piste publique et chargez ses métadonnées.",
        "Gardez MP3 sélectionné puis lancez le téléchargement.",
        "Vérifiez l'extension enregistrée : .mp3 ou .m4a selon le vrai flux.",
      ],
      limits: [
        "Les pistes privées, restreintes, supprimées ou non diffusables sont indisponibles.",
        "Toutes les pistes publiques ne proposent pas de MP3 progressif.",
        "La durée dépend de SoundCloud, de la piste, du navigateur et de la connexion.",
      ],
    },
    playlist: {
      metadataTitle: "Téléchargeur de playlists SoundCloud - pistes publiques une par une",
      metadataDescription:
        "Analysez une playlist SoundCloud publique /sets/ et téléchargez ses pistes accessibles une par une au format MP3 ou M4A disponible.",
      pageTitle: "Téléchargeur de playlists SoundCloud",
      heroDescription:
        "Chargez une playlist /sets/ publique, vérifiez les pistes accessibles et téléchargez-les séquentiellement en MP3 ou M4A.",
      directAnswer:
        "L'outil charge les pistes accessibles d'une URL SoundCloud publique contenant /sets/ puis les télécharge une par une dans le navigateur. Chaque piste est résolue séparément, utilise une autorisation de téléchargement et peut être enregistrée en MP3 ou M4A. Les échecs partiels sont comptabilisés.",
      facts: [
        "Les playlists publiques /sets/ sont prises en charge ; les pistes privées sont exclues et comptées.",
        "Les téléchargements sont séquentiels avec une courte pause pour stabiliser le navigateur.",
        "Chaque piste garde son vrai format MP3 ou M4A ; aucun ZIP ou WAV n'est créé.",
      ],
      steps: [
        "Collez une URL publique /sets/ et chargez la liste des pistes.",
        "Vérifiez les nombres de pistes accessibles et restreintes, puis choisissez le format préféré.",
        "Téléchargez tout ou une sélection ; la progression et les échecs sont indiqués par piste.",
      ],
      limits: [
        "Les playlists privées, pistes privées, listes vides et pistes supprimées sont indisponibles.",
        "Le navigateur peut demander l'autorisation pour plusieurs fichiers et les URL peuvent expirer.",
        "Un échec partiel signifie que la playlist n'a pas été entièrement enregistrée.",
      ],
    },
  },
  es: {
    wav: {
      metadataTitle: "SoundCloud a WAV: comprueba y descarga el formato de origen",
      metadataDescription:
        "Comprueba el flujo de una pista pública y guarda el MP3 o M4A disponible, sin falsa conversión WAV ni promesas sin pérdidas.",
      pageTitle: "SoundCloud a WAV: descarga el formato realmente disponible",
      heroDescription:
        "Pega la URL de una pista pública para inspeccionar y guardar el flujo MP3 o M4A que SoundCloud ofrece realmente.",
      directAnswer:
        "Esta página no crea un archivo WAV. Para el flujo orientado a calidad, prefiere AAC/M4A y usa MP3 progresivo como alternativa, siempre con la extensión correcta. Convertir un flujo con pérdida a WAV solo produciría un archivo mayor sin recuperar detalle de audio, por eso no se promete esa conversión.",
      facts: [
        "La salida es el flujo MP3 o AAC/M4A disponible, nunca un WAV renombrado.",
        "No se aumenta el bitrate, la frecuencia de muestreo ni la calidad de origen.",
        "Los metadatos y la URL firmada se resuelven después de enviar una URL pública.",
      ],
      steps: [
        "Pega la URL de una pista pública y carga su información.",
        "Elige MP3 o la opción M4A de origen según la disponibilidad de la pista.",
        "Descarga en el navegador; la extensión final será .mp3 o .m4a.",
      ],
      limits: [
        "No se admiten pistas privadas, restringidas, eliminadas o sin streaming público.",
        "Las URL firmadas pueden caducar y algunos navegadores pueden bloquear la descarga.",
        "No se garantiza velocidad, tamaño, bitrate fijo ni calidad sin pérdidas.",
      ],
    },
    mp3: {
      metadataTitle: "Descargador de SoundCloud a MP3 - calidad del flujo de origen",
      metadataDescription:
        "Guarda el MP3 progresivo de una pista pública. Si no está disponible, el descargador conserva el formato M4A real.",
      pageTitle: "Descargador de SoundCloud a MP3",
      heroDescription:
        "Pega una pista pública: el descargador prioriza MP3 progresivo e informa cuando solo existe AAC/M4A.",
      directAnswer:
        "El descargador guarda un MP3 progresivo cuando SoundCloud lo ofrece. No recodifica el audio a 320 kbps ni mejora el flujo original. Si no hay MP3 progresivo pero existe AAC compatible con el navegador, guarda M4A en lugar de presentar ese archivo como MP3.",
      facts: [
        "Se prioriza MP3 progresivo; AAC/M4A es la alternativa transparente.",
        "El bitrate y la calidad dependen del flujo disponible en SoundCloud.",
        "Esta página procesa una pista; las playlists se envían a la herramienta específica.",
      ],
      steps: [
        "Pega la URL de una pista pública y carga sus metadatos.",
        "Mantén MP3 seleccionado e inicia la descarga.",
        "Comprueba la extensión guardada: .mp3 o .m4a según el flujo real.",
      ],
      limits: [
        "No se descargan pistas privadas, restringidas, eliminadas o no reproducibles.",
        "No todas las pistas públicas ofrecen MP3 progresivo.",
        "El tiempo depende de SoundCloud, la duración, el navegador y la conexión.",
      ],
    },
    playlist: {
      metadataTitle: "Descargador de playlists de SoundCloud - pistas públicas una a una",
      metadataDescription:
        "Analiza una playlist pública /sets/ y descarga secuencialmente sus pistas accesibles en el MP3 o M4A disponible.",
      pageTitle: "Descargador de playlists de SoundCloud",
      heroDescription:
        "Carga una playlist pública /sets/, revisa las pistas accesibles y descárgalas una a una como MP3 o M4A.",
      directAnswer:
        "La herramienta obtiene las pistas accesibles de una URL pública /sets/ y las descarga secuencialmente en el navegador. Cada pista se resuelve por separado, consume una autorización de descarga y puede guardarse como MP3 o M4A. Las pistas restringidas y los fallos parciales se contabilizan.",
      facts: [
        "Se admiten playlists públicas /sets/; las pistas privadas se omiten y se cuentan.",
        "Las descargas se ejecutan una por una con una pausa corta para estabilizar el navegador.",
        "Cada pista conserva MP3 o M4A; la herramienta no crea archivos ZIP ni WAV.",
      ],
      steps: [
        "Pega una URL pública /sets/ y carga la lista de pistas.",
        "Revisa los recuentos de pistas accesibles y restringidas y elige el formato preferido.",
        "Descarga todas o algunas; el progreso y los fallos se muestran por pista.",
      ],
      limits: [
        "No se admiten playlists privadas, pistas privadas, listas vacías ni pistas eliminadas.",
        "El navegador puede pedir permiso para varias descargas y las URL pueden caducar.",
        "Un fallo parcial significa que la playlist no se guardó completamente.",
      ],
    },
  },
  de: {
    wav: {
      metadataTitle: "SoundCloud zu WAV: Quellformat prüfen und herunterladen",
      metadataDescription:
        "Prüfe den Stream eines öffentlichen Tracks und speichere das verfügbare MP3 oder M4A ohne falsche WAV- oder Lossless-Versprechen.",
      pageTitle: "SoundCloud zu WAV: das tatsächlich verfügbare Format laden",
      heroDescription:
        "Füge die URL eines öffentlichen Tracks ein und speichere den von SoundCloud bereitgestellten MP3- oder M4A-Stream.",
      directAnswer:
        "Diese Seite erzeugt keine WAV-Datei. Für den qualitätsorientierten Ablauf bevorzugt sie AAC/M4A und nutzt progressives MP3 als Alternative, jeweils mit korrekter Dateiendung. Ein verlustbehafteter Stream würde durch eine WAV-Hülle nur größer; verlorene Audiodetails kämen nicht zurück.",
      facts: [
        "Ausgabe ist der verfügbare MP3- oder AAC/M4A-Stream, niemals eine umbenannte WAV-Datei.",
        "Bitrate, Abtastrate und Quellqualität werden nicht erhöht.",
        "Metadaten und signierte Download-URL werden erst nach Eingabe einer öffentlichen URL ermittelt.",
      ],
      steps: [
        "URL eines öffentlichen SoundCloud-Tracks einfügen und Trackdaten laden.",
        "MP3 oder die quellorientierte M4A-Option wählen, sofern verfügbar.",
        "Im Browser laden; die Datei erhält die tatsächliche Endung .mp3 oder .m4a.",
      ],
      limits: [
        "Private, eingeschränkte, gelöschte oder nicht streambare Tracks werden nicht unterstützt.",
        "Signierte URLs können ablaufen und Browser oder CORS können den Abruf blockieren.",
        "Keine feste Geschwindigkeit, Dateigröße, Bitrate oder Lossless-Qualität wird garantiert.",
      ],
    },
    mp3: {
      metadataTitle: "SoundCloud-zu-MP3-Downloader - Qualität des Quellstreams",
      metadataDescription:
        "Speichere den progressiven MP3-Stream eines öffentlichen Tracks. Ist kein MP3 verfügbar, bleibt das echte M4A-Format erhalten.",
      pageTitle: "SoundCloud-zu-MP3-Downloader",
      heroDescription:
        "Füge einen öffentlichen Track ein. Progressives MP3 wird bevorzugt; AAC/M4A wird transparent als Alternative gespeichert.",
      directAnswer:
        "Der Downloader speichert progressives MP3, wenn SoundCloud einen solchen Stream bereitstellt. Er kodiert Audio nicht auf 320 kbit/s neu und verbessert die Quelle nicht. Ist nur browserlesbares AAC verfügbar, wird M4A gespeichert, statt die Datei als MP3 auszugeben.",
      facts: [
        "Progressives MP3 wird bevorzugt; AAC/M4A ist die transparente Alternative.",
        "Bitrate und Qualität stammen aus dem verfügbaren SoundCloud-Stream.",
        "Diese Seite verarbeitet einen Track; Playlist-URLs gehen zum Playlist-Tool.",
      ],
      steps: [
        "URL eines öffentlichen Tracks einfügen und Metadaten laden.",
        "MP3 ausgewählt lassen und den Browser-Download starten.",
        "Dateiendung prüfen: Je nach echtem Stream bleibt .mp3 oder wird .m4a verwendet.",
      ],
      limits: [
        "Private, eingeschränkte, gelöschte oder nicht streambare Tracks sind nicht verfügbar.",
        "Nicht jeder öffentliche Track bietet progressives MP3.",
        "Die Dauer hängt von SoundCloud, Tracklänge, Browser und Verbindung ab.",
      ],
    },
    playlist: {
      metadataTitle: "SoundCloud-Playlist-Downloader - öffentliche Tracks einzeln laden",
      metadataDescription:
        "Prüfe eine öffentliche /sets/-Playlist und lade zugängliche Tracks nacheinander im verfügbaren MP3- oder M4A-Format.",
      pageTitle: "SoundCloud-Playlist-Downloader",
      heroDescription:
        "Öffentliche /sets/-Playlist laden, zugängliche Tracks prüfen und nacheinander als MP3 oder M4A speichern.",
      directAnswer:
        "Das Tool lädt zugängliche Tracks einer öffentlichen SoundCloud-/sets/-URL nacheinander im Browser. Jeder Track wird separat aufgelöst, nutzt eine Download-Freigabe und kann als MP3 oder M4A gespeichert werden. Eingeschränkte Tracks und Teilfehler werden gezählt.",
      facts: [
        "Öffentliche /sets/-URLs werden unterstützt; private Tracks werden ausgelassen und gezählt.",
        "Downloads laufen einzeln mit kurzer Pause, damit der Browser stabil bleibt.",
        "Jeder Track behält MP3 oder M4A; das Tool erstellt weder ZIP noch WAV.",
      ],
      steps: [
        "Öffentliche /sets/-URL einfügen und Trackliste laden.",
        "Zugängliche und eingeschränkte Tracks prüfen und das bevorzugte Format wählen.",
        "Alle oder einzelne Tracks laden; Fortschritt und Fehler werden pro Track angezeigt.",
      ],
      limits: [
        "Private Playlists, private Tracks, leere Sets und gelöschte Tracks sind nicht verfügbar.",
        "Der Browser kann mehrere Downloads bestätigen müssen; signierte URLs können ablaufen.",
        "Bei Teilfehlern wurde die Playlist nicht vollständig gespeichert.",
      ],
    },
  },
}

export function getSoundCloudPageCopy(page: SoundCloudEvidencePage, locale: string) {
  return (copyByLocale[locale] ?? copyByLocale.en)[page]
}
