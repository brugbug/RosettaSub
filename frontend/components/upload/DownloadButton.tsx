import { Button } from "@/components/ui/button";

interface DownloadButtonProps {
  filename: string;
}

// DownloadButton.tsx is a named component that takes a filename as a prop and generates a download link for the VTT file
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
