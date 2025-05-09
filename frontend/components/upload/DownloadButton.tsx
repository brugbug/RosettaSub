// components/DownloadButton.tsx
import { Button } from "@/components/ui/button";

interface DownloadButtonProps {
  filename: string;
}

export function DownloadButton({ filename }: DownloadButtonProps) {
  const fileUrl = `${process.env.NEXT_PUBLIC_API_URL}/download/${filename}`;

  return (
    <a href={fileUrl} download>
      <Button variant="outline">
        Download VTT
      </Button>
    </a>
  );
}
