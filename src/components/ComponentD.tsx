import {
  Card,
  CardContent,
  CardDescription,
  CardHeader
} from "@/components/ui/card";
import axios from "axios";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Loader, Loader2 } from "lucide-react";
import { useQRCode } from "next-qrcode";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
export default function ComponenetD() {
  const { Canvas } = useQRCode();
  const params = useParams();
  const [menuData, setMenu] = useState<any>([]);
  const [isFetchingMenu, setIsFetchingMenu] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsFetchingMenu(true);
        const response = await axios.get(`/api/menus/${params.menuId}`);
        setMenu(response.data);
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setIsFetchingMenu(false);
      }
    };
    fetchMenu();
  }, [params.menuId]);

  const downloadPdf = async () => {
    setIsDownloadingPdf(true);
    const element = document.getElementById("contentToConvert");
    if (element) {
      // Use html2canvas with the scale option
      html2canvas(element, { scale: 3 }) // Adjust scale as needed
        .then((canvas) => {
          const pdf = new jsPDF({
            orientation: "p",
            unit: "in",
            format: [6, 4],
          });
          const margin = 30;
          const pageSize = pdf.internal.pageSize;
          const imageWidth = pageSize.getWidth();
          const imageHeight = pageSize.getHeight();
          pdf.addImage(
            canvas.toDataURL("image/png"),
            "PNG",
            0,
            0,
            imageWidth,
            imageHeight
          );
          pdf.save(`${menuData.name}.pdf`);
          setIsDownloadingPdf(false);
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
            <div className="flex flex-col items-center justify-center">
              {" "}
              {/* Centering content */}
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
              <div className="font-medium leading-none p-2">{menuData.name}</div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-2">
            <div className="border shadow-lg border-gray-200 dark:border-gray-800 p-2 rounded-lg">
              <Canvas
                text={`https://www.menurapide.tn/website/${params.menuId}`}
                options={{
                  type: "image/svg+xml",
                  quality: 1,
                  errorCorrectionLevel: "M",
                  margin: 3,
                  scale: 4,
                  width: 250,
                  color: {
                    dark: "#0D47A1",
                  },
                }}
              />
            </div>
            <CardDescription className="text-center mt-2">
              <p className="mb-3">Scannez le code QR pour voir notre menu</p>
              <p>Visiter notre siteweb</p>
              <p className="text-black">menurapide.tn</p>
            </CardDescription>
          </CardContent>
        </Card>
      )}
      <Button
        className="mt-2"
        size="sm"
        disabled={isDownloadingPdf}
        onClick={downloadPdf}
      >
        {isDownloadingPdf ? "Téléchargement en cours..." : "Télécharger PDF"}
              {isDownloadingPdf && (
                <Loader size={20} className="text-background animate-spin" />
              )}
      </Button>
    </>
  );
}
