'use server';

import fs from 'fs/promises';
import path from 'path';

export async function saveSettings(settings: { geminiApiKey?: string }) {
  let envContent = '';
  try {
    envContent = await fs.readFile('.env', 'utf-8');
  } catch (error) {
    // .env file doesn't exist, we will create it.
  }

  const lines = envContent.split('\n');
  const newLines: string[] = [];
  const keysToUpdate = ['GEMINI_API_KEY'];
  const settingsMap: { [key: string]: string | undefined } = {
    GEMINI_API_KEY: settings.geminiApiKey,
  };

  lines.forEach(line => {
    const [key] = line.split('=');
    if (!keysToUpdate.includes(key)) {
      newLines.push(line);
    }
  });

  for (const key of keysToUpdate) {
    const value = settingsMap[key];
    if (value) {
      newLines.push(`${key}=${value}`);
    }
  }

  // Filter out empty lines from the end
  while (newLines.length > 0 && newLines[newLines.length - 1].trim() === '') {
    newLines.pop();
  }
  
  await fs.writeFile('.env', newLines.join('\n') + '\n');
}
