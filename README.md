### Folder Structure

src/
├── components/
│ ├── auth/
│ │ ├── Login.jsx
│ │ └── DropboxAuth.jsx
│ ├── secrets/
│ │ ├── SecretList.jsx
│ │ ├── SecretCard.jsx
│ │ ├── SecretForm.jsx
│ │ └── SecretDetail.jsx
│ └── common/
│ ├── Header.jsx
│ ├── SearchBar.jsx
│ └── LoadingSpinner.jsx
├── services/
│ ├── dropboxService.js // Dropbox API calls
│ ├── encryptionService.js // Encrypt/decrypt logic
│ └── secretsService.js // CRUD business logic
├── hooks/
│ ├── useSecrets.js // Secrets state management
│ ├── useDropbox.js // Dropbox connection
│ └── useEncryption.js // Encryption utilities
├── contexts/
│ ├── AuthContext.jsx // Master password + Dropbox auth
│ └── SecretsContext.jsx // Global secrets state
├── utils/
│ ├── crypto.js // Crypto helper functions
│ └── validators.js // Input validation
├── App.jsx
└── main.jsx
