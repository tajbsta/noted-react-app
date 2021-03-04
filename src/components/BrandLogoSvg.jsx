import React from "react";

const pageLocation = global.location.pathname;

const guestViews = [
  "/",
  "/login",
  "/join",
  "/forgot-password",
  "/reset-password",
  "/request-permission/",
  "/request-permission",
];

function BrandLogoSvg() {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 341.85 85.59"
        className={`${
          guestViews.indexOf(pageLocation) != -1
            ? "main-brand-logo"
            : "dashboard-logo"
        }`}
      >
        <path
          d="M51.88 85.59V43.1a21.66 21.66 0 00-.75-5.77 14.38 14.38 0 00-2.57-5.16 11.14 11.14 0 00-2-2 .33.33 0 01-.14-.29 5.68 5.68 0 00-1.7-3.9l-6.21-6.18-2.93-2.93-.18-.19.2-.21c3-3 5.95-6 8.94-8.94a6.09 6.09 0 001.69-2.73.17.17 0 000-.07h.23a39.9 39.9 0 014.42.27 30.46 30.46 0 017.31 1.69 23.62 23.62 0 018.73 5.55 25.36 25.36 0 014.53 6.35 34.42 34.42 0 012.84 8.11c.35 1.61.61 3.23.8 4.86a50.94 50.94 0 01.33 5.38 2 2 0 000 .24v48.41zM0 6.46h23.6v5.7a.46.46 0 01-.16.34A5.89 5.89 0 0022 14.55a5.75 5.75 0 001.28 6.19l7.85 7.86.19.2-.13.06A11.32 11.32 0 0025.15 35 17.3 17.3 0 0024 39a27.24 27.24 0 00-.38 4.77v41.82H0z"
          fill="#570097"
          className="path"
        ></path>
        <path
          d="M31.9 16.73a.92.92 0 01.22.17L43 27.76a3.25 3.25 0 01-2 5.58 3.19 3.19 0 01-2.61-1q-6.64-6.62-13.29-13.27a3.3 3.3 0 01-.19-4.58l.19-.2Q31.73 7.66 38.36 1a3.36 3.36 0 011.72-1 3.25 3.25 0 013 5.45l-.2.2-10.76 10.81a1.32 1.32 0 01-.22.18zm99.22 68.59h-2.74V72.94h2.74v2.84c.61-2.07 1.72-3.11 3.39-3.11a4 4 0 012.2.48l-.45 2.52a3.91 3.91 0 00-1.83-.42c-2.23 0-3.31 2.14-3.31 5.62zm19.32-5.22h-9.83a3.55 3.55 0 003.79 3.1 3.81 3.81 0 003.37-1.78l2.22 1a6.15 6.15 0 01-5.72 3.19 6.23 6.23 0 01-6.37-6.5 6.12 6.12 0 011.83-4.64 6.24 6.24 0 014.54-1.78 6 6 0 014.45 1.78 6.26 6.26 0 011.75 4.64 8.24 8.24 0 01-.03.99zm-2.65-2a3.34 3.34 0 00-3.52-3 3.46 3.46 0 00-3.66 3zm9.28-9.85v4.69h2.63v2.25h-2.63v10.13h-2.73V75.19h-2.22v-2.25h2.22v-4.69zm13.58 4.69h2.73v12.38h-2.73v-1.8a4.26 4.26 0 01-3.65 2.07c-3.05 0-4.82-2-4.8-5.44v-7.21h2.74v6.89c0 2 1.06 3.1 2.57 3.1a3 3 0 003.18-3.34zm9.25 12.38h-2.73V72.94h2.73v2.84c.61-2.07 1.73-3.11 3.4-3.11a4 4 0 012.2.48l-.45 2.52a3.91 3.91 0 00-1.83-.42c-2.23 0-3.32 2.14-3.32 5.62zm10.58 0h-2.73V72.94h2.73v1.85a4.28 4.28 0 013.79-2.12c3 0 4.72 1.94 4.72 5.44v7.21h-2.73v-6.89c0-1.94-1-3.08-2.6-3.08a3 3 0 00-3.18 3.32zM205.57 80c-2.57-.72-3.61-2-3.42-4a3 3 0 011.4-2.31 5 5 0 013-1c2.44 0 4.37 1.2 4.5 3.66h-2.59a1.63 1.63 0 00-1.78-1.35 2.14 2.14 0 00-1.75.69 1.24 1.24 0 00-.1 1.11c.13.4.63.72 1.51 1l1.91.48c2.14.53 3.23 1.73 3.23 3.61 0 2.33-2 3.74-4.93 3.74a5.31 5.31 0 01-3.29-1.09 3.67 3.67 0 01-1.46-3h2.52c.13 1.09 1 1.78 2.44 1.78s2.2-.56 2.2-1.49c0-.71-.58-1.19-1.72-1.46zm33.33-7.06l-4.54 12.38h-2.25L229 76.55l-3 8.77h-2.3L219 72.94h3l2.86 8.35 2.86-8.35h2.55l2.86 8.35 2.87-8.35zm5.54-5.01a1.72 1.72 0 01-1.8 1.72 1.73 1.73 0 110-3.45 1.73 1.73 0 011.8 1.73zm-3.16 17.39V72.94H244v12.38zm10.24-17.07v4.69h2.62v2.25h-2.62v10.13h-2.73V75.19h-2.23v-2.25h2.23v-4.69zm7.93 17.07h-2.74V66.2h2.74v8.62a3.26 3.26 0 011.64-1.59 5.28 5.28 0 012.28-.56c3.15 0 5 2.07 5 5.6v7h-2.73v-6.84a2.79 2.79 0 00-2.76-3.08 3.19 3.19 0 00-3.44 3.32zm22.06 0h-2.74V66.2h2.74v8.62a3.26 3.26 0 011.64-1.59 5.28 5.28 0 012.28-.56c3.15 0 5 2.07 5 5.6v7h-2.73v-6.84a2.79 2.79 0 00-2.7-3.08 3.19 3.19 0 00-3.44 3.32zm24.34-5.22H296a3.56 3.56 0 003.79 3.1 3.79 3.79 0 003.37-1.78l2.23 1a6.17 6.17 0 01-5.73 3.19 6.21 6.21 0 01-6.36-6.5 6.15 6.15 0 011.82-4.64 6.25 6.25 0 014.54-1.78 6 6 0 014.45 1.78 6.26 6.26 0 011.75 4.64c.01.48.01.8-.01.99zm-2.66-2a3.34 3.34 0 00-3.52-3 3.46 3.46 0 00-3.66 3zm15.22 7.22v-1.78a5 5 0 01-4.16 2 6.46 6.46 0 010-12.92 5 5 0 014.16 2v-1.68h2.71v12.38zm-1.19-9a3.83 3.83 0 00-2.65-1 3.71 3.71 0 00-2.7 1.06 3.58 3.58 0 00-1.09 2.7 3.71 3.71 0 003.79 3.84 3.7 3.7 0 003.82-3.84 3.44 3.44 0 00-1.17-2.72zm10.45 9h-2.73V72.94h2.73v2.84c.61-2.07 1.72-3.11 3.39-3.11a4 4 0 012.2.48l-.45 2.52a3.88 3.88 0 00-1.83-.42c-2.22 0-3.31 2.14-3.31 5.62zm11.56-17.07v4.69h2.62v2.25h-2.62v10.13h-2.73V75.19h-2.23v-2.25h2.23v-4.69zM173.61 55.17a14.16 14.16 0 01-10.21-4 13.8 13.8 0 01-4.15-10.44 13.65 13.65 0 014.15-10.38 15.07 15.07 0 0120.41 0 13.7 13.7 0 014.19 10.4 13.85 13.85 0 01-4.21 10.44 14.15 14.15 0 01-10.18 3.98zm6.29-14.42a6.27 6.27 0 10-12.53 0 6.27 6.27 0 1012.53 0zM203.58 27h5.81v6.53h-5.81v21.16h-8.19V33.51h-5V27h5V16.36h8.19zm35.13 22.65c-2.55 3.74-6.77 5.64-12.64 5.64a14.37 14.37 0 01-10.32-4 14 14 0 01-4.16-10.5 13.66 13.66 0 014.16-10.38 14.28 14.28 0 0110.32-4 13.56 13.56 0 0110.09 4.09 14.06 14.06 0 014.09 10.5c0 .77-.06 1.6-.12 2.55h-20.29c.42 3 3.56 4.63 6.82 4.63a7.3 7.3 0 006.06-2.61zm-6.77-11.27c-.83-6.29-10.68-6.35-12 0zm40.89 16.31h-8.18v-3.44c-1.37 2.56-4.57 4-8.13 4a12.93 12.93 0 01-9.5-4 14.28 14.28 0 01-3.91-10.38A14.38 14.38 0 01247 30.43a13 13 0 019.5-4c3.56 0 6.76 1.54 8.13 4V11.91h8.18zm-14.77-20.53a6.35 6.35 0 00-6.41 6.59 6.35 6.35 0 006.41 6.7 6.45 6.45 0 006.41-6.7 6.25 6.25 0 00-6.41-6.59zm23.11 13.3a2 2 0 00-1.32.39 2.42 2.42 0 00-.88 2 4 4 0 00.77 2.1 14.09 14.09 0 003.18 3.05.22.22 0 00.14.06.21.21 0 00.1-.06 14.34 14.34 0 003.12-3 4.75 4.75 0 00.76-1.42 2.75 2.75 0 000-1.58 2.29 2.29 0 00-1.49-1.52 1.88 1.88 0 00-1.05 0 3.27 3.27 0 00-1.47 1.12 3.62 3.62 0 00-1.31-1.06 1.85 1.85 0 00-.55-.08zm-134.63 7.23V39.83a7.62 7.62 0 00-.26-2 5 5 0 00-.9-1.81 4 4 0 00-.69-.68.11.11 0 01-.05-.1 2 2 0 00-.6-1.37l-2.18-2.18-1-1a.46.46 0 00-.07-.07l.07-.07 3.14-3.17a2.15 2.15 0 00.6-1h.08a13.07 13.07 0 011.53.08 10.7 10.7 0 012.56.59A8.24 8.24 0 01151.8 29a8.8 8.8 0 011.59 2.23 11.89 11.89 0 011 2.83 14 14 0 01.28 1.7 17 17 0 01.12 1.88v17.05zM128.39 27h8.25a.2.2 0 010 .07V29a.13.13 0 01-.06.12 2.31 2.31 0 00-.5.73 2 2 0 00.45 2.17l2.75 2.75.06.07a4 4 0 00-2.15 2.16 5.82 5.82 0 00-.41 1.39 9.4 9.4 0 00-.13 1.67v14.63h-8.26z"
          fill="#570097"
          className="path"
        ></path>
        <path
          d="M139.55 30.6a.24.24 0 01.08.06c1.27 1.26 2.53 2.53 3.8 3.8a1.13 1.13 0 01.35.89 1.15 1.15 0 01-1 1.06 1.08 1.08 0 01-.91-.34l-4.66-4.66a1.14 1.14 0 01-.36-.89 1.18 1.18 0 01.29-.71.46.46 0 00.07-.07q2.33-2.31 4.64-4.64a1.19 1.19 0 01.6-.33 1.13 1.13 0 011.35.92 1.1 1.1 0 01-.3 1l-.07.07-3.76 3.76-.08.06z"
          fill="#570097"
          className="path"
        ></path>
      </svg>
    </div>
  );
}

export default BrandLogoSvg;
