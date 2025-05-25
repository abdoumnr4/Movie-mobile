import * as SecureStore from 'expo-secure-store';
import CryptoJS from 'crypto-js';
import Constants from 'expo-constants';

//la clé de chiffrement est stockée dans le fichier app.config.js
const KEY = Constants.expoConfig?.extra?.ENCRYPTION_KEY


interface SecureStorageInterface {
  setItem: (key: string, value: any) => Promise<void>;
  getItem: (key: string) => Promise<any>;
  removeItem: (key: string) => Promise<void>;
}

class SecureStorage implements SecureStorageInterface {
  private encrypt(data: any): string {
    const jsonString = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonString, KEY).toString();
  }

  private decrypt(encryptedData: string): any {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, KEY);
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedString);
    } catch (error) {
      console.error('Erreur de déchiffrement:', error);
      return null;
    }
  }

  async setItem(key: string, value: any): Promise<void> {
    try {
      const encryptedValue = this.encrypt(value);
      await SecureStore.setItemAsync(key, encryptedValue);
    } catch (error) {
      console.error('Erreur lors du stockage sécurisé:', error);
      throw error;
    }
  }

  async getItem(key: string): Promise<any> {
    try {
      const encryptedValue = await SecureStore.getItemAsync(key);
      if (!encryptedValue) return null;
      return this.decrypt(encryptedValue);
    } catch (error) {
      console.error('Erreur lors de la récupération:', error);
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      throw error;
    }
  }
}

export const secureStorage = new SecureStorage();
