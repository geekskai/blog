export const SOUNDCLOUD_SEO_UPDATED = "2026-10-09"

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
    verified: "Current implementation reviewed on October 6, 2026",
    directAnswer: "Direct answer",
    facts: "What the current downloader actually does",
    steps: "How the browser download works",
    limits: "Known limits and failure cases",
    rights: "Use content you are allowed to download",
    rightsCopy:
      "This tool does not grant a license or bypass access controls. Download only audio you own, content the creator has made downloadable, or material you otherwise have permission to use.",
  },
  fr: {
    verified: "Implémentation actuelle examinée le 6 octobre 2026",
    directAnswer: "Réponse directe",
    facts: "Ce que le téléchargeur fait réellement",
    steps: "Fonctionnement du téléchargement dans le navigateur",
    limits: "Limites et cas d'échec connus",
    rights: "Téléchargez uniquement les contenus autorisés",
    rightsCopy:
      "Cet outil n'accorde aucune licence et ne contourne aucun contrôle d'accès. Téléchargez seulement vos propres fichiers, les contenus rendus téléchargeables par leur auteur ou ceux pour lesquels vous avez une autorisation.",
  },
  es: {
    verified: "Implementación actual revisada el 6 de octubre de 2026",
    directAnswer: "Respuesta directa",
    facts: "Qué hace realmente el descargador",
    steps: "Cómo funciona la descarga en el navegador",
    limits: "Límites y fallos conocidos",
    rights: "Descarga solo contenido autorizado",
    rightsCopy:
      "Esta herramienta no concede licencias ni evita controles de acceso. Descarga únicamente audio propio, contenido que el creador permita descargar o material para el que tengas autorización.",
  },
  de: {
    verified: "Aktuelle Implementierung am 6. Oktober 2026 geprüft",
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

const additionalSectionCopy: Record<string, SoundCloudSectionCopy> = {
  ar: { verified: "تمت مراجعة التنفيذ الحالي في 6 أكتوبر 2026", directAnswer: "الإجابة المباشرة", facts: "ما الذي يفعله المُنزّل فعليًا", steps: "كيف يعمل التنزيل في المتصفح", limits: "القيود وحالات الفشل المعروفة", rights: "نزّل المحتوى المسموح لك بتنزيله فقط", rightsCopy: "لا تمنح هذه الأداة ترخيصًا ولا تتجاوز ضوابط الوصول. نزّل فقط الصوت الذي تملكه أو المحتوى الذي أتاح منشئه تنزيله أو المادة التي لديك إذن باستخدامها." },
  ja: { verified: "現在の実装は 2026 年 10 月 6 日に確認済み", directAnswer: "直接回答", facts: "このダウンローダーの実際の動作", steps: "ブラウザーでのダウンロード方法", limits: "既知の制限と失敗例", rights: "ダウンロードが許可されたコンテンツだけを使用", rightsCopy: "このツールはライセンスを付与したり、アクセス制御を回避したりしません。自分が所有する音声、作成者がダウンロードを許可したコンテンツ、または使用許可を得た素材だけをダウンロードしてください。" },
  ko: { verified: "현재 구현은 2026년 10월 6일에 검토되었습니다", directAnswer: "직접 답변", facts: "다운로더의 실제 동작", steps: "브라우저 다운로드 방식", limits: "알려진 제한 및 실패 사례", rights: "다운로드가 허용된 콘텐츠만 사용하세요", rightsCopy: "이 도구는 라이선스를 부여하거나 접근 제어를 우회하지 않습니다. 소유한 오디오, 제작자가 다운로드를 허용한 콘텐츠 또는 사용 권한이 있는 자료만 다운로드하세요." },
  no: { verified: "Gjeldende implementasjon ble gjennomgått 6. oktober 2026", directAnswer: "Direkte svar", facts: "Hva nedlasteren faktisk gjør", steps: "Slik fungerer nedlastingen i nettleseren", limits: "Kjente begrensninger og feiltilfeller", rights: "Bruk bare innhold du har lov til å laste ned", rightsCopy: "Dette verktøyet gir ingen lisens og omgår ingen tilgangskontroller. Last bare ned lyd du eier, innhold som skaperen har gjort tilgjengelig for nedlasting, eller materiale du har tillatelse til å bruke." },
  "zh-cn": { verified: "当前实现已于 2026 年 10 月 6 日检查", directAnswer: "直接回答", facts: "下载器当前实际执行的操作", steps: "浏览器下载流程", limits: "已知限制和失败情况", rights: "仅使用获准下载的内容", rightsCopy: "此工具不会授予许可，也不会绕过访问控制。请仅下载你拥有的音频、创作者允许下载的内容，或你已获得使用授权的材料。" },
  da: { verified: "Den aktuelle implementering blev gennemgået 6. oktober 2026", directAnswer: "Direkte svar", facts: "Hvad downloaderen faktisk gør", steps: "Sådan fungerer browserdownload", limits: "Kendte begrænsninger og fejltilfælde", rights: "Brug kun indhold, du har lov til at downloade", rightsCopy: "Dette værktøj giver ingen licens og omgår ingen adgangskontrol. Download kun lyd, du ejer, indhold som skaberen har gjort downloadbart, eller materiale du har tilladelse til at bruge." },
}

const additionalPageCopy: Record<string, Record<SoundCloudEvidencePage, SoundCloudPageCopy>> = {
  ar: {
    wav: { metadataTitle: "منزّل SoundCloud إلى WAV", metadataDescription: "جهّز ملف WAV من مقطع SoundCloud متاح. لا تعيد التحويل التفاصيل الصوتية المفقودة من المصدر.", pageTitle: "منزّل SoundCloud إلى WAV", heroDescription: "جهّز ملف WAV من مقطع SoundCloud متاح. لا تعيد العملية التفاصيل الصوتية المفقودة.", badgeLabel: "تجهيز التنزيل", formTitle: "تجهيز التنزيل", relatedToolText: "هل تحتاج إلى مسار تنزيل SoundCloud مختلف؟", relatedToolLabel: "فتح منزّل SoundCloud", directAnswer: "يحوّل الخادم مصدر MP3 أو AAC/M4A المتاح إلى ملف WAV حقيقي بصيغة PCM. ينتج عن ذلك ملف أكبر دون استعادة التفاصيل المفقودة.", facts: ["اختر MP3 أو M4A أو WAV؛ لا يحسن التحويل جودة المصدر.", "تُجهّز الملفات على خادم التنزيل وتُسلّم مباشرة إلى متصفحك.", "يصف التقدم تجهيز الخادم؛ وصوله إلى 100% لا يعني حفظ الملف على جهازك."], steps: ["ألصق رابط SoundCloud عامًا وحمّل معلوماته.", "اختر صيغة وابدأ التجهيز.", "عند الجاهزية يبدأ المتصفح تنزيل الملف؛ تحقق من مدير التنزيلات."], limits: ["لا يمكن تنزيل المقاطع الخاصة أو المقيدة أو المحذوفة أو غير المدعومة.", "قد ينتظر التجهيز أو يفشل؛ تنتهي صلاحية الروابط وقد يطلب المتصفح إذنًا للتنزيلات المتعددة.", "يستهلك كل مقطع يبدأ تنزيله سماحًا واحدًا؛ تتوقف الدفعة عند نفاد السماحات."] },
    mp3: { metadataTitle: "منزّل SoundCloud إلى MP3", metadataDescription: "جهّز ملف MP3 من مقطع SoundCloud متاح ثم نزّله مباشرة من خادم التنزيل.", pageTitle: "منزّل SoundCloud إلى MP3", heroDescription: "جهّز ملف MP3 من مقطع SoundCloud متاح ثم نزّله مباشرة من خادم التنزيل.", badgeLabel: "تجهيز التنزيل", formTitle: "تجهيز التنزيل", relatedToolText: "هل تحتاج إلى مسار تنزيل SoundCloud مختلف؟", relatedToolLabel: "فتح منزّل SoundCloud", directAnswer: "تستخدم الخدمة مصدر MP3 المتاح أو تحوّل AAC/M4A إلى MP3 عند الحاجة. لا يحسن التحويل جودة المصدر.", facts: ["اختر MP3 أو M4A أو WAV؛ لا يحسن التحويل جودة المصدر.", "تُجهّز الملفات على خادم التنزيل وتُسلّم مباشرة إلى متصفحك.", "يصف التقدم تجهيز الخادم؛ 100% لا يعني حفظ الملف على جهازك."], steps: ["ألصق رابط SoundCloud عامًا وحمّل معلوماته.", "اختر صيغة وابدأ التجهيز.", "عند الجاهزية يبدأ المتصفح تنزيل الملف؛ تحقق من مدير التنزيلات."], limits: ["لا يمكن تنزيل المقاطع الخاصة أو المقيدة أو المحذوفة أو غير المدعومة.", "قد ينتظر التجهيز أو يفشل؛ تنتهي صلاحية الروابط وقد يطلب المتصفح إذنًا للتنزيلات المتعددة.", "يستهلك كل مقطع يبدأ تنزيله سماحًا واحدًا؛ تتوقف الدفعة عند نفاد السماحات."] },
    playlist: { metadataTitle: "منزّل قوائم SoundCloud", metadataDescription: "جهّز مقاطع القائمة المتاحة واحدًا تلو الآخر بصيغة MP3 أو M4A أو WAV التي تختارها.", pageTitle: "منزّل قوائم SoundCloud", heroDescription: "جهّز مقاطع القائمة المتاحة واحدًا تلو الآخر بصيغة MP3 أو M4A أو WAV التي تختارها.", badgeLabel: "تجهيز التنزيل", formTitle: "تجهيز التنزيل", relatedToolText: "هل تحتاج إلى مسار تنزيل SoundCloud مختلف؟", relatedToolLabel: "فتح منزّل SoundCloud", directAnswer: "يُجهّز كل مقطع على حدة ويستهلك سماحًا واحدًا عند تشغيل رابط تنزيله. ينزّل المتصفح الملفات مباشرة من خادم التنزيل.", facts: ["اختر MP3 أو M4A أو WAV؛ لا يحسن التحويل جودة المصدر.", "تُجهّز الملفات على خادم التنزيل وتُسلّم مباشرة إلى متصفحك.", "يصف التقدم تجهيز الخادم؛ 100% لا يعني حفظ الملف على جهازك."], steps: ["ألصق رابط SoundCloud عامًا وحمّل معلوماته.", "اختر صيغة وابدأ التجهيز.", "عند الجاهزية يبدأ المتصفح تنزيل الملف؛ تحقق من مدير التنزيلات."], limits: ["لا يمكن تنزيل المقاطع الخاصة أو المقيدة أو المحذوفة أو غير المدعومة.", "قد ينتظر التجهيز أو يفشل؛ تنتهي صلاحية الروابط وقد يطلب المتصفح إذنًا للتنزيلات المتعددة.", "يستهلك كل مقطع يبدأ تنزيله سماحًا واحدًا؛ تتوقف الدفعة عند نفاد السماحات."] },
  },
}

// The remaining six locales use the same verified copy structure and are added below
// by composing translated labels with the locale-specific page terminology.
for (const locale of ["ja", "ko", "no", "zh-cn", "da"]) {
  const labels = {
    ja: ["SoundCloud ダウンローダー", "ダウンロードを準備", "SoundCloud ダウンローダーを開く", "公開 SoundCloud URL を貼り付けて情報を読み込みます。", "形式を選択して準備を開始します。", "準備ができるとブラウザーがダウンロードを開始します。", "非公開、制限、削除済み、または未対応のトラックはダウンロードできません。", "準備が待機または失敗する場合があります。リンクには有効期限があり、複数ダウンロードには許可が必要な場合があります。", "開始した各トラックは 1 回分を消費します。残量がなくなるとバッチは停止します。"],
    ko: ["SoundCloud 다운로더", "다운로드 준비", "SoundCloud 다운로더 열기", "공개 SoundCloud URL을 붙여넣고 정보를 불러옵니다.", "형식을 선택하고 준비를 시작합니다.", "준비되면 브라우저가 다운로드를 시작합니다.", "비공개, 제한, 삭제 또는 지원되지 않는 트랙은 다운로드할 수 없습니다.", "준비가 대기하거나 실패할 수 있습니다. 링크는 만료되며 여러 다운로드에는 권한이 필요할 수 있습니다.", "시작한 트랙마다 1회 사용량이 차감됩니다. 사용량이 없으면 배치가 중지됩니다."],
    no: ["SoundCloud-nedlaster", "Forbered nedlasting", "Åpne SoundCloud-nedlaster", "Lim inn en offentlig SoundCloud-URL og last inn informasjonen.", "Velg format og start forberedelsen.", "Når filen er klar, starter nettleseren nedlastingen.", "Private, begrensede, fjernede eller ustøttede spor kan ikke lastes ned.", "Forberedelsen kan stå i kø eller mislykkes. Lenker utløper, og flere nedlastinger kan kreve tillatelse.", "Hvert startet spor bruker én tillatelse. Når kvoten er tom, stopper batchen."],
    "zh-cn": ["SoundCloud 下载器", "准备下载", "打开 SoundCloud 下载器", "粘贴公开的 SoundCloud URL 并加载信息。", "选择格式并开始准备。", "准备完成后，浏览器会开始下载。", "无法下载私密、受限、已删除或不支持的曲目。", "准备过程可能排队或失败；链接会过期，浏览器可能需要允许多个下载。", "每个启动下载的曲目消耗一次额度；额度用完后批量任务会停止。"],
    da: ["SoundCloud-downloader", "Forbered download", "Åbn SoundCloud-downloader", "Indsæt en offentlig SoundCloud-URL, og indlæs oplysningerne.", "Vælg et format, og start forberedelsen.", "Når filen er klar, starter browseren downloadet.", "Private, begrænsede, fjernede eller ikke-understøttede numre kan ikke downloades.", "Forberedelsen kan stå i kø eller mislykkes. Links udløber, og flere downloads kan kræve tilladelse.", "Hvert startet nummer bruger én tilladelse. Batchjobbet stopper, når kvoten er opbrugt."],
  }[locale as "ja" | "ko" | "no" | "zh-cn" | "da"]
  const [name, prepare, open, step1, step2, step3, limit1, limit2, limit3] = labels
  const phrases = {
    ja: { accessible: "アクセス可能な SoundCloud トラック", playlist: "アクセス可能なプレイリストのトラックを個別に", prepare: "サーバーでファイルを準備してブラウザーへ直接配信します。変換によって元ソースの失われた音質が戻ることはありません。", formats: "MP3、M4A、WAV から選択できます。", server: "ファイルはダウンロードサーバーで準備され、ブラウザーへ直接配信されます。", progress: "進行状況はサーバーでの準備を示します。100% でも端末への保存完了を意味しません。" },
    ko: { accessible: "접근 가능한 SoundCloud 트랙", playlist: "접근 가능한 플레이리스트 트랙을 개별적으로", prepare: "서버에서 파일을 준비해 브라우저로 직접 전달합니다. 변환해도 원본에서 손실된 음질이 복원되지는 않습니다.", formats: "MP3, M4A 또는 WAV를 선택할 수 있습니다.", server: "파일은 다운로드 서버에서 준비되어 브라우저로 직접 전달됩니다.", progress: "진행률은 서버 준비 상태를 나타냅니다. 100%가 기기에 저장되었다는 뜻은 아닙니다." },
    no: { accessible: "et tilgjengelig SoundCloud-spor", playlist: "tilgjengelige spillelistespor enkeltvis", prepare: "Filer klargjøres på serveren og leveres direkte til nettleseren. Konvertering gjenoppretter ikke detaljer som mangler i kilden.", formats: "Velg mellom MP3, M4A eller WAV.", server: "Filene klargjøres på nedlastingsserveren og leveres direkte til nettleseren.", progress: "Fremdriften gjelder serverforberedelsen; 100 % betyr ikke at filen er lagret på enheten." },
    "zh-cn": { accessible: "可访问的 SoundCloud 曲目", playlist: "逐个准备可访问的播放列表曲目", prepare: "文件会在服务器上准备，然后直接发送到浏览器。转换不会恢复源文件中已经丢失的音频细节。", formats: "可选择 MP3、M4A 或 WAV。", server: "文件在下载服务器上准备，并直接发送到浏览器。", progress: "进度表示服务器准备状态；达到 100% 不代表文件已保存到设备。" },
    da: { accessible: "et tilgængeligt SoundCloud-nummer", playlist: "tilgængelige playlistenumre enkeltvis", prepare: "Filerne klargøres på serveren og leveres direkte til browseren. Konvertering genskaber ikke detaljer, der mangler i kilden.", formats: "Vælg mellem MP3, M4A eller WAV.", server: "Filerne klargøres på downloadserveren og leveres direkte til browseren.", progress: "Fremdriften viser serverens klargøring; 100 % betyder ikke, at filen er gemt på enheden." },
  }[locale as "ja" | "ko" | "no" | "zh-cn" | "da"]
  additionalPageCopy[locale] = (['wav', 'mp3', 'playlist'] as SoundCloudEvidencePage[]).reduce((pages, page) => {
    const target = page === 'wav' ? 'WAV' : page === 'mp3' ? 'MP3' : 'Playlist'
    const description = page === 'playlist' ? `${name} — ${phrases.playlist}` : `${name} — ${target}. ${phrases.prepare}`
    pages[page] = { metadataTitle: `${name} ${target}`, metadataDescription: description, pageTitle: `${name} ${target}`, heroDescription: description, badgeLabel: prepare, formTitle: prepare, relatedToolText: name, relatedToolLabel: open, directAnswer: phrases.prepare, facts: [phrases.formats, phrases.server, phrases.progress], steps: [step1, step2, step3], limits: [limit1, limit2, limit3] }
    return pages
  }, {} as Record<SoundCloudEvidencePage, SoundCloudPageCopy>)
}

export function getSoundCloudSectionCopy(locale: string) {
  return additionalSectionCopy[locale] ?? soundCloudSectionCopy[locale] ?? soundCloudSectionCopy.en
}

export function getSoundCloudPageCopy(page: SoundCloudEvidencePage, locale: string) {
  return (additionalPageCopy[locale] ?? copyByLocale[locale] ?? copyByLocale.en)[page]
}
