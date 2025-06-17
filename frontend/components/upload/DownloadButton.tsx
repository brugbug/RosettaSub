import { Button } from "@/components/ui/button";

interface DownloadButtonProps {
  filename: string;
  label: string;
}

// DownloadButton.tsx is a named component that takes a filename as a prop and generates a download link for the VTT file
export function DownloadButton({ filename, label }: DownloadButtonProps) {
  const fileUrl = `${process.env.NEXT_PUBLIC_API_URL}/download/${filename}`;

  return (
    <a href={fileUrl} download>
      <Button variant="outline">
        {label}
      </Button>
    </a>
  );
}
