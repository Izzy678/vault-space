export const sampleFiles = [
  { name: "Research-notes.pdf", type: "PDF", size: "2.4 MB" },
  { name: "Project-report.docx", type: "DOCX", size: "1.8 MB" },
  { name: "Experiment-data.csv", type: "CSV", size: "846 KB" },
  { name: "Presentation.pdf", type: "PDF", size: "5.2 MB" },
] as const;

export const capabilities = [
  ["Encrypted in your browser", "File content is encrypted before upload."],
  ["A protected key for every file", "Each AES key receives separate RSA protection."],
  ["Checked on retrieval", "Decryption verifies the file’s authentication tag."],
] as const;

export const features = [
  ["A place for your files", "Upload documents, find what you need, and retrieve files from a familiar file list."],
  ["Keys kept under protection", "Every file uses a unique AES key. RSA-OAEP protects that key separately from the file content."],
  ["Access with intention", "Sign in to your account and unlock your vault before performing protected file operations."],
  ["Integrity built into retrieval", "AES-GCM decryption rejects content when its authentication check fails."],
] as const;

export const uploadSteps = [
  { title: "Select your file", body: "Choose a file from your device. VaultSpace generates a fresh AES key.", icon: "folder" },
  { title: "Encrypt the content", body: "AES-256-GCM encrypts the file in your browser and produces an authentication tag.", icon: "lock" },
  { title: "Protect the file key", body: "Your RSA public key protects the AES key using RSA-OAEP.", icon: "key" },
  { title: "Store the protected result", body: "The encrypted file, protected key, and required metadata are uploaded for storage.", icon: "upload" },
] as const;

export const faqs = [
  ["What happens when I upload a file?", "Your browser encrypts the file with a fresh AES-256-GCM key and protects that key with RSA-OAEP. The encrypted file and protected key are sent for storage."],
  ["Why use two kinds of encryption?", "AES-GCM protects the file content. RSA-OAEP protects its AES key separately, so each method has a specific job in the same workflow."],
  ["Is my vault passphrase my login password?", "They serve different purposes. Your login password signs you in. Your vault passphrase unlocks the cryptographic credentials used for file operations in your browser."],
  ["Do I have to copy encryption keys?", "No. VaultSpace creates and protects a file key during upload, then recovers it through the vault workflow when you retrieve the file."],
  ["What if I lose my vault passphrase?", "An account password reset does not restore your vault key. Losing the required vault credentials can make encrypted files inaccessible. Keep your passphrase safe."],
] as const;
