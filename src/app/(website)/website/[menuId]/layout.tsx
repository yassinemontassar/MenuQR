import { redirect } from 'next/navigation';
import prisma from '@/app/lib/db';
import { Metadata } from 'next';
import Header from '../componenets/header';



// export const metadata: Metadata = {
//   title: "website",
//   description: "Generated by create next app",
// };

export default async function websiteLayout({
   
  children,
  params
}: {
  children: React.ReactNode
  params: { menuId: string }
}) {

  

  const store = await prisma.menu.findFirst({ 
    where: {
      id: params.menuId,
    }
   });


  if (!store) {
    redirect('/');
  };

  return (
    <>
    <Header />
      {children}

    </>
  );
};