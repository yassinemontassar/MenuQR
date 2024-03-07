import { useQRCode } from 'next-qrcode';

export default function ComponenetD() {
  const { Canvas } = useQRCode();

  return (
    <div className="flex flex-col items-center justify-center text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md">
        <h2 className="text-3xl font-bold mb-4 text-center">Scan the QR Code</h2>
        <div className="w-full flex justify-center mb-6">
          <Canvas
            text={'https://www.facebook.com/yassine.baws/'}
            options={{
              type: 'image/jpeg',
              quality: 0.3,
              errorCorrectionLevel: 'M',
              margin: 3,
              scale: 4,
              width: 250,
             color: {
                dark: '#0D47A1', // Deep Blue for dark theme
                light: '#FFFFFF', // Pale Yellow for light theme
              },
            }}
            logo={{
              src: 'https://vhhmbutvwghyqakchxcg.supabase.co/storage/v1/object/public/MenuLogo/cltc50i7g000010f5e8t8nry7/logo/000015yux1.png',
              options: {
                width: 80,
              }
            }}
          />
        </div>
        <p className="text-center ">
          Scan the QR code to visit your menu.
        </p>
      </div>
    </div>
  );
}
