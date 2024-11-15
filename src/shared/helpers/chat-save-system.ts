import * as fs from "fs";
import * as crypto from "crypto";
import { networkInterfaces } from "os";
import { IMAGE_BASE_URL } from "../constants/base-paths";

interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: number;
  type: "text" | "file";
  fileMetadata?: {
    name: string;
    size: number;
    type: string;
    path?: string;
  };
}

class ChatSaveSystem {
  private static instance: ChatSaveSystem;
  private readonly MAC_ADDRESS: string;
  private readonly ENCRYPTION_KEY: string;
  private readonly MAX_STORAGE_BYTES = 500 * 1024 * 1024; // 500MB

  private constructor() {
    this.MAC_ADDRESS = this.getMacAddress();
    this.ENCRYPTION_KEY = this.generateEncryptionKey(this.MAC_ADDRESS);
  }

  public static getInstance(): ChatSaveSystem {
    if (!ChatSaveSystem.instance) {
      ChatSaveSystem.instance = new ChatSaveSystem();
    }
    return ChatSaveSystem.instance;
  }

  private getMacAddress(): string {
    const interfaces = networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      const networkInterface = interfaces[name];
      if (networkInterface) {
        for (const net of networkInterface) {
          if (!net.internal) {
            return net.mac;
          }
        }
      }
    }
    throw new Error("No MAC address found");
  }

  private generateEncryptionKey(macAddress: string): string {
    return crypto.createHash("sha256").update(macAddress).digest("hex");
  }

  private encrypt(data: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(this.ENCRYPTION_KEY, "hex"),
      iv,
    );
    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");
    return `${iv.toString("hex")}:${encrypted}`;
  }

  private decrypt(data: string): string {
    const [ivHex, encryptedData] = data.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(this.ENCRYPTION_KEY, "hex"),
      iv,
    );
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }

  private getChatFilePath(userId: string): string {
    return `./local-storage/chat-message-${userId}.json`;
  }

  private getFileStoragePath(filename: string): string {
    return `./local-storage/files/${filename}`;
  }

  private ensureDirectoryExists(): void {
    if (!fs.existsSync("./local-storage")) {
      fs.mkdirSync("./local-storage");
    }
    if (!fs.existsSync("./local-storage/files")) {
      fs.mkdirSync("./local-storage/files");
    }
  }

  public async saveMessage(
    userId: string,
    message: ChatMessage,
  ): Promise<void> {
    this.ensureDirectoryExists();
    const filePath = this.getChatFilePath(userId);

    let messages: ChatMessage[] = [];
    if (fs.existsSync(filePath)) {
      const encryptedData = fs.readFileSync(filePath, "utf8");
      messages = JSON.parse(this.decrypt(encryptedData));
    }

    messages.push(message);
    const encryptedMessages = this.encrypt(JSON.stringify(messages));
    fs.writeFileSync(filePath, encryptedMessages);
  }

  public async getMessages(userId: string): Promise<ChatMessage[]> {
    const filePath = this.getChatFilePath(userId);
    if (!fs.existsSync(filePath)) {
      return [];
    }

    const encryptedData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(this.decrypt(encryptedData));
  }

  public async saveFile(
    userId: string,
    file: Buffer,
    filename: string,
  ): Promise<ChatMessage> {
    this.ensureDirectoryExists();

    // Check storage limit
    const userFiles = await this.getUserFiles(userId);
    const totalSize = userFiles.reduce((acc, file) => acc + file.size, 0);
    const newFileSize = file.length;

    if (totalSize + newFileSize > this.MAX_STORAGE_BYTES) {
      throw new Error("Storage limit exceeded");
    }

    const encryptedFile = this.encrypt(file.toString("base64"));
    const storagePath = this.getFileStoragePath(`${userId}-${filename}`);
    fs.writeFileSync(storagePath, encryptedFile);

    // Create a file message
    const fileMessage: ChatMessage = {
      id: crypto.randomUUID(),
      senderId: userId,
      content: filename,
      timestamp: Date.now(),
      type: "file",
      fileMetadata: {
        name: filename,
        size: newFileSize,
        type: filename.split(".").pop() || "",
        path: storagePath,
      },
    };

    // Save the file message
    await this.saveMessage(userId, fileMessage);

    return fileMessage;
  }

  public async getFile(filePath: string): Promise<Buffer> {
    if (!fs.existsSync(filePath)) {
      throw new Error("File not found");
    }

    const encryptedData = fs.readFileSync(filePath, "utf8");
    const decryptedBase64 = this.decrypt(encryptedData);
    return Buffer.from(decryptedBase64, "base64");
  }

  private async getUserFiles(
    userId: string,
  ): Promise<{ name: string; size: number }[]> {
    const filesDir = "./local-storage/files";
    if (!fs.existsSync(filesDir)) {
      return [];
    }

    const files = fs
      .readdirSync(filesDir)
      .filter((filename) => filename.startsWith(userId));

    return files.map((filename) => ({
      name: filename,
      size: fs.statSync(`${filesDir}/${filename}`).size,
    }));
  }
}

export const chatSaveSystem = ChatSaveSystem.getInstance();
