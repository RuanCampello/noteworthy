<div align="center">
  <a href="https://noteworthy-ebon.vercel.app">
    <img src="/public/assets/logo.svg" width="96px" alt="logo" />
  </a>
  <h1 align="center">Noteworthy</h1>
  <p align="center">
    Noteworthy is a sleek and efficient note-taking web application built with Next.js, Tailwind CSS, and TypeScript. It offers users a simple yet powerful platform to organise their thoughts, ideas, and tasks.
  </p>
  <div align="center">
    <a href="https://nextjs.org/" target="_blank">
      <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js" />
    </a>
    <a href="https://ui.shadcn.com/" target="_blank">
      <img src="https://img.shields.io/badge/shadcn-ui?style=flat-square&logo=shadcn%2Fui&color=000" alt="Shadcn" />
    </a>
    <a href="https://prisma.io" target="_blank">
      <img src="https://img.shields.io/badge/prisma-0?style=flat-square&logo=Prisma&color=121212" alt="Prisma" />
    </a>
    <a href="https://resend.com" target="_blank">
      <img src="https://img.shields.io/badge/resend-0?style=flat-square&logo=resend&color=101010" alt="Resend" />
    </a>
    <a href="https://zod.dev" target="_blank">
      <img src="https://img.shields.io/badge/zod-0?style=flat-square&logo=zod&logoColor=white&color=023e8a" alt="Zod" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
    </a>
    <a href="https://tailwindcss.com/" target="_blank">
      <img src="https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    </a>
    <a href="https://www.cloudflare.com/" target="_blank">
      <img src="https://img.shields.io/badge/Cloudflare-000?style=flat-square&logo=cloudflare&logoColor=fff&color=f77f00" alt="Cloudflare" />
    </a>
    <a href="https://noteworthy-ebon.vercel.app/" target="_blank">
      <img src="https://img.shields.io/badge/Deployed%20on-Vercel-blueviolet?style=flat-square" alt="Deployed on Vercel" />
    </a>
    <a href="https://choosealicense.com/licenses/mit/" target="_blank">
      <img src="https://img.shields.io/badge/License-MIT-green.svg?style=flat-square" alt="MIT License" />
    </a>
  </div>
</div>

## Stack

- **Frontend Framework**: Next.js
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Authentication**: NextAuth

## Design Inspiration

A significant portion of Noteworthy's UI design is inspired by the Figma community file [Nowted](https://www.figma.com/community/file/1188856976000269208/nowted-a-note-taking-app).

## Backend Architecture

Noteworthy's backend is built with Next.js server actions, Neon, and Prisma:

- **Next.js Server Actions**: Server-side logic is handled using Next.js server actions, providing efficient and scalable backend functionality.
- **Neon**: A serverless PostgreSQL database, Neon offers a powerful and flexible data storage solution for Noteworthy's backend operations.
- **Prisma**: Prisma serves as the ORM (Object-Relational Mapping) layer, simplifying database interactions and ensuring data integrity and security.

Forms across Noteworthy, including those for authentication and other user interactions, are validated using Zod, providing robust validation and ensuring data integrity.

Additionally, users' profile images are stored on Cloudflare R2, offering a secure and scalable solution for image storage.

## Features

### 1. Intuitive Interface

- Enjoy a clean and user-friendly interface for an effortless note-taking experience.

### 2. Server Components

- Utilise server components to render and hydrate components on the server, optimising performance and reducing client-side bundle size.

### 3. Note Management

- **Create Note**: Create a new note using pre-created colours and providing a name.
- **Favourite/Unfavourite Note**: Easily mark notes as favourites or remove them from favourites.
- **Archive/Unarchive Note**: Archive notes to keep your workspace clutter-free, and unarchive them when needed.
- **Search Notes**: Quickly find specific notes using the search functionality.
- **Filter Notes**: Filter notes by title alphabetically, by creation time (newest or oldest), or by update time (last update first), with the default filter being by update time.

> [!NOTE]
> A note cannot be archived and favourited at the same time; it's either one or none.

### 4. Dictionary

- **Word Definitions and Phonetics**: Look up definitions and phonetic transcriptions of words.
- **Word Pronunciation**: Audio pronunciations to help users learn the correct pronunciation.
- **Synonyms and Antonyms**: View synonyms and antonyms to enhance vocabulary.
- **Examples with Selected Words**: Display example sentences using the selected word for context.

## Authentication

Authentication in Noteworthy is powered by [NextAuth](https://authjs.dev/), supporting multiple authentication providers including:

- **Credentials (Email and Password)**: Users can sign up and log in using their email and password. The "forgot password" feature allows users to reset their password securely.
- **GitHub OAuth**: Users can authenticate using their GitHub account.
- **Google OAuth**: Users can authenticate using their Google account.

> [!IMPORTANT]
> The authentication system is immutable, ensuring that users cannot log in with the same email using different authentication methods.

## Note editor functionality

The note editor functionality in Noteworthy is powered by [Tiptap](https://github.com/ueberdosis/tiptap), a headless editor. Customized by me, it offers the following features:

- **Text Style**: Choose from heading levels (1 to 4) or paragraphs.
- **Font Family**: Select from 6 available fonts, including Garamond, Montserrat, Lobster, Didot, Merriweather, and Source Sans 3 (default).
- **Font Size**: Change the font size using pre-selected values, with the default set to 12px.
- **Alignment**: Align text to left, center, right, or justify, with the default alignment set to left.
- **Text Formatting**: Format text with options to bold, Italicise, underline, strike, highlight, superscript, or subscript.

## Keyboard Shortcuts

Enhance your productivity with these keyboard shortcuts:

- Align left: Ctrl+Shift+L
- Align center: Ctrl+Shift+E
- Align right: Ctrl+Shift+R
- Justify: Ctrl+Shift+J
- Bold: Ctrl+B
- Italic: Ctrl+I
- Underline: Ctrl+U
- Strike: Ctrl+Shift+S
- Highlight: Ctrl+Shift+H
- Save note: Ctrl+S

## Installation

To run Noteworthy locally, follow these steps:

1. Clone this repository to your local machine.
2. Navigate to the project directory.
3. Create a `.env` file and fill it with your configuration. Use the following template:

```
DATABASE_URL=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

AUTH_SECRET=

CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_BUCKET_NAME=
CLOUDFLARE_ACCESS_KEY=
CLOUDFLARE_SECRET_KEY=
NEXT_PUBLIC_CLOUDFLARE_DEV_URL=

RESEND_API_KEY=

NEXT_PUBLIC_HOSTNAME=http://localhost:3000
```

4. Install dependencies using `npm install`.
5. Start the development server using `npm run dev`.
6. Open your web browser and visit http://localhost:3000.

## Contributing

Contributions are welcome! If you have any suggestions, bug reports, or feature requests, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](/LICENSE.md).
