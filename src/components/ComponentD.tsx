
import { useQRCode } from 'next-qrcode';
import { useParams } from 'next/navigation';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Button } from './ui/button';
import Image from 'next/image';
import { ShieldCheckIcon } from 'lucide-react';
export default function ComponenetD() {
  const { SVG } = useQRCode();
  const params = useParams();

  const downloadPdf = async () => {
    const element = document.getElementById('contentToConvert');
    if (element) {
      // Use html2canvas with the scale option
      html2canvas(element, { scale: 1.2 }) // Adjust scale as needed
        .then(canvas => {
          const pdf = new jsPDF({
            orientation: 'p',
            unit: 'pt',
            format: 'a4'
          });
          
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
          pdf.save('download.pdf');
        });
    }
  };
  
  
  return (
    <>
      <p className="flex items-center justify-center font-medium p-4">Creation QR CODE</p>
   
    <Card className="w-full max-w-sm rounded-none" id="contentToConvert">
    <CardHeader>
      <div className="flex items-center justify-between" >
        <div className="flex items-center gap-2">
          <ShieldCheckIcon />
          <div className="leading-none">
            <CardTitle className="text-base">Cafe Latté</CardTitle>
            <CardDescription className="text-sm">Gourmet Coffee & Pastries</CardDescription>
          </div>
        </div>
        <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 p-1">
          <Image
            alt="Cafe Latté"
            height={64}
             src="/logo.png"
            style={{
              aspectRatio: "64/64",
              objectFit: "cover",
            }}
            width={64}
            className='rounded-lg'
          />
        </div>
      </div>
    </CardHeader>
    <CardContent className="flex flex-col items-center gap-2">
      <div className="border border-gray-200 dark:border-gray-800 p-2 rounded-lg">
      <SVG
            text={`http://localhost:3000/website/${params.menuId}`}
            options={{
              type: 'image/svg+xml',
              quality: 1,
              errorCorrectionLevel: 'M',
              margin: 3,
              scale: 4,
              width: 250,
             color: {
                dark: '#0D47A1', 
              },
            }}
          />
      </div>
      <CardDescription className="text-center">Scannez le code QR pour voir notre menu</CardDescription>
    </CardContent>
  </Card>
  <div>
  <Button className="mt-2" size="sm" onClick={downloadPdf}>
  Télécharger PDF
       </Button></div>
  </>
  );
}
