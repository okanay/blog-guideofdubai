import { BarChart2, BookOpen, Globe, Info } from "lucide-react";
import { useState } from "react";
import RichButtonModal from "../tiptap/menu/ui/modal";
import { useTiptapContext } from "../tiptap/store";
import { DEFAULT_LANGUAGE } from "@/i18n/config";

// ------------------------
// TİP TANIMLARI
// ------------------------

// Analiz türleri
export type AnalysisType = "seo" | "readability" | "rulesExplanation"; // Yeni sekme eklendi

// Ölçüm derecesi
type ScoreLevel = "good" | "ok" | "bad" | "na";

// Tek bir kontrol sonucu
interface AnalysisCheck {
  id: string;
  score: ScoreLevel;
  text: string;
  impact: "high" | "medium" | "low";
  description?: string;
  suggestions?: string[];
}

// SEO Kuralları
interface SEORules {
  TITLE_LENGTH: { min: number; max: number };
  META_DESC_LENGTH: { min: number; max: number };
  H1_COUNT: number;
  CONTENT_LENGTH_MIN: number;
  SLUG_MAX: number;
  READABILITY_FLESCH_MIN: number;
  PARAGRAPH_MAX_LENGTH: number;
  SENTENCE_MAX_LENGTH: number;
  CONSECUTIVE_SENTENCES_MAX: number;
  PASSIVE_VOICE_MAX_PERCENTAGE: number;
  TRANSITION_WORDS_MIN_PERCENTAGE: number;
  IMAGE_ALT_REQUIRED: boolean;
  INTERNAL_LINKS_MIN: number;
  EXTERNAL_LINKS_MIN: number;
}

// Sonuç tipleri
interface ContentStats {
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  headingCounts: Record<string, number>;
  averageSentenceLength: number;
  passiveVoicePercentage: number;
  transitionWordsPercentage: number;
  fleschReadingEase: number;
  imagesWithAltText: number;
  imagesWithoutAltText: number;
  internalLinksCount: number;
  externalLinksCount: number;
}

// Analiz sonuçları
interface AnalysisResult {
  overallScore: number;
  readabilityScore: number;
  seoScore: number;
  contentStats: ContentStats;
  readabilityChecks: AnalysisCheck[];
  seoChecks: AnalysisCheck[];
  improvements: string[];
  language: Language;
}

// Arayüz props'ları
interface SEOAnalyzerProps {
  getValues: () => any;
  language?: Language;
}

// ------------------------
// VARSAYILAN KURALLAR
// ------------------------

interface RuleInfo {
  title: string;
  description: string;
  currentValue?: string;
}

const RULE_EXPLANATIONS: Record<
  keyof SEORules,
  Omit<RuleInfo, "currentValue">
> = {
  TITLE_LENGTH: {
    title: "Başlık Uzunluğu",
    description:
      "Sayfa başlığınızın arama motoru sonuçlarında (SERP) tam olarak görünmesi ve tıklanma oranını (CTR) optimize etmesi için ideal karakter aralığıdır. Çok kısa başlıklar yeterli bilgi vermezken, çok uzun başlıklar kesilebilir.",
  },
  META_DESC_LENGTH: {
    title: "Meta Açıklama Uzunluğu",
    description:
      "Meta açıklama, SERP'te başlığın altında görünen kısa özettir. Kullanıcıları tıklamaya teşvik etmeli ve sayfa içeriği hakkında fikir vermelidir. İdeal uzunluk, kesilmeden tam olarak görünmesini sağlar.",
  },
  H1_COUNT: {
    title: "H1 Başlık Sayısı",
    description:
      "Her sayfada yalnızca bir adet H1 başlığı olmalıdır. H1, sayfanın ana konusunu en net şekilde ifade eden başlık olmalıdır ve SEO için önemlidir.",
  },
  CONTENT_LENGTH_MIN: {
    title: "Minimum İçerik Uzunluğu",
    description:
      "İçeriğinizin belirli bir konuda yeterli derinliğe ve kapsamlılığa sahip olduğunu göstermesi açısından minimum bir kelime sayısı hedeflenir. Ancak kalite her zaman nicelikten önemlidir.",
  },
  SLUG_MAX: {
    title: "URL (Slug) Maksimum Uzunluğu",
    description:
      "Kısa, açıklayıcı ve anahtar kelimeleri içeren URL'ler hem kullanıcılar hem de arama motorları için daha iyidir. Çok uzun URL'ler okunaksız olabilir.",
  },
  READABILITY_FLESCH_MIN: {
    title: "Minimum Okunabilirlik Skoru (Flesch)",
    description:
      "Flesch Okuma Kolaylığı skoru, metninizin ne kadar kolay anlaşılabildiğini ölçer. Yüksek skorlar, daha geniş bir kitlenin içeriğinizi rahatça okuyabileceği anlamına gelir. Hedef kitleye göre ideal skor değişebilir. Formül: a - b * (hece/kelime) - c * (kelime/cümle)",
  },
  PARAGRAPH_MAX_LENGTH: {
    title: "Maksimum Paragraf Uzunluğu",
    description:
      "Kısa paragraflar (genellikle 3-5 cümle) metnin okunmasını ve özellikle mobil cihazlarda taranmasını kolaylaştırır. Uzun paragraflar okuyucuyu yorabilir.",
  },
  SENTENCE_MAX_LENGTH: {
    title: "Maksimum Cümle Uzunluğu",
    description:
      "Kısa ve net cümleler, içeriğin anlaşılırlığını artırır. Uzun ve karmaşık cümlelerden kaçınmak, okunabilirliği olumlu etkiler.",
  },
  CONSECUTIVE_SENTENCES_MAX: {
    title: "Ardışık Aynı Başlayan Cümleler",
    description:
      "Art arda aynı kelime veya ifadeyle başlayan cümleler metni monoton hale getirir ve okuyucunun ilgisini azaltır. Cümle başlangıçlarında çeşitlilik önemlidir.",
  },
  PASSIVE_VOICE_MAX_PERCENTAGE: {
    title: "Maksimum Edilgen Çatı Yüzdesi",
    description:
      "Etken (aktif) cümleler genellikle daha doğrudan, güçlü ve anlaşılırdır. Edilgen (pasif) çatı kullanımı, metni gereksiz yere karmaşıklaştırabilir. Düşük bir yüzde hedeflenmelidir.",
  },
  TRANSITION_WORDS_MIN_PERCENTAGE: {
    title: "Minimum Geçiş Kelimesi Yüzdesi",
    description:
      "Geçiş kelimeleri ve ifadeleri (örneğin; ancak, bu nedenle, ek olarak), cümleler ve paragraflar arasında mantıksal bağlantılar kurarak metnin akıcılığını artırır.",
  },
  IMAGE_ALT_REQUIRED: {
    title: "Görsel Alt Etiketi Zorunluluğu",
    description:
      "Tüm anlamlı görsellerde alt etiketi (alt text) bulunmalıdır. Alt etiketleri, görselin içeriğini arama motorlarına ve ekran okuyucu kullanan görme engelli kullanıcılara açıklar. SEO ve erişilebilirlik için kritiktir.",
  },
  INTERNAL_LINKS_MIN: {
    title: "Minimum İç Bağlantı Sayısı",
    description:
      "İç bağlantılar, sitenizdeki diğer alakalı sayfalara verilen linklerdir. Kullanıcıların sitede gezinmesine yardımcı olur, sayfa otoritesini dağıtır ve arama motorlarının sitenizin yapısını anlamasını kolaylaştırır.",
  },
  EXTERNAL_LINKS_MIN: {
    title: "Minimum Dış Bağlantı Sayısı",
    description:
      "Güvenilir ve otoriter dış kaynaklara bağlantı vermek, içeriğinizin güvenilirliğini artırabilir ve konunuz hakkında ek bilgi sağlayabilir. Ancak bağlantıların kalitesi, sayısından daha önemlidir.",
  },
};

