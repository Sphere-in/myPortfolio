// export default function AdminLayout({ children }) {
//     return <>{children}</>
//   }

import { Toaster } from 'sonner';

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
