import { useQRCode } from "next-qrcode";
import { useParams } from "next/navigation";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import Image from "next/image";
import { Loader2, ShieldCheckIcon } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
export default function ComponenetD() {
  const { Canvas } = useQRCode();
  const params = useParams();
  const [menuData, setMenu] = useState<any>([]);
  const [isFetchingMenu, setIsFetchingMenu] = useState(false);
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsFetchingMenu(true)
        const response = await axios.get(`/api/menus/${params.menuId}`);
        setMenu(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setIsFetchingMenu(false)
      }
    };
    fetchMenu();
  }, [ params.menuId]);

  const downloadPdf = async () => {
    const element = document.getElementById("contentToConvert");
    if (element) {
      // Use html2canvas with the scale option
      html2canvas(element, { scale: 3 }) // Adjust scale as needed
        .then((canvas) => {
          const pdf = new jsPDF({
            orientation: "p",
            unit: "pt",
            format: "a4",
          });

          pdf.addImage(
            canvas.toDataURL("image/png"),
            "PNG",
            0,
            0,
            pdf.internal.pageSize.getWidth(),
            pdf.internal.pageSize.getHeight()
          );
          pdf.save("download.pdf");
        });
    }
  };

  return (
    <>
      <p className="flex items-center justify-center font-medium p-4">
        Creation QR CODE
      </p>
      {isFetchingMenu ? (
        <>
         <div className="flex items-center justify-center p-16">
         <Loader2 size={40} className="text-primary animate-spin" />
         <p className="text-gray-500 ml-4">Chargement QR CODE</p>
       </div>
       </>
      ) : (
        <Card className="w-full max-w-sm rounded-none" id="contentToConvert">
        <CardHeader>
          <div className="flex flex-col items-center justify-center"> {/* Centering content */}
          <div className="overflow-hidden">
            <Image
              alt={menuData.name}
              height={60}
              src={menuData.imageUrl}
              width={60}
              className="rounded-full"
              quality={100}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
              <div className="font-medium leading-none">{menuData.name}</div>

         
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-2">
          <div className="border border-gray-200 dark:border-gray-800 p-2 rounded-lg">
            <Canvas
              text={`${process.env.NEXT_PUBLIC_BASE_URL}/website/${params.menuId}`}
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
          <CardDescription className="text-center">
            <p className="mb-3">Scannez le code QR pour voir notre menu</p>
            <p>Visiter notre siteweb patata.tn</p>
          </CardDescription>
        </CardContent>
      </Card>
      
      )}
        <Button className="mt-2" size="sm" onClick={downloadPdf}>
          Télécharger PDF
        </Button>
         </>
 
  );
}