const RULES: SEORules = {
  TITLE_LENGTH: { min: 55, max: 70 },
  META_DESC_LENGTH: { min: 120, max: 160 },
  H1_COUNT: 1,
  CONTENT_LENGTH_MIN: 300,
  SLUG_MAX: 75,
  READABILITY_FLESCH_MIN: 65,
  PARAGRAPH_MAX_LENGTH: 150,
  SENTENCE_MAX_LENGTH: 20,
  CONSECUTIVE_SENTENCES_MAX: 3,
  PASSIVE_VOICE_MAX_PERCENTAGE: 10,
  TRANSITION_WORDS_MIN_PERCENTAGE: 30,
  IMAGE_ALT_REQUIRED: true,
  INTERNAL_LINKS_MIN: 2,
  EXTERNAL_LINKS_MIN: 1,
};

const RULES_BY_LANGUAGE: Record<string, SEORules> = {
  tr: RULES,
  en: RULES,
  ar: RULES,
  de: RULES,
  fr: RULES,
  ru: RULES,
};

const TRANSITION_PATTERNS: Record<string, RegExp[]> = {
  en: [
    /\b(furthermore|moreover|however|therefore|thus|for example|firstly|finally|and|or|because|since|as|although|when|after|before)\b/i,
    /\b(similarly|likewise|in contrast|conversely|on the other hand|initially|subsequently|meanwhile|eventually)\b/i,
  ],
  tr: [
    /\b(ayrıca|ek olarak|öte yandan|sonuç olarak|bu nedenle|ancak|fakat|örneğin|ilk olarak|son olarak|ve|veya|ile|çünkü|ama|dolayısıyla|böylece)\b/i,
    /\b(benzer şekilde|aynı zamanda|aksine|kıyasla|öncelikle|ardından|daha sonra|geçmişte|günümüzde|gelecekte)\b/i,
  ],
  ar: [
    /\b(علاوة على ذلك|أيضًا|مع ذلك|لذلك|وبالتالي|على سبيل المثال|أولاً|أخيرًا|و|أو|لأن|منذ|كما|رغم أن|عندما|بعد|قبل)\b/i,
    /\b(بالمثل|على النقيض|بالعكس|من ناحية أخرى|في البداية|لاحقًا|في غضون ذلك|في النهاية)\b/i,
  ],
  de: [
    /\b(außerdem|ferner|jedoch|deshalb|somit|zum Beispiel|erstens|schließlich|und|oder|weil|da|obwohl|wenn|nach|bevor)\b/i,
    /\b(ähnlich|gleichermaßen|im Gegensatz|umgekehrt|andererseits|zunächst|anschließend|währenddessen|letztendlich)\b/i,
  ],
  fr: [
    /\b(de plus|cependant|donc|ainsi|par exemple|tout d'abord|enfin|et|ou|parce que|puisque|comme|bien que|quand|après|avant)\b/i,
    /\b(similairement|de même|en revanche|inversement|d'autre part|initialement|subséquemment|pendant ce temps|finalement)\b/i,
  ],
  ru: [
    /\b(кроме того|более того|однако|поэтому|таким образом|например|во-первых|наконец|и|или|потому что|так как|хотя|когда|после|до)\b/iu,
    /\b(аналогично|также|напротив|обратно|с другой стороны|изначально|впоследствии|между тем|в конце концов)\b/iu,
  ],
};

function checkTransitionWords(text: string, language: Language = "en"): number {
  if (!text || text.trim() === "") return 0;

  // Dil için kalıpları seç, yoksa İngilizce kullan
  const patterns = TRANSITION_PATTERNS[language] || TRANSITION_PATTERNS.en;

  // Cümleleri ayır
  const sentences = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (sentences.length === 0) return 0;

  // Geçiş kelimesi içeren cümle sayısı
  let sentencesWithTransition = 0;

  sentences.forEach((sentence) => {
    if (patterns.some((pattern) => pattern.test(sentence))) {
      sentencesWithTransition++;
    }
  });

  // Yüzde hesapla
  return (sentencesWithTransition / sentences.length) * 100;
}

function countSyllables(text: string, language: Language = "en"): number {
  if (!text || text.trim() === "") return 0;

  // Metni temizle ve kelimeleri ayır
  const cleanText = text.replace(
    /[0-9.,;:!?()[\]{}'"\/\\<>@#$%^&*_+=|~`-]/g,
    " ",
  );
  const words = cleanText.toLowerCase().split(/\s+/).filter(Boolean);

  let totalSyllables = 0;

  // Dile göre farklı hece hesaplama stratejileri
  if (language === "tr") {
    // Türkçe için sesli harf sayma
    words.forEach((word) => {
      const vowels = word.match(/[aeıioöuü]/g) || [];
      let count = vowels.length;

      // Yan yana sesli harfler için düzeltme
      let dipthongs = 0;
      for (let i = 1; i < word.length; i++) {
        if (/[aeıioöuü]/.test(word[i]) && /[aeıioöuü]/.test(word[i - 1])) {
          dipthongs++;
        }
      }

      count = Math.max(1, Math.round(count - dipthongs * 0.5));
      totalSyllables += count;
    });
  } else {
    // Diğer diller için basitleştirilmiş yaklaşım
    words.forEach((word) => {
      // İngilizce ve diğer diller için basit hece tespiti
      const vowelGroups = word.match(/[aeiouy]+/g) || [];
      const count = Math.max(1, vowelGroups.length);
      totalSyllables += count;
    });
  }

  return totalSyllables;
}

function detectPassiveVoice(text: string, language: Language = "en"): number {
  if (!text || text.trim() === "") return 0;

  // Cümleleri ayır
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  if (sentences.length === 0) return 0;

  let passiveCount = 0;

  // Dile göre edilgen yapı kalıpları
  const passivePatterns: Record<string, RegExp> = {
    tr: /[a-zçğıöşü]+[ıiuü]l[dmnsyz]*[ıiuü]*[şkz]?/gi,
    en: /\b(am|is|are|was|were|be|been|being)\s+([a-z]+ed|[a-z]+en)\b/gi,
    ar: /(يُ|تُ)[\u0621-\u064A]+|[\u0621-\u064A]+ون\b/gu,
    de: /\b(wird|werden|wurde|wurden|worden|ist|sind|war|waren)\b\s+([a-zäöüß]+ge[a-zäöüß]+(t|en))\b/gi,
    fr: /\b(est|sont|été|était|sera|serait)\b\s+([a-zéèêëîïôöûüç]+[éei]s?)\b/gi,
    ru: /(\bбыл[аи]?|были|будет|будут\b\s+[а-яё]+[нт][а-яё]*)|[а-яё]+ся\b/giu,
  };

  // Dil için uygun kalıbı seç, yoksa İngilizce kullan
  const pattern = passivePatterns[language] || passivePatterns.en;

  // Cümleleri kontrol et
  sentences.forEach((sentence) => {
    if (pattern.test(sentence)) {
      passiveCount++;
    }
  });

  return (passiveCount / sentences.length) * 100;
}

function calculateFleschReadingEase(
  sentenceCount: number,
  wordCount: number,
  syllableCount: number,
  language: string = "en",
): number {
  if (sentenceCount === 0 || wordCount === 0 || syllableCount === 0) return 0; // Sıfıra bölme hatasını önlemek için hece kontrolü eklendi.

  // Formül: a - b * (hece/kelime) - c * (kelime/cümle)
  const coefficients: Record<
    string,
    { a: number; b: number; c: number; note?: string }
  > = {
    en: {
      a: 206.835,
      b: 68.6,
      c: 1.015,
    },
    tr: {
      a: 198.825,
      b: 40.175,
      c: 2.61,
    },
    de: {
      a: 180,
      b: 58.5,
      c: 1.0,
    },
    fr: {
      a: 207,
      b: 72.0,
      c: 1.0,
    },
    ru: {
      a: 206.835,
      b: 60.1,
      c: 1.3,
    },
    es: {
      a: 206.835,
      b: 62.3,
      c: 1.0,
    },
    it: {
      a: 217,
      b: 0.6,
      c: 1.3,
    },
    ar: {
      a: 206.835,
      b: 55.0,
      c: 0.85,
    },
  };

  // Dil için katsayıları seç, yoksa İngilizce'yi varsayılan olarak kullan.
  const selectedCoefficients = coefficients[language] || coefficients.en;
  const { a, b, c } = selectedCoefficients;

  const averageWordsPerSentence = wordCount / sentenceCount;
  const averageSyllablesPerWord = syllableCount / wordCount;

  // Flesch formülü uygulaması
  let score = a - b * averageSyllablesPerWord - c * averageWordsPerSentence;

  // Skor genellikle 0-100 arasında yorumlanır, ancak formül bu sınırların dışına çıkabilir.
  // İsteğe bağlı: skoru 0-100 aralığına sabitlemek için:
  // score = Math.max(0, Math.min(100, score));

  return score;
}

// ------------------------
// YARDIMCI FONKSİYONLAR
// ------------------------

function extractPlainTextFromHTML(html: string): string {
  // Geçici bir div oluşturup HTML'i yerleştir
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  // Tüm metin içeriğini al (tüm HTML etiketleri kaldırılır)
  const plainText = tempDiv.textContent || tempDiv.innerText || "";

  return plainText.trim();
}

// Güncellenmiş ContentStats hesaplama fonksiyonu
function calculateContentStats(
  doc: Document,
  text: string,
  values: any,
  language: Language,
): ContentStats {
  // HTML dokümanı parçala
  const h1s = doc.querySelectorAll("h1");
  const h2s = doc.querySelectorAll("h2");
  const h3s = doc.querySelectorAll("h3");
  const h4s = doc.querySelectorAll("h4");
  const h5s = doc.querySelectorAll("h5");
  const h6s = doc.querySelectorAll("h6");
  const imgs = doc.querySelectorAll("img");
  const paragraphs = doc.querySelectorAll("p");

  // Linkleri analiz et
  const links = doc.querySelectorAll("a");
  const siteUrl =
    import.meta.env.VITE_APP_CANONICAL_URL || window.location.origin;

  let internalLinksCount = 0;
  let externalLinksCount = 0;

  links.forEach((a) => {
    const href = a.getAttribute("href") || "";
    if (href.startsWith("/") || href.includes(siteUrl)) {
      internalLinksCount++;
    } else if (href.startsWith("http")) {
      externalLinksCount++;
    }
  });

  // Alt etiketi kontrolü
  const imgAltTags = checkImageAltTags(imgs);

  // Metni tam olarak çıkar - HTML elementlerini temizle
  const plainText = extractPlainTextFromHTML(text);

  // Metin analizleri
  const words = plainText
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
  const sentences = plainText
    .split(/[.!?]+/)
    .filter((s) => s.trim().length > 0);
  const syllableCount = countSyllables(plainText, language);

  // Okunabilirlik hesaplamaları
  const passiveVoicePercentage = detectPassiveVoice(plainText, language);
  const transitionWordsPercentage = checkTransitionWords(plainText, language);
  const fleschReadingEase = calculateFleschReadingEase(
    sentences.length,
    words.length,
    syllableCount,
    language,
  );

  return {
    wordCount: words.length,
    sentenceCount: sentences.length,
    paragraphCount: paragraphs.length,
    headingCounts: {
      h1: h1s.length,
      h2: h2s.length,
      h3: h3s.length,
      h4: h4s.length,
      h5: h5s.length,
      h6: h6s.length,
    },
    averageSentenceLength:
      sentences.length > 0 ? words.length / sentences.length : 0,
    passiveVoicePercentage,
    transitionWordsPercentage,
    fleschReadingEase,
    imagesWithAltText: imgs.length - imgAltTags.totalIssues,
    imagesWithoutAltText: imgAltTags.totalIssues,
    internalLinksCount,
    externalLinksCount,
  };
}

// Görsel alt etiketlerini kontrol et
function checkImageAltTags(images: NodeListOf<Element>): {
  imagesWithoutAlt: number;
  imagesWithEmptyAlt: number;
  totalIssues: number;
} {
  let imagesWithoutAlt = 0;
  let imagesWithEmptyAlt = 0;

  images.forEach((img) => {
    const alt = img.getAttribute("alt");
    if (alt === null) {
      imagesWithoutAlt++;
    } else if (alt.trim() === "") {
      imagesWithEmptyAlt++;
    }
  });

  return {
    imagesWithoutAlt,
    imagesWithEmptyAlt,
    totalIssues: imagesWithoutAlt + imagesWithEmptyAlt,
  };
}

// Okunabilirlik kontrollerini oluştur
function createReadabilityChecks(
  stats: ContentStats,
  rules: SEORules,
  language: Language,
): AnalysisCheck[] {
  const checks: AnalysisCheck[] = [];

  // Flesch Reading Ease skoru
  checks.push({
    id: "flesch-reading-ease",
    score:
      stats.fleschReadingEase >= rules.READABILITY_FLESCH_MIN
        ? "good"
        : stats.fleschReadingEase >= rules.READABILITY_FLESCH_MIN * 0.8
          ? "ok"
          : "bad",
    text: `Okunabilirlik skoru: ${Math.round(stats.fleschReadingEase)}`,
    impact: "high",
    description:
      "Yüksek okunabilirlik skoru, içeriğinizin daha kolay anlaşılabilir olduğunu gösterir.",
    suggestions:
      stats.fleschReadingEase < rules.READABILITY_FLESCH_MIN
        ? [
            "Daha kısa cümleler kullanın",
            "Karmaşık kelimeleri daha basit olanlarla değiştirin",
            "Paragraflarınızı kısaltın",
          ]
        : [],
  });

  // Ortalama cümle uzunluğu
  checks.push({
    id: "sentence-length",
    score:
      stats.averageSentenceLength <= rules.SENTENCE_MAX_LENGTH
        ? "good"
        : stats.averageSentenceLength <= rules.SENTENCE_MAX_LENGTH * 1.2
          ? "ok"
          : "bad",
    text: `Ortalama cümle uzunluğu: ${Math.round(stats.averageSentenceLength)} kelime`,
    impact: "medium",
    description: "Kısa cümleler genellikle daha kolay anlaşılır.",
    suggestions:
      stats.averageSentenceLength > rules.SENTENCE_MAX_LENGTH
        ? [
            "Uzun cümleleri birkaç kısa cümleye bölün",
            "Karmaşık noktalama yerine daha basit cümle yapıları kullanın",
          ]
        : [],
  });

  // Paragraf uzunluğu kontrolü
  // Basitleştirilmiş: Gerçekte her paragrafı ayrı ayrı kontrol etmek daha doğru olur
  checks.push({
    id: "paragraph-length",
    score:
      stats.wordCount / stats.paragraphCount <= rules.PARAGRAPH_MAX_LENGTH
        ? "good"
        : stats.wordCount / stats.paragraphCount <=
            rules.PARAGRAPH_MAX_LENGTH * 1.2
          ? "ok"
          : "bad",
    text: `Ortalama paragraf uzunluğu: ${Math.round(stats.wordCount / stats.paragraphCount)} kelime`,
    impact: "medium",
    description:
      "Kısa paragraflar okuyucunun metni takip etmesini kolaylaştırır.",
    suggestions:
      stats.wordCount / stats.paragraphCount > rules.PARAGRAPH_MAX_LENGTH
        ? [
            "Uzun paragrafları birkaç kısa paragrafa bölün",
            "Bir paragrafta tek bir fikre odaklanın",
          ]
        : [],
  });

  // Edilgen cümle kontrolü
  checks.push({
    id: "passive-voice",
    score:
      stats.passiveVoicePercentage <= rules.PASSIVE_VOICE_MAX_PERCENTAGE
        ? "good"
        : stats.passiveVoicePercentage <=
            rules.PASSIVE_VOICE_MAX_PERCENTAGE * 1.5
          ? "ok"
          : "bad",
    text: `Edilgen cümle kullanımı: %${Math.round(stats.passiveVoicePercentage)}`,
    impact: "low",
    description: "Etken cümleler genellikle daha güçlü ve doğrudan olur.",
    suggestions:
      stats.passiveVoicePercentage > rules.PASSIVE_VOICE_MAX_PERCENTAGE
        ? [
            "Edilgen cümleleri etken cümlelere dönüştürün",
            "Cümlelerinizde özne-yüklem-nesne sırasını koruyun",
          ]
        : [],
  });

  // Geçiş kelimeleri kontrolü
  checks.push({
    id: "transition-words",
    score:
      stats.transitionWordsPercentage >= rules.TRANSITION_WORDS_MIN_PERCENTAGE
        ? "good"
        : stats.transitionWordsPercentage >=
            rules.TRANSITION_WORDS_MIN_PERCENTAGE * 0.7
          ? "ok"
          : "bad",
    text: `Geçiş kelimeleri kullanımı: %${Math.round(stats.transitionWordsPercentage)}`,
    impact: "medium",
    description: "Geçiş kelimeleri metnin akıcılığını ve bağlantısını artırır.",
    suggestions:
      stats.transitionWordsPercentage < rules.TRANSITION_WORDS_MIN_PERCENTAGE
        ? [
            "Cümleler arasında daha fazla bağlayıcı kullanın",
            (() => {
              // language'a göre örnek transition kelimeleri
              const transitionExamples: Record<string, string[]> = {
                tr: ["ayrıca", "öte yandan", "sonuç olarak"],
                en: ["for example", "however", "in addition"],
                ar: ["على سبيل المثال", "مع ذلك", "أيضًا"],
                de: ["zum Beispiel", "jedoch", "außerdem"],
                fr: ["par exemple", "cependant", "de plus"],
                ru: ["например", "однако", "также"],
              };
              const exampleList =
                transitionExamples[language] || transitionExamples["en"];
              return `Fikir geçişlerini belirginleştirmek için ${exampleList
                .map((w) => `"${w}"`)
                .join(", ")} gibi ifadeler ekleyin`;
            })(),
          ]
        : [],
  });

  // Başlık dağılımı kontrolü
  checks.push({
    id: "heading-distribution",
    score:
      stats.headingCounts.h1 === rules.H1_COUNT && stats.headingCounts.h2 > 0
        ? "good"
        : stats.headingCounts.h1 > 0
          ? "ok"
          : "bad",
    text: `Başlık dağılımı: H1: ${stats.headingCounts.h1}, H2: ${stats.headingCounts.h2}, H3: ${stats.headingCounts.h3}`,
    impact: "medium",
    description:
      "İyi bir başlık yapısı içeriğin anlaşılmasını kolaylaştırır ve SEO için önemlidir.",
    suggestions:
      stats.headingCounts.h1 !== rules.H1_COUNT || stats.headingCounts.h2 === 0
        ? [
            "Sayfada tam olarak bir H1 başlığı kullanın",
            "Alt başlıklar (H2, H3) ekleyerek içeriği bölümlere ayırın",
            "Başlık hiyerarşisini düzgün bir şekilde takip edin",
          ]
        : [],
  });

  return checks;
}

// SEO kontrollerini oluştur (anahtar kelime kontrolü olmadan)
function createSEOChecks(
  stats: ContentStats,
  values: any,
  rules: SEORules,
): AnalysisCheck[] {
  const checks: AnalysisCheck[] = [];

  const titleLen = values.metadata?.title?.length || 0;
  const descLen = values.metadata?.description?.length || 0;
  const slugLen = values.slug?.length || 0;

  // SEO başlık uzunluğu
  checks.push({
    id: "title-length",
    score:
      titleLen >= rules.TITLE_LENGTH.min && titleLen <= rules.TITLE_LENGTH.max
        ? "good"
        : titleLen > 0
          ? "ok"
          : "bad",
    text: `SEO Başlık uzunluğu: ${titleLen} karakter`,
    impact: "high",
    description: `SEO başlığı ${rules.TITLE_LENGTH.min}-${rules.TITLE_LENGTH.max} karakter arasında olmalıdır.`,
    suggestions:
      titleLen < rules.TITLE_LENGTH.min
        ? ["Başlığı daha detaylı yapın"]
        : titleLen > rules.TITLE_LENGTH.max
          ? ["Başlığı kısaltın", "Gereksiz kelimeleri çıkarın"]
          : [],
  });

  // Meta açıklama uzunluğu
  checks.push({
    id: "meta-description-length",
    score:
      descLen >= rules.META_DESC_LENGTH.min &&
      descLen <= rules.META_DESC_LENGTH.max
        ? "good"
        : descLen > 0
          ? "ok"
          : "bad",
    text: `Meta açıklama uzunluğu: ${descLen} karakter`,
    impact: "high",
    description: `Meta açıklama ${rules.META_DESC_LENGTH.min}-${rules.META_DESC_LENGTH.max} karakter arasında olmalıdır.`,
    suggestions:
      descLen < rules.META_DESC_LENGTH.min
        ? [
            "Meta açıklamayı daha detaylı yapın",
            "İçeriği özetleyen daha açıklayıcı bir metin yazın",
          ]
        : descLen > rules.META_DESC_LENGTH.max
          ? ["Meta açıklamayı kısaltın", "Gereksiz detayları çıkarın"]
          : [],
  });

  // H1 başlık kontrolü
  checks.push({
    id: "h1-count",
    score:
      stats.headingCounts.h1 === rules.H1_COUNT
        ? "good"
        : stats.headingCounts.h1 > 0
          ? "ok"
          : "bad",
    text: `H1 başlık sayısı: ${stats.headingCounts.h1}`,
    impact: "high",
    description: "Bir sayfada tam olarak bir H1 başlığı olmalıdır.",
    suggestions:
      stats.headingCounts.h1 === 0
        ? ["Sayfaya bir H1 başlığı ekleyin"]
        : stats.headingCounts.h1 > rules.H1_COUNT
          ? [
              "Fazla H1 başlıklarını H2 veya H3 olarak değiştirin",
              "Sayfada tek bir ana H1 başlık kullanın",
            ]
          : [],
  });

  // İçerik uzunluğu kontrolü
  checks.push({
    id: "content-length",
    score:
      stats.wordCount >= rules.CONTENT_LENGTH_MIN
        ? "good"
        : stats.wordCount >= rules.CONTENT_LENGTH_MIN * 0.7
          ? "ok"
          : "bad",
    text: `İçerik uzunluğu: ${stats.wordCount} kelime`,
    impact: "high",
    description: `İçerik en az ${rules.CONTENT_LENGTH_MIN} kelime olmalıdır.`,
    suggestions:
      stats.wordCount < rules.CONTENT_LENGTH_MIN
        ? [
            "İçeriği daha kapsamlı hale getirin",
            "Konuyla ilgili daha fazla detay ekleyin",
            "Alt başlıklar altında daha fazla açıklama yapın",
          ]
        : [],
  });

  // URL uzunluğu kontrolü
  checks.push({
    id: "slug-length",
    score:
      slugLen > 0 && slugLen <= rules.SLUG_MAX
        ? "good"
        : slugLen > rules.SLUG_MAX
          ? "ok"
          : "bad",
    text: `URL uzunluğu: ${slugLen} karakter`,
    impact: "low",
    description: `URL (slug) ${rules.SLUG_MAX} karakterden kısa olmalıdır.`,
    suggestions:
      slugLen === 0
        ? ["URL (slug) alanını doldurun"]
        : slugLen > rules.SLUG_MAX
          ? [
              "URL'yi kısaltın",
              "Gereksiz kelimeleri URL'den çıkarın",
              "Sadece önemli kelimeleri URL'de kullanın",
            ]
          : [],
  });

  // Görsel alt etiketleri kontrolü
  checks.push({
    id: "image-alt-tags",
    score:
      stats.imagesWithoutAltText === 0
        ? "good"
        : stats.imagesWithoutAltText <= Math.max(1, stats.imagesWithAltText / 5)
          ? "ok"
          : "bad",
    text: `Görsel alt etiketleri: ${stats.imagesWithAltText}/${stats.imagesWithAltText + stats.imagesWithoutAltText} görselde alt etiketi var`,
    impact: "medium",
    description: "Tüm görsellerin açıklayıcı alt etiketleri olmalıdır.",
    suggestions:
      stats.imagesWithoutAltText > 0
        ? [
            "Tüm görsellere açıklayıcı alt etiketleri ekleyin",
            "Eksik alt etiketlerini tamamlayın",
          ]
        : [],
  });

  // İç bağlantı kontrolü
  checks.push({
    id: "internal-links",
    score:
      stats.internalLinksCount >= rules.INTERNAL_LINKS_MIN
        ? "good"
        : stats.internalLinksCount > 0
          ? "ok"
          : "bad",
    text: `İç bağlantı sayısı: ${stats.internalLinksCount}`,
    impact: "medium",
    description: `İçerikte en az ${rules.INTERNAL_LINKS_MIN} iç bağlantı olması önerilir.`,
    suggestions:
      stats.internalLinksCount < rules.INTERNAL_LINKS_MIN
        ? [
            "İçeriğe daha fazla iç bağlantı ekleyin",
            "İlgili içeriklere bağlantılar verin",
            "Site içi navigasyonu güçlendirin",
          ]
        : [],
  });

  // Dış bağlantı kontrolü
  checks.push({
    id: "external-links",
    score:
      stats.externalLinksCount >= rules.EXTERNAL_LINKS_MIN
        ? "good"
        : stats.externalLinksCount > 0
          ? "ok"
          : "bad",
    text: `Dış bağlantı sayısı: ${stats.externalLinksCount}`,
    impact: "low",
    description: `İçerikte en az ${rules.EXTERNAL_LINKS_MIN} kaliteli dış bağlantı olması önerilir.`,
    suggestions:
      stats.externalLinksCount < rules.EXTERNAL_LINKS_MIN
        ? [
            "İçeriğe güvenilir kaynaklara dış bağlantılar ekleyin",
            "Konuyla ilgili otorite sitelere referans verin",
          ]
        : [],
  });

  return checks;
}

// İyileştirme önerileri oluştur
function generateImprovements(
  readabilityChecks: AnalysisCheck[],
  seoChecks: AnalysisCheck[],
): string[] {
  const improvements: string[] = [];

  // En önemli iyileştirmeleri önce ekle
  const highImpactImprovements = [
    ...readabilityChecks.filter(
      (check) => check.score === "bad" && check.impact === "high",
    ),
    ...seoChecks.filter(
      (check) => check.score === "bad" && check.impact === "high",
    ),
  ];

  // Orta önemdeki iyileştirmeleri ekle
  const mediumImpactImprovements = [
    ...readabilityChecks.filter(
      (check) => check.score === "bad" && check.impact === "medium",
    ),
    ...seoChecks.filter(
      (check) => check.score === "bad" && check.impact === "medium",
    ),
  ];

  // Düşük önemdeki iyileştirmeleri ekle
  const lowImpactImprovements = [
    ...readabilityChecks.filter(
      (check) => check.score === "bad" && check.impact === "low",
    ),
    ...seoChecks.filter(
      (check) => check.score === "bad" && check.impact === "low",
    ),
  ];

  // Yüksek öncelikli önerileri ekle
  highImpactImprovements.forEach((check) => {
    if (check.suggestions && check.suggestions.length > 0) {
      improvements.push(`[ÖNEMLİ] ${check.text}: ${check.suggestions[0]}`);
    }
  });

  // Orta öncelikli önerileri ekle
  mediumImpactImprovements.forEach((check) => {
    if (check.suggestions && check.suggestions.length > 0) {
      improvements.push(`${check.text}: ${check.suggestions[0]}`);
    }
  });

  // Düşük öncelikli önerileri ekle
  lowImpactImprovements.forEach((check) => {
    if (check.suggestions && check.suggestions.length > 0) {
      improvements.push(`${check.text}: ${check.suggestions[0]}`);
    }
  });

  return improvements;
}

// Puan hesaplama
function calculateScores(
  readabilityChecks: AnalysisCheck[],
  seoChecks: AnalysisCheck[],
): { overallScore: number; readabilityScore: number; seoScore: number } {
  // Ağırlıklı ortalama için ağırlıklar
  const weights = {
    high: 3,
    medium: 2,
    low: 1,
  };

  // Readability skoru hesapla
  let readabilityScore = 0;
  let readabilityTotalWeight = 0;

  readabilityChecks.forEach((check) => {
    if (check.score !== "na") {
      const weight = weights[check.impact];
      readabilityTotalWeight += weight;

      if (check.score === "good") {
        readabilityScore += weight * 100;
      } else if (check.score === "ok") {
        readabilityScore += weight * 70;
      } else if (check.score === "bad") {
        readabilityScore += weight * 30;
      }
    }
  });

  const finalReadabilityScore =
    readabilityTotalWeight > 0
      ? Math.round(readabilityScore / readabilityTotalWeight)
      : 0;

  // SEO skoru hesapla
  let seoScore = 0;
  let seoTotalWeight = 0;

  seoChecks.forEach((check) => {
    if (check.score !== "na") {
      const weight = weights[check.impact];
      seoTotalWeight += weight;

      if (check.score === "good") {
        seoScore += weight * 100;
      } else if (check.score === "ok") {
        seoScore += weight * 70;
      } else if (check.score === "bad") {
        seoScore += weight * 30;
      }
    }
  });

  const finalSeoScore =
    seoTotalWeight > 0 ? Math.round(seoScore / seoTotalWeight) : 0;

  // Genel skor (SEO ve Readability skorlarının ortalaması)
  const overallScore = Math.round((finalReadabilityScore + finalSeoScore) / 2);

  return {
    overallScore,
    readabilityScore: finalReadabilityScore,
    seoScore: finalSeoScore,
  };
}

// SEO analizi yap (anahtar kelime olmadan)
function analyzeSEO(
  editorHTML: string,
  values: any,
  language: Language = "tr",
): AnalysisResult {
  // HTML'i parse et
  const parser = new DOMParser();
  const doc = parser.parseFromString(editorHTML, "text/html");

  // Metin içeriğini al
  const textContent = doc.body.textContent || "";

  // Dil bazlı kuralları belirle
  const rules = RULES_BY_LANGUAGE[language];

  // İçerik istatistiklerini hesapla
  const contentStats = calculateContentStats(
    doc,
    textContent,
    values,
    language,
  );

  // Okunabilirlik kontrollerini oluştur
  const readabilityChecks = createReadabilityChecks(
    contentStats,
    rules,
    language,
  );

  // SEO kontrollerini oluştur
  const seoChecks = createSEOChecks(contentStats, values, rules);

  // Skorları hesapla
  const scores = calculateScores(readabilityChecks, seoChecks);

  // İyileştirme önerilerini oluştur
  const improvements = generateImprovements(readabilityChecks, seoChecks);

  return {
    overallScore: scores.overallScore,
    readabilityScore: scores.readabilityScore,
    seoScore: scores.seoScore,
    contentStats,
    readabilityChecks,
    seoChecks,
    improvements,
    language,
  };
}

// Ana SEO Analizör bileşeni
const SEOAnalyzer: React.FC<SEOAnalyzerProps> = ({
  getValues,
  language = DEFAULT_LANGUAGE,
}) => {
  const { editor } = useTiptapContext();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AnalysisType>("seo");

  // handleAnalyze fonksiyonu
  const handleAnalyze = () => {
    if (!editor) return;

    setLoading(true);
    const values = getValues();

    try {
      const html = editor.getHTML();
      const analysisResult = analyzeSEO(html, values, language);
      setResult(analysisResult);
    } catch (error) {
      console.error("SEO analizi sırasında hata:", error);
      alert("Analiz sırasında bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    handleAnalyze();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Tab değişimini işle
  const handleTabChange = (tab: AnalysisType) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleOpenModal}
            disabled={loading}
            className="bg-primary hover:bg-primary-dark flex items-center gap-1.5 rounded-md px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Analiz Ediliyor...</span>
              </>
            ) : (
              <>
                <BarChart2 size={16} />
                <span>SEO Analizi Yap</span>
              </>
            )}
          </button>

          <div className="flex h-10 items-center gap-1 rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-500">
            <Globe size={12} />
            <span>{language.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {result && (
        <RichButtonModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title="SEO Analiz Raporu"
          maxWidth="max-w-4xl"
        >
          <div className="space-y-6">
            {/* Üst Bölüm - Genel Skor ve Özet */}
            <div className="flex gap-4 overflow-x-auto md:grid md:grid-cols-3">
              {/* Genel Skor */}
              <div className="flex w-full shrink-0 flex-col items-center justify-center rounded-lg bg-gradient-to-r from-zinc-50 to-zinc-100 p-5 text-center shadow">
                <div className="mb-2 flex items-center justify-center">
                  <div
                    className={`flex h-20 w-20 items-center justify-center rounded-full ${getScoreBgColor(result.overallScore)} text-2xl font-bold text-white shadow-lg`}
                  >
                    {result.overallScore}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-zinc-800">
                  {getScoreText(result.overallScore)} SEO
                </h3>
                <p className="mt-1 text-sm text-zinc-600">
                  Genel SEO Performansı
                </p>
              </div>

              {/* Okunabilirlik Skoru */}
              <div className="flex w-full shrink-0 flex-col items-center justify-center rounded-lg bg-gradient-to-r from-zinc-50 to-zinc-100 p-5 text-center shadow">
                <div className="mb-2 flex items-center justify-center">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-full ${getScoreBgColor(result.readabilityScore)} text-xl font-bold text-white shadow-lg`}
                  >
                    {result.readabilityScore}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-zinc-800">
                  {getScoreText(result.readabilityScore)} Okunabilirlik
                </h3>
                <p className="mt-1 text-sm text-zinc-600">
                  İçerik Okuma Kolaylığı
                </p>
              </div>

              {/* SEO Skoru */}
              <div className="flex w-full shrink-0 flex-col items-center justify-center rounded-lg bg-gradient-to-r from-zinc-50 to-zinc-100 p-5 text-center shadow">
                <div className="mb-2 flex items-center justify-center">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-full ${getScoreBgColor(result.seoScore)} text-xl font-bold text-white shadow-lg`}
                  >
                    {result.seoScore}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-zinc-800">
                  {getScoreText(result.seoScore)} SEO Uyumu
                </h3>
                <p className="mt-1 text-sm text-zinc-600">
                  Arama Motoru Optimizasyonu
                </p>
              </div>
            </div>

            {/* Tab Menüsü */}
            <div className="flex overflow-x-auto border-b border-zinc-200">
              <button
                type="button"
                className={`flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-2 text-sm font-medium text-nowrap transition-colors ${
                  activeTab === "seo"
                    ? "text-primary border-primary"
                    : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700"
                }`}
                onClick={() => handleTabChange("seo")}
              >
                <BarChart2 size={16} />
                <span>SEO Analizi</span>
              </button>
              <button
                type="button"
                className={`flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-2 text-sm font-medium text-nowrap transition-colors ${
                  activeTab === "readability"
                    ? "text-primary border-primary"
                    : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700"
                }`}
                onClick={() => handleTabChange("readability")}
              >
                <BookOpen size={16} />
                <span>Okunabilirlik</span>
              </button>
              {/* YENİ SEKME BUTONU */}
              <button
                type="button"
                className={`flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-2 text-sm font-medium text-nowrap transition-colors ${
                  activeTab === "rulesExplanation"
                    ? "text-primary border-primary"
                    : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700"
                }`}
                onClick={() => handleTabChange("rulesExplanation")}
              >
                <Info size={16} /> {/* Info ikonu kullanıldı */}
                <span>Kurallar & İpuçları</span>
              </button>
            </div>

            {/* Tab İçeriği */}
            <div className="min-h-[300px]">
              {activeTab === "seo" && result.seoChecks && (
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-zinc-800">
                    SEO Kontrolleri
                  </h4>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {result.seoChecks
                      .filter((check) => check.score !== "na")
                      .map((check) => (
                        <CheckCard key={check.id} check={check} />
                      ))}
                  </div>
                </div>
              )}
              {activeTab === "readability" && result.readabilityChecks && (
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-zinc-800">
                    Okunabilirlik Kontrolleri
                  </h4>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {result.readabilityChecks
                      .filter((check) => check.score !== "na")
                      .map((check) => (
                        <CheckCard key={check.id} check={check} />
                      ))}
                  </div>
                </div>
              )}
              {/* YENİ SEKME İÇERİĞİ */}
              {activeTab === "rulesExplanation" && (
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-zinc-800">
                    SEO ve Okunabilirlik Kuralları: Neden Önemliler?
                  </h4>
                  <div className="space-y-4">
                    {(Object.keys(RULES) as Array<keyof SEORules>).map(
                      (ruleKey) => {
                        const ruleInfo = RULE_EXPLANATIONS[ruleKey];
                        const currentValue = formatRuleValue(ruleKey);
                        if (!ruleInfo) return null;

                        return (
                          <div
                            key={ruleKey}
                            className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
                          >
                            <h5 className="text-md text-primary mb-1 font-semibold">
                              {ruleInfo.title}
                            </h5>
                            <p className="mb-2 text-sm text-zinc-500">
                              <span className="font-medium">Hedef Değer :</span>{" "}
                              <span className="font-semibold text-zinc-800">
                                {currentValue}
                              </span>
                            </p>
                            <p className="text-sm text-zinc-700">
                              {ruleInfo.description}
                            </p>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Kapat Butonu */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleCloseModal}
                className="bg-primary hover:bg-primary-dark rounded-md px-5 py-2 text-sm font-semibold text-white shadow transition"
              >
                Kapat
              </button>
            </div>
          </div>
        </RichButtonModal>
      )}
    </div>
  );
};

// Kontrol kartı bileşeni
interface CheckCardProps {
  check: AnalysisCheck;
}

const CheckCard: React.FC<CheckCardProps> = ({ check }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Score (başarı) durumları için daha açıklayıcı isimler
  const scoreTexts = {
    good: "Başarılı",
    ok: "Yeterli",
    bad: "Yetersiz",
    na: "Uygulanmaz",
  };

  // Etki seviyeleri için daha açıklayıcı etiketler
  const impactTexts = {
    high: "Kritik Faktör",
    medium: "Önemli Faktör",
    low: "Düşük Faktör",
  };

  // Başarı durumları için renkler
  const scoreColors = {
    good: "bg-emerald-50 text-emerald-800 border-emerald-200 shadow-sm",
    ok: "bg-amber-50 text-amber-700 border-amber-200 shadow-sm",
    bad: "bg-orange-50 text-orange-700 border-orange-200 shadow-sm",
    na: "bg-slate-50 text-slate-600 border-slate-200",
  };

  // Etki seviyeleri için rozetler
  const impactBadges = {
    high: "bg-indigo-50 text-indigo-700 border border-indigo-200",
    medium: "bg-sky-50 text-sky-700 border border-sky-200",
    low: "bg-slate-50 text-slate-600 border border-slate-200",
  };

  // Başarı için ikonlar
  const scoreIcons = {
    good: "✓",
    ok: "⚠️",
    bad: "⚡",
    na: "ℹ️",
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`rounded-lg border p-4 transition-all hover:shadow-md ${
        scoreColors[check.score]
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            {/* Etki rozeti */}
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                impactBadges[check.impact]
              }`}
            >
              {impactTexts[check.impact]}
            </span>

            {/* Skor etiketi */}
            <span
              className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
                check.score === "good"
                  ? "bg-emerald-100 text-emerald-700"
                  : check.score === "ok"
                    ? "bg-amber-100 text-amber-700"
                    : check.score === "bad"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-slate-100 text-slate-700"
              }`}
            >
              <span>{scoreIcons[check.score]}</span>
              <span>{scoreTexts[check.score]}</span>
            </span>
          </div>

          {/* Ana metin - skor durumuna göre stil */}
          <div
            className={`text-sm ${
              check.score === "good"
                ? "font-medium text-emerald-900"
                : check.score === "ok"
                  ? "font-medium text-amber-900"
                  : check.score === "bad"
                    ? "font-medium text-orange-900"
                    : "font-normal text-slate-700"
            }`}
          >
            {check.text}
          </div>
        </div>

        {/* Detaylar butonu - daha görünür hale getirelim */}
        <button
          type="button"
          onClick={handleToggleExpand}
          className={`ml-2 flex h-7 w-7 items-center justify-center rounded-full p-1 transition-colors ${
            isExpanded
              ? "bg-slate-200 text-slate-700"
              : "bg-white/70 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          } ${
            check.description ||
            (check.suggestions && check.suggestions.length > 0)
              ? "opacity-100"
              : "opacity-50"
          }`}
          disabled={
            !check.description &&
            (!check.suggestions || check.suggestions.length === 0)
          }
          title={isExpanded ? "Detayları gizle" : "Detayları göster"}
        >
          <Info size={16} />
        </button>
      </div>

      {/* Genişletilmiş detaylar kısmı */}
      {isExpanded && (
        <div
          className={`mt-3 space-y-3 border-t pt-3 text-sm ${
            check.score === "good"
              ? "border-emerald-200/70"
              : check.score === "ok"
                ? "border-amber-200/70"
                : check.score === "bad"
                  ? "border-orange-200/70"
                  : "border-slate-200/70"
          }`}
        >
          {check.description && (
            <p className="text-slate-700">{check.description}</p>
          )}

          {check.suggestions && check.suggestions.length > 0 && (
            <div>
              <p className="mb-1.5 font-medium text-slate-800">Öneriler:</p>
              <ul className="list-disc space-y-1.5 pl-5">
                {check.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-slate-700">
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Puana göre arkaplan rengi belirle
function getScoreBgColor(score: number): string {
  if (score >= 80) return "bg-green-500";
  if (score >= 70) return "bg-amber-500";
  if (score >= 50) return "bg-orange-500";
  return "bg-red-600";
}

// Puana göre metin belirle
function getScoreText(score: number): string {
  if (score >= 80) return "Mükemmel";
  if (score >= 70) return "İyi";
  if (score >= 50) return "Geliştirilmeli";
  return "Yetersiz";
}

const formatRuleValue = (ruleKey: keyof SEORules): string => {
  const rule = RULES[ruleKey];
  if (typeof rule === "number") {
    return rule.toString();
  }
  if (typeof rule === "boolean") {
    return rule ? "Evet" : "Hayır";
  }
  if (
    typeof rule === "object" &&
    rule !== null &&
    "min" in rule &&
    "max" in rule
  ) {
    return `${rule.min} - ${rule.max}`;
  }
  // Diğer özel durumlar için (örn. PERCENTAGE, MIN)
  if (
    ruleKey === "CONTENT_LENGTH_MIN" ||
    ruleKey === "READABILITY_FLESCH_MIN" ||
    ruleKey === "INTERNAL_LINKS_MIN" ||
    ruleKey === "EXTERNAL_LINKS_MIN"
  ) {
    return `Minimum ${rule}`;
  }
  if (
    ruleKey === "PASSIVE_VOICE_MAX_PERCENTAGE" ||
    ruleKey === "TRANSITION_WORDS_MIN_PERCENTAGE"
  ) {
    const value = rule as any; // type assertion
    return ruleKey === "PASSIVE_VOICE_MAX_PERCENTAGE"
      ? `Maksimum %${value}`
      : `Minimum %${value}`;
  }
  if (
    ruleKey === "SLUG_MAX" ||
    ruleKey === "PARAGRAPH_MAX_LENGTH" ||
    ruleKey === "SENTENCE_MAX_LENGTH" ||
    ruleKey === "CONSECUTIVE_SENTENCES_MAX"
  ) {
    return `Maksimum ${rule}`;
  }
  return "Belirtilmemiş";
};

export default SEOAnalyzer;
