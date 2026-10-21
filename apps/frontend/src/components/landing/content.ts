export const uploadSteps = [
  ["Select", "A fresh AES key is created for this file."],
  ["Encrypt", "AES-256-GCM encrypts it in the browser and produces an authentication tag."],
  ["Wrap the key", "Your public key protects that key with RSA-OAEP."],
  ["Store", "The encrypted file, wrapped key, and metadata are uploaded."],
] as const;

export const faqs = [
  ["Is my vault passphrase my login password?", "They serve different purposes. Your login password signs you in. Your vault passphrase unlocks the cryptographic credentials used for file operations in your browser."],
  ["Do I have to copy encryption keys?", "No. VaultSpace creates and protects a file key during upload, then recovers it through the vault workflow when you retrieve the file."],
  ["What if I lose my vault passphrase?", "An account password reset does not restore your vault key. Losing the required vault credentials can make encrypted files inaccessible. Keep your passphrase safe."],
  ["What does VaultSpace store about a file?", "The encrypted file and its wrapped key. The file name, type, size, and timestamps are stored as ordinary records."],
  ["How much can I store?", "The default quota is 50 MB of encrypted data."],
] as const;
