import { redirect } from 'next/navigation';
import prisma from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/auth';
import Header from '@/components/header';
import { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from '@/providers/provider';



// export const metadata: Metadata = {
//   metadataBase: new URL('http://localhost:3000/'),
//   title: {
//     default:'MenuQR - Create your own menu',
//     template:"%s - MenuQR - Create your own menu"
//   },
// }

export default async function DashboardLayout({
   
  children,
  params
}: {
  children: React.ReactNode
  params: { userId: string }
}) {
const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/');
  }

  const store = await prisma.user.findFirst({ 
    where: {
      id: params.userId,
    }
   });


  if (!store) {
    redirect('/');
  };

  return (
    <>
      <Header />
      <Providers>
      {children}
      </Providers>
      <Toaster />
    </>
  );
};