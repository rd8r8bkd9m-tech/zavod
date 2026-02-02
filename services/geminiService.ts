
import { GoogleGenAI, Type } from "@google/genai";
import { ContentItem, ContentStatus, Platform, GenerationRequest, BrandProfile } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY || '';
  if (!apiKey) {
    console.warn("API Key is missing. AI features will be simulated.");
  }
  return new GoogleGenAI({ apiKey });
};

// Extended interface to include brand context
export interface ExtendedGenerationRequest extends GenerationRequest {
  brandProfile?: BrandProfile;
  sourceContent?: string; // Optional source text (e.g., from a video transcript or existing idea)
}

export const generateContentBatch = async (request: ExtendedGenerationRequest): Promise<ContentItem[]> => {
  const ai = getClient();
  
  if (!process.env.API_KEY) {
    return simulateGeneration(request);
  }

  const model = "gemini-3-flash-preview";
  
  // Construct a rich brand context string
  const brandContext = request.brandProfile ? `
    КОНТЕКСТ БРЕНДА:
    - Компания: ${request.brandProfile.companyName}
    - Описание: ${request.brandProfile.description}
    - Целевая аудитория: ${request.brandProfile.targetAudience}
    - Уникальное Торговое Предложение (USP): ${request.brandProfile.usp}
    - Tone of Voice: ${request.brandProfile.toneOfVoice}
    - Ссылка: ${request.brandProfile.websiteUrl}
    ${request.brandProfile.forbiddenWords ? `- ЗАПРЕЩЕННЫЕ СЛОВА: ${request.brandProfile.forbiddenWords}` : ''}
  ` : "Контекст бренда не задан. Действуй как эксперт широкого профиля.";

  const systemInstruction = `Вы — ведущий стратег контент-маркетинга.
  Ваша задача: генерировать контент, который продает и вовлекает, СТРОГО следуя контексту бренда.
  
  Принципы работы по платформам:
  1. **Dzen (Яндекс.Дзен)**: Лонгриды, структурированные статьи, заголовки с интригой (Clickbait-lite), Markdown разметка.
  2. **Telegram**: Личный тон, короткие абзацы, emoji как буллиты, четкий CTA.
  3. **VK & OK**: Дружелюбный, "народный" стиль. Для VK — опросы и вовлечение. Для OK — душевность и визуальные описания.
  4. **YouTube & RuTube**: Это описание к видео. SEO-оптимизированный заголовок, таймкоды (симуляция), хештеги.
  5. **Twitter (X)**: Тред (серия твитов) или короткий панчлайн до 280 символов.
  6. **Instagram**: Визуальный сторителлинг, разделение на абзацы, блок хештегов внизу.
  7. **VC.ru**: Деловой стиль, инсайты, цифры.
  
  ОБЯЗАТЕЛЬНО: Если предоставлен ИСХОДНЫЙ МАТЕРИАЛ (sourceContent), весь контент должен быть основан на нём. Переупаковывай смыслы источника под разные форматы.
  Формат вывода: Строго JSON массив.`;

  const prompt = `
    ВХОДНЫЕ ДАННЫЕ:
    ----------------
    ТЕМА/СУТЬ: ${request.topic}
    ${request.sourceContent ? `ИСХОДНЫЙ МАТЕРИАЛ (Транскрипт/Анализ): ${request.sourceContent}` : ''}
    ТОНАЛЬНОСТЬ: ${request.tone} (Приоритет: ${request.brandProfile?.toneOfVoice || 'Не задан'})
    ПЛАТФОРМЫ: ${request.platforms.join(', ')}
    
    ${brandContext}
    ----------------

    ЗАДАЧА:
    Создай ${request.platforms.length} уникальных единиц контента.
    Адаптируй формат под каждую соцсеть.
    
    Язык: Русский.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              platform: { type: Type.STRING },
              title: { type: Type.STRING },
              body: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["platform", "title", "body", "tags"]
          }
        }
      }
    });

    const generatedData = JSON.parse(response.text || '[]');

    return generatedData.map((item: any) => ({
      id: crypto.randomUUID(),
      title: item.title,
      body: item.body,
      platform: mapStringToPlatform(item.platform),
      status: ContentStatus.DRAFT,
      createdAt: new Date().toISOString(),
      tags: item.tags || [],
      campaignId: request.campaignId
    }));

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate content via Gemini.");
  }
};

const mapStringToPlatform = (str: string): Platform => {
  const s = str.toLowerCase();
  if (s.includes('dzen') || s.includes('дзен')) return Platform.DZEN;
  if (s.includes('youtube') || s.includes('ютуб')) return Platform.YOUTUBE;
  if (s.includes('rutube') || s.includes('рутуб')) return Platform.RUTUBE;
  if (s.includes('twitter') || s.includes('x') || s.includes('твиттер')) return Platform.TWITTER;
  if (s.includes('facebook') || s.includes('фейсбук')) return Platform.FACEBOOK;
  if (s.includes('ok') || s.includes('одноклассники')) return Platform.OK;
  if (s.includes('telegram') || s.includes('телеграм')) return Platform.TELEGRAM;
  if (s.includes('vk') || s.includes('вконтакте')) return Platform.VK;
  if (s.includes('tenchat') || s.includes('тенчат')) return Platform.TENCHAT;
  if (s.includes('vc')) return Platform.VC;
  if (s.includes('instagram') || s.includes('инста')) return Platform.INSTAGRAM;
  if (s.includes('linked')) return Platform.LINKEDIN;
  return Platform.TELEGRAM; // Default fallback
};

const simulateGeneration = async (request: ExtendedGenerationRequest): Promise<ContentItem[]> => {
  await new Promise(resolve => setTimeout(resolve, 3000)); 
  
  const isRepurpose = !!request.sourceContent;

  return request.platforms.map(p => {
    let title = isRepurpose ? `Разбор: ${request.topic}` : `Пост для ${p}`;
    let body = `Это симуляция контента для платформы ${p}.\n\nТема: ${request.topic}`;
    
    if (request.brandProfile?.companyName) {
        body += `\n\n[Бренд-контекст применен: ${request.brandProfile.companyName}]`;
    }

    if (isRepurpose) {
        body = `[На основе видео]\n\nГлавный инсайт из источника: ${request.sourceContent?.slice(0, 100)}...\n\nМы адаптировали это для ${p}, чтобы вы могли применить эти знания уже сегодня.`;
    }

    if (p === Platform.DZEN) {
        title = `5 причин почему ${request.topic} изменит вашу жизнь`;
        body = `## Введение\n${isRepurpose ? 'В этом видео обсуждалось...' : 'Мы решили разобрать...'}\n\n## Основная часть\nПодробный разбор с Markdown разметкой.\n\n> Цитата эксперта\n\n## Заключение\nПодписывайтесь на канал!`;
    } else if (p === Platform.TWITTER) {
        body = `1/5 🧵 Давайте поговорим про ${request.topic}.\n\n${isRepurpose ? 'Посмотрел крутое видео, вот выжимка:' : 'Мои мысли на этот счет:'}\n\n👇 Читайте ниже`;
    } else if (p === Platform.YOUTUBE || p === Platform.RUTUBE) {
        title = `${request.topic} - Полный разбор за 10 минут`;
        body = `В этом видео мы разбираем ${request.topic}.\n\n00:00 Вступление\n01:30 Главный секрет\n05:45 Кейсы\n\n#${request.tone} #маркетинг`;
    } else if (p === Platform.TELEGRAM) {
        body = `${request.topic}\n\n${isRepurpose ? '⚡️ Выжимка из видео' : '🔥 Срочная новость'}\n\n1. Основной тезис.\n2. Второй тезис.\n3. Вывод.\n\nКоллеги, что думаете? 👇`;
    }

    return {
        id: crypto.randomUUID(),
        title,
        body,
        platform: p,
        status: ContentStatus.DRAFT,
        createdAt: new Date().toISOString(),
        tags: ['#demo', '#ai', '#repurpose'],
        campaignId: request.campaignId
    };
  });
};

export const analyzeVideoContent = async (url: string): Promise<{title: string, summary: string, hooks: string[]}> => {
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    return {
        title: "Автоматизация контента: От идеи до публикации",
        summary: "Видео описывает методологию 'Content Factory'.\n\nКлючевые идеи:\n1. Не создавайте контент с нуля каждый раз. Используйте 'Pillar Content' (например, длинное видео).\n2. Нарезайте одно видео на 10-20 единиц контента (Shorts, посты, статьи).\n3. Используйте AI для транскрибации и рерайта.\n4. Автоматизируйте постинг через API.",
        hooks: [
            "Как один час съемки превратить в месяц контента?",
            "Перестаньте писать посты руками: Стратегия Factory",
            "Вы теряете 80% трафика, не делая репропазинг"
        ]
    };
};
