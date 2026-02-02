
export const validateTelegramToken = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const data = await response.json();
    return data.ok;
  } catch (error) {
    console.error('Telegram Validation Error:', error);
    return false;
  }
};

export const sendTelegramMessage = async (
  token: string, 
  chatId: string, 
  text: string,
  contentId: string
): Promise<any> => {
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML', // Using HTML to allow basic formatting if generated, but safe enough
        // Add Inline buttons to simulate interaction tracking
        reply_markup: {
          inline_keyboard: [
            [
              { text: '👍 Like', callback_data: `like_${contentId}` },
              { text: '👎 Dislike', callback_data: `dislike_${contentId}` }
            ],
            [
              { text: '🔗 View in Dashboard', url: window.location.origin }
            ]
          ]
        }
      }),
    });

    const data = await response.json();
    
    if (!data.ok) {
      throw new Error(data.description || 'Failed to send message to Telegram');
    }

    return data;
  } catch (error) {
    console.error('Telegram Send Error:', error);
    throw error;
  }
};
